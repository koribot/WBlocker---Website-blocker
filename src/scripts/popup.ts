import { getById } from "./../utils/getElementById";
import { setStorage } from "./../utils/setChromeStorage";
import { getStorage } from "./../utils/getChromeStorage";
import { sendMessage } from "./../utils/sendMessage";
import { getBlockedWebsites } from "../utils/getBlockedWebsites";
import { blockWebsite } from "../utils/blockWebsite";
import { unblockWebsite } from "../utils/unblockWebsite";
import { updateBadge } from "../utils/updateBadge";
import { passWordModal } from "./../utils/passWordModal";

//Todo: Add html sanitization
class BlockWebsiteComponent {
  //these are all pre-created HTML elements on popup.html
  private currentHref: HTMLInputElement;
  private currentHrefRegex: HTMLInputElement;
  private tbody: HTMLTableSectionElement;
  private blockWebsiteBtn: HTMLButtonElement;
  private blockWebsiteRegexBtn: HTMLButtonElement;
  private editPasswordBtn: HTMLButtonElement;

  //for popup modal not global
  private modal: HTMLDivElement; //dynamically created
  //for clearing timeout on modal
  private timeoutId: number | undefined;

  constructor() {
    this.currentHref = getById("current-href") as HTMLInputElement;
    this.currentHrefRegex = getById("current-href-regex") as HTMLInputElement;
    this.tbody = getById("blocked-website-body") as HTMLTableSectionElement;
    this.blockWebsiteBtn = getById("block-website") as HTMLButtonElement;
    this.blockWebsiteRegexBtn = getById(
      "block-website-regex"
    ) as HTMLButtonElement;
    this.editPasswordBtn = getById(
      "edit-password"
    ) as HTMLButtonElement;
    
    this.modal = document.createElement("div");
    this.initialize();
  }

  /**
   * Triggered when popup is opened
   */
  private initialize() {
    this.initializeBlockWebsiteButton();
    this.initializeEditPasswordButton();

    //Exclude getting the href of [chrome://newtab/, chrome://extensions/, chrome-extension://] 
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      const currentTabUrl = currentTab.url;
      if (this.currentHref && this.tbody) {
        if (
          !currentTabUrl?.startsWith("chrome://newtab/") &&
          !currentTabUrl?.startsWith("chrome://extensions/") &&
          !currentTabUrl?.startsWith("chrome-extension://")
        ) {
          this.currentHref.value = currentTabUrl as string;
        }
        const Bwebsites: any = await getBlockedWebsites();
        this.updateTbodyInnerHtml({
          element: this.tbody,
          source: Bwebsites,
        });
        this.initializeUnblockButtons();
        updateBadge();
      }
    });


  }

  private async initializeUnblockButtons() {
    const websites: any = await getBlockedWebsites();
    if (websites.length > 0) {
      const unblockBtns =
        document.querySelectorAll<HTMLButtonElement>(".unblockBtn");
      if (unblockBtns) {
        unblockBtns.forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            const isPasswordCorrect = await passWordModal();
            if (isPasswordCorrect) {
              const index = (e.target as HTMLButtonElement).getAttribute("key");
              if (index) {
                const target = websites[Number(index)];
                const newList = websites.filter(
                  (item: any) => item.id !== Number(index)
                );
                unblockWebsite({ id: Number(index) });
                this.updateTbodyInnerHtml({
                  element: this.tbody,
                  source: newList,
                });
                this.initializeUnblockButtons();
                this.showModal({ message: "Successfully Unblocked" });
              }
            }
          });
        });
      }
    }
    updateBadge();
  }
  private initializeBlockWebsiteButton() {
    this.blockWebsiteBtn.addEventListener("click", async () => {
      const urlToBlock = this.currentHref.value;
      if (urlToBlock.length > 0) {
        const Bwebsites: any = await getBlockedWebsites();
        if (Bwebsites.length > 0) {
          const urls = Bwebsites.map((item: any) => item.condition.urlFilter);
          if (!urls.includes(urlToBlock)) {
            const isPasswordCorrect = await passWordModal();
            if (isPasswordCorrect) {
              const newList = await blockWebsite({ url: urlToBlock });
              if (newList.length > 0) {
                this.updateTbodyInnerHtml({
                  element: this.tbody,
                  source: newList,
                });
                this.initializeUnblockButtons();
                this.showModal({ message: "Successfully Blocked" });
              }
            }
          } else {
            this.showModal({ message: "Already Blocked", color: "red" });
          }
        } else {
          const isPasswordCorrect = await passWordModal();
          if (isPasswordCorrect) {
            const newList = await blockWebsite({ url: urlToBlock });
            if (newList.length > 0) {
              this.updateTbodyInnerHtml({
                element: this.tbody,
                source: newList,
              });
              this.initializeUnblockButtons();
              this.showModal({ message: "Successfully Blocked" });
            }
          }
        }
      } else {
        this.showModal({
          message: "Please Provide Url to block or pattern",
          color: "red",
          delay: 3000,
        });
      }
    });
    this.blockWebsiteRegexBtn.addEventListener("click", async () => {
      const urlToBlock = this.currentHrefRegex.value;
      if (urlToBlock.length > 0) {
        const Bwebsites: any = await getBlockedWebsites();
        if (Bwebsites.length > 0) {
          const urls = Bwebsites.map((item: any) => item.condition.regexFilter);
          if (!urls.includes(urlToBlock)) {
            const isPasswordCorrect = await passWordModal();
            if (isPasswordCorrect) {
              const newList = await blockWebsite({
                url: urlToBlock,
                type: "regexFilter",
              });
              if (newList.length > 0) {
                this.updateTbodyInnerHtml({
                  element: this.tbody,
                  source: newList,
                });
                this.initializeUnblockButtons();
                this.showModal({ message: "Successfully Blocked" });
              }
            }
          } else {
            this.showModal({ message: "Already Blocked", color: "red" });
          }
        } else {
          const isPasswordCorrect = await passWordModal();
          if (isPasswordCorrect) {
            const newList = await blockWebsite({
              url: urlToBlock,
              type: "regexFilter",
            });
            if (newList.length > 0) {
              this.updateTbodyInnerHtml({
                element: this.tbody,
                source: newList,
              });
              this.initializeUnblockButtons();
              this.showModal({ message: "Successfully Blocked" });
            }
          }
        }
      } else {
        this.showModal({
          message: "Please Provide Url to block or pattern",
          color: "red",
          delay: 3000,
        });
      }
    });
    updateBadge();
  }

  private async initializeEditPasswordButton(){
    this.editPasswordBtn.addEventListener("click", async()=>{ 
      const is = await passWordModal("edit");
    })
  }

  private async updateTbodyInnerHtml({
    element,
    source,
  }: {
    element: HTMLElement;
    source: any[];
  }) {
    element.innerHTML =
      source.length > 0
        ? source
            .map(
              (item: any, index: number) => `
                <tr>
                  <td class="border px-4 py-2 flex justify-between gap-1">
                    <input class="w-full border p-2" value="${
                      item.condition.urlFilter || item.condition.regexFilter
                    }" readonly />
                    <button key="${
                      item.id
                    }" class="unblockBtn bg-[#147014] p-2 text-white">Unblock</button>
                  </td>
                </tr>
              `
            )
            .join("")
        : `
           <tr>
             <td class="border px-4 py-2">
              <p class="flex justify-center">No Blocked Websites</p>
             </td>
           </tr>
          `;
  }
  
  //Todo: figure out how postcss can do dynamic color
  private showModal({
    message,
    color,
    delay,
  }: {
    message: string;
    color?: string | undefined;
    delay?: number | undefined;
  }) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.modal.innerHTML = `
      <div class="absolute top-0 left-0 right-0 z-50 pb-4 text-center">
        <p class=${
          color === "red" ? `bg-[#ffcc00]` : "bg-green-300"
        }>${message}</p>
      </div>
    `;
    document.body.appendChild(this.modal);
    this.timeoutId = Number(
      setTimeout(
        () => {
          document.body.removeChild(this.modal);
        },
        delay ? delay : 2000
      )
    );
  }
}

new BlockWebsiteComponent();
