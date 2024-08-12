export function setStorage({ name, value }: { name: string, value: any }): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [name]: value }, () => {
      if (chrome.runtime.lastError) {
        reject({success:false, data:chrome.runtime.lastError});
        return false
      } else {
        resolve({success: true, data: {name: value}});
      }
    });
  });
}