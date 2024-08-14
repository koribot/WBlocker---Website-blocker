import { getBlockedWebsites } from './getBlockedWebsites';
export async function updateBadge(){
  const Bwebsites: any = await getBlockedWebsites()
  const len = JSON.stringify(Bwebsites.length) || "0"
  chrome.action.setBadgeText({text: len}, function() {
    console.log(`Badge text set: ${len}`);
  });
  chrome.action.setBadgeBackgroundColor(
    {color: "gray"},
    function(){
      console.log('Badge bg set');
    },
  )
  chrome.action.setBadgeTextColor({color: "white"}, function() {
    console.log('Badge text color set');
  });
}