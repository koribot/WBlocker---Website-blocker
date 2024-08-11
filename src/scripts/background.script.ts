chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  /***COMMENT THIS LINES OF CODES WHEN YOU BUILD THE PROJECT FOR PRODUCTION SO IT WILL NOT BE INCLUDED*/
  const _manifest: any = chrome.runtime.getManifest();
  const contentScripts: any = _manifest.content_scripts;
  if (request.type === "reload") {
    console.log("Received message:", request.type);
    const scriptsPath: any = [];
    const matchUrls: any = [];
    for (const item of contentScripts) {
      for (const js of item.js) {
        scriptsPath.push(js);
      }
    }
    for (const item of contentScripts) {
      for (const url of item.matches) {
        if (!item.js.includes("dist/utils/socket.script.js")) {
          matchUrls.push(url);
          break;
        }
      }
    }
    chrome.tabs.query({url: matchUrls, currentWindow: true}, function (tabs) {
      tabs.forEach((tab: any, index: number) => {
          if (tab.id && tab.url) {
            // if (index < matchUrls.length) {
            // console.log(matchUrls[index], tab.url)
            // if (matchUrls[index] === tab.url) {
            // if (index < scriptsPath.length) {
              // setTimeout(() => {
              //   chrome.runtime.reload();
              // }, 1);
              // chrome.scripting.executeScript({
              //   target: { tabId: tab.id },
              //   files: [scriptsPath[index]],
              // });
              chrome.tabs.reload(tab.id);
              chrome.runtime.reload()
              // }
              // }
            // }
          }
        });
      });
      sendResponse({ success: true });
  }
  /************************************************************************/
});
