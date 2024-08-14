interface ISendMessage{
  message: string,
  data?: any
}
export function sendMessage({message, data}: ISendMessage) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({message:message, data:data}, response => {
      if (chrome.runtime.lastError) {
        reject({success:false, data: response});
      } else {
        resolve({success:true,data: response});
      }
    });
  });
}