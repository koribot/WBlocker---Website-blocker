export function getStorage(name: string): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(name, (result) => {
      if (chrome.runtime.lastError) {
        reject({success: false, data:chrome.runtime.lastError});
      } else {
        resolve({success: true, data: result[name]});
      }
    });
  });
}
