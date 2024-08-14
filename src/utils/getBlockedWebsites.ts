export function getBlockedWebsites(){
  const rules = chrome.declarativeNetRequest.getDynamicRules()
  return rules
}