export function getStorage(name: string): Promise<{success: boolean, data: any}> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(name, (result) => {
      if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError)
        resolve({success: false, data:"Chrome Error"});
      }else if(Object.keys(result).length <= 0){
        resolve({success: false, data: "Not Found"})
      }else {
        resolve({success: true, data: result[name]});
      }
    });
  });
}
