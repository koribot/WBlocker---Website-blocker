import { getBlockedWebsites } from "./getBlockedWebsites";


export async function blockWebsite({ url, type=""}: { url: string , type?: string }) {
  const blockedHtmlUrl = chrome.runtime.getURL("html/blocked.html");
  const e = await getBlockedWebsites();
  const redirectLink = `${blockedHtmlUrl}?t=${url}`;
  if (e.length > 0) {
    const oldRules = await chrome.declarativeNetRequest.getDynamicRules();
    const oldRuleIds = oldRules.map((rule) => rule.id);
    const max = Math.max(...oldRuleIds);
    if (type === "" || type === "urlFilter") {
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: max + 1,
            priority: 1,
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
              redirect: { url: redirectLink },
            },
            condition: {
              urlFilter: url,
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              ],
            },
          },
        ],
      });
    }else if(type==="regexFilter"){
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: max + 1,
            priority: 1,
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
              redirect: { url: redirectLink },
            },
            condition: {
              regexFilter: url,
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              ],
            },
          },
        ],
      });
    }
  } else {
    if (type === "" || type === "urlFilter") {
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: 1,
            priority: 1,
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
              redirect: { url: redirectLink },
            },
            condition: {
              urlFilter: url,
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              ],
            },
          },
        ],
      });
    }else if(type==="regexFilter"){
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
          {
            id: 1,
            priority: 1,
            action: {
              type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
              redirect: { url: redirectLink },
            },
            condition: {
              regexFilter: url,
              resourceTypes: [
                chrome.declarativeNetRequest.ResourceType.MAIN_FRAME,
              ],
            },
          },
        ],
      });
    }
  }
  const newList = await getBlockedWebsites();
  return newList;
}
