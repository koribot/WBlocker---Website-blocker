import { getBlockedWebsites } from "../utils/getBlockedWebsites";
import { getById } from "../utils/getElementById";
import { reloadTabsAndRedirect } from "../utils/reloadTabsAndRedirect";

(async () => {
  const res = await getBlockedWebsites();
  const extensionId  = chrome.runtime.id
  const displayName = getById("website-name");
  const url = new URL(window.location.href);
  const searchParams = url.searchParams;
  const val = searchParams.get("t") as string;
  if(!val) reloadTabsAndRedirect({targetUrl:window.location.href, redicrectUrl:"empty"})
  if(displayName) displayName.innerHTML = `
  <a class="underline" href="${val}">
    ${val? val: ""}
  </a>
  <p class="text-[#a02020]">Access Not Allowed</p>
  `
  const WblockerLink = getById("WBlocker-link") as HTMLAnchorElement;
  if(WblockerLink) WblockerLink.href = `https://chromewebstore.google.com/detail/${extensionId}`
  const _urlsList: any[] =
    res.map((item: any) => item.condition.urlFilter) || [];
  if (!_urlsList.includes(val)) {
    reloadTabsAndRedirect({targetUrl:window.location.href, redicrectUrl:val})
  }
})();
