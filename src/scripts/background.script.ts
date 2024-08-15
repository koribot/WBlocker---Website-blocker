import { getStorage } from "../utils/getChromeStorage";

// class BackgroundScript {
//   blockedHtmlUrl: string;
//   manifest: chrome.runtime.Manifest;
//   contentScripts: any;
//   blockedWebsites: Promise<chrome.declarativeNetRequest.Rule[]> | [] = [];
//   constructor() {
//     this.blockedHtmlUrl = chrome.runtime.getURL("html/blocked.html");
//     this.manifest = chrome.runtime.getManifest();
//     this.contentScripts = this.manifest.content_scripts;
//     this.blockedWebsites = this.getBlockedWebsites() //Returns Promise
//     chrome.runtime.onMessage.addListener(this.handleMessage.bind(this));

//     // this.blockedWebsites.then((e)=>{
//     //   if(e.length ===0){
//     //     this.blockWebsite({url:"https://vercel.com/"})
//     //   }
//     // })
//     // this.blockWebsite({url:"https://vercel.com/"})

//   }

//   //You need to comment a code here when running yarn build
//   async handleMessage(request: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) {
//     //COMMEND THIS WHEM RUNNING YARN BUILD
//     if (request.type === "reload") {
//       console.log("Received message:", request.type);
//       const scriptsPath: string[] = [];
//       const matchUrls: string[] = [];

//       for (const item of this.contentScripts) {
//         for (const js of item.js) {
//           scriptsPath.push(js);
//         }
//       }

//       for (const item of this.contentScripts) {
//         for (const url of item.matches) {
//           if (!item.js.includes("dist/utils/socket.script.js")) {
//             matchUrls.push(url);
//             break;
//           }
//         }
//       }

//       chrome.tabs.query({ url: matchUrls, currentWindow: true }, function (tabs) {
//         tabs.forEach((tab, index) => {
//           if (tab.id && tab.url) {
//             chrome.tabs.reload(tab.id);
//             chrome.runtime.reload();
//           }
//         });
//       });

//       sendResponse({ success: true });
//     }
//     //////////////////////////////////////
//     if(request.message === "block-website"){
//       console.log("block")
//       this.blockWebsite({url: request.data}).then((e)=>{
//         if(e){
//           sendResponse(true)
//         }
//       })
//     }
//     if(request.message === "unblock-website"){
//       console.log("recieved unblock")
//       this.unblockWebsite({index: request.data}).then((e)=>{
//         if(e){
//           sendResponse(true)
//         }
//       })
//     }
//     if(request.message === "get-blocked-websites"){
//       console.log("getting-blocked-websites")
//       this.getBlockedWebsites().then((e)=>{
//         console.log(e)
//           sendResponse(e)
//       })
//     }
//   }

//   async blockWebsite({url}:{url:string}){
//     this.getBlockedWebsites().then(async (e)=>{
//       if(e.length>0){
//         const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
//         const oldRuleIds = oldRules.map(rule => rule.id);
//         const max = Math.max(...oldRuleIds)
//         console.log(max)
//         console.log(e.length)
//         chrome.declarativeNetRequest.updateDynamicRules({
//           addRules: [
//             {
//               id: max+1,
//               priority: 1,
//               action: { type: chrome.declarativeNetRequest.RuleActionType.REDIRECT, redirect: { url: this.blockedHtmlUrl } },
//               condition: { urlFilter: url, resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME] }
//             }
//           ],
//         });
//       }else{
//         chrome.declarativeNetRequest.updateDynamicRules({
//           addRules: [
//             {
//               id: 1,
//               priority: 1,
//               action: { type: chrome.declarativeNetRequest.RuleActionType.REDIRECT, redirect: { url: this.blockedHtmlUrl } },
//               condition: { urlFilter: url, resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME] }
//             }
//           ],
//         });
//       }
//     })
  
//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError.message);
//       return false;
//     } else {
//       console.log("Blocked");
//       return true;
//     }
//   }


//   async unblockWebsite({index}:{index:number}){

//     const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
//     const oldRuleIds = oldRules.map(rule => rule.id);
//     const max = Math.max(...oldRuleIds)
    
//     if(oldRuleIds.length > 0){
//       console.log(oldRuleIds.length)
//     }
//     chrome.declarativeNetRequest.updateDynamicRules({
//       removeRuleIds: [index],
//     });

//     if (chrome.runtime.lastError) {
//       console.error(chrome.runtime.lastError.message);
//       return false;
//     } else {
//       console.log("Unblocked");
//       return true;
//     }
//   }

//   getBlockedWebsites(){
//     const rules = chrome.declarativeNetRequest.getDynamicRules()
//     return rules
//   }

// }

// new BackgroundScript();



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
    chrome.tabs.query({ url: matchUrls, currentWindow: true }, function (tabs) {
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
          chrome.runtime.reload();
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