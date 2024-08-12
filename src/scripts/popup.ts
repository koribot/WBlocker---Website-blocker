import { getById } from "./../utils/getElementById";
import { setStorage } from './../utils/setChromeStorage';
import { getStorage } from './../utils/getChromeStorage';
import { sendMessage } from './../utils/sendMessage';
class BlockWebsiteComponent {
  private currentHref: HTMLInputElement;
  private tbody: HTMLTableSectionElement;
  private blockWebsiteBtn: HTMLButtonElement;
  private modal: HTMLDivElement;
  private timeoutId: number | undefined;
  constructor() {
    this.currentHref = getById("current-href") as HTMLInputElement;
    this.tbody = getById("blocked-website-body") as HTMLTableSectionElement;
    this.blockWebsiteBtn = getById("block-website") as HTMLButtonElement;
    this.modal = document.createElement("div");
    this.initialize();
  }

  private initialize() {
    this.initializeBlockWebsiteButton();
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const currentTab = tabs[0];
      const currentTabUrl = currentTab.url;

      if (this.currentHref && this.tbody) {
        this.currentHref.value = currentTabUrl as string;
        const result = await getStorage("blockWebsites") || [];
        if(result.success){
          const Bwebsites = result.data || [];
          this.updateTbodyInnerHtml({element: this.tbody, source: Bwebsites})
          this.initializeUnblockButtons();
        }
      }
    });
  }


  private async initializeUnblockButtons() {
    const websites = await getStorage("blockWebsites");
    if(websites.success){
      const unblockBtns =
        document.querySelectorAll<HTMLButtonElement>(".unblockBtn");
      if(unblockBtns){
        unblockBtns.forEach((btn) => {
          btn.addEventListener("click", async (e) => {
            const index = (e.target as HTMLButtonElement).getAttribute("key")
            if(index){
              const target = websites.data[index]
              const newList = websites.data.filter((item:string)=>item!==target)
              setStorage({name: "blockWebsites", value: newList})
              this.updateTbodyInnerHtml({element:this.tbody, source: newList})
              this.initializeUnblockButtons()
            }
          });          
        });
      }
    }
  }
  private initializeBlockWebsiteButton() {
    this.blockWebsiteBtn.addEventListener("click", async () => {
      const urlToBlock = this.currentHref.value;
      if (urlToBlock.length > 0) {
          const Bwebsites: {data:any, success:boolean} = await getStorage("blockWebsites")||[];
          if(!Bwebsites.data.includes(urlToBlock)){
            setStorage({ name: "blockWebsites", value:[...Bwebsites.data, urlToBlock]}).then((e)=>{
              if(e.success){
                console.log("successfully blocked website", urlToBlock)
                this.updateTbodyInnerHtml({element: this.tbody, source: [...Bwebsites.data, urlToBlock]})
                this.initializeUnblockButtons()
                this.showModal("Successfully Blocked")
              }
            })
            
          }
      }
    });
  }
  private updateTbodyInnerHtml({element ,source}: {element: HTMLElement, source: string[]}) {
    element.innerHTML =
      source.length > 0
        ? source
            .map(
              (item: string, index:number) => `
                <tr>
                  <td class="border px-4 py-2 flex justify-between">
                    <input class="w-full" value="${item}" readonly />
                    <button key="${index}" class="unblockBtn bg-[#147014] p-2 text-white">Unblock</button>
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

  private showModal(message: string) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.modal.innerHTML = `
      <div class="absolute top-0 left-0 right-0 z-50 pb-4 text-center">
        <p class="bg-green-300">${message}</p>
      </div>
    `;
    document.body.appendChild(this.modal);
    this.timeoutId = Number(setTimeout(() => {
      document.body.removeChild(this.modal);
    }, 2000));
  }
  
  

}

new BlockWebsiteComponent();
