export async function reloadTabsAndRedirect({targetUrl, redicrectUrl}:{targetUrl: string, redicrectUrl: string}) {
  if(redicrectUrl==="empty"){
    chrome.tabs.query({ active:true, currentWindow:true }, function(tabs: chrome.tabs.Tab[]) {
      if(tabs){
        const currentTab = tabs[0];
        const id = currentTab.id;
        if(currentTab && id){
          chrome.tabs.update(id, { url: "chrome://newtab/" });
        }
      }
    });
  }else{
    chrome.tabs.query({ url: targetUrl }, function(tabs: chrome.tabs.Tab[]) {
      tabs.forEach((tab: chrome.tabs.Tab) => {
        if(tab&&tab.id){
          chrome.tabs.update(tab.id, { url: redicrectUrl });
        }
      });
    });
  }
}
