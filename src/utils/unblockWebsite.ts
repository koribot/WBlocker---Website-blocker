export async function unblockWebsite({id}:{id:number}){
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [id],
  });
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError.message);
    return false;
  } else {
    console.log("Unblocked");
    return true;
  }
}