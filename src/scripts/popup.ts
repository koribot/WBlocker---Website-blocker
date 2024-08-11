(()=>{
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentHref: HTMLInputElement = document.getElementById("current-href") as HTMLInputElement ;
    const currentTab = tabs[0];
    const currentTabUrl = currentTab.url;
    // Now you can set the value of your input element
    if (currentHref) {
      currentHref.value = currentTabUrl as string;
    }
  });
  
})()
