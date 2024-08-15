import { getStorage } from "./getChromeStorage";
import { getById } from "./getElementById";
import { setStorage } from "./setChromeStorage";
import { simpleEncryptor } from "./simpleEncryptor";

export function passWordModal(mode?: string): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const _passFromStorage = await getStorage("70617373776F7264");
    const extensionUrl = chrome.runtime.getURL("/");
    const modal = document.createElement("div");
    modal.id = "WBlocker-Modal";
    modal.classList.add(
      "fixed",
      "inset-0",
      "flex",
      "items-center",
      "justify-center",
      "z-50",
      "bg-gray-500",
      "bg-opacity-75"
    );
    if (
      (!_passFromStorage.success && _passFromStorage.data === "Not Found") ||
      (!_passFromStorage.success &&
        _passFromStorage.data === "Chrome Error" &&
        mode !== "edit")
    ) {
      modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 shadow-lg relative w-[fit-content] h-[fit-content]">
        <button id="WBlocker-Close-Button" class="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700">
          <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <p class="text-lg mb-4 mt-5">There is no current password set</p>
        <form id="WBlocker-Password-Form">
          <label for="WBlocker-Password" class="flex gap-[3px] text-sm font-medium text-gray-700">
           Password 
           <img id="password-view" class="w-4 object-contain" src="${extensionUrl}icons/hide.png"/>
          </label>
          <input required placeholder="Enter Password" type="password" id="WBlocker-Password" name="WBlocker-Password" 
          class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md">
          <button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Create Password
          </button>
        </form>
      </div>
    `;
    } else if (mode !== "edit") {
      modal.innerHTML = `
    <div class="bg-white rounded-lg p-6 shadow-lg relative w-[fit-content] h-[fit-content]">
      <button id="WBlocker-Close-Button" class="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700">
        <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
      <form id="WBlocker-Password-Form">
        <label for="WBlocker-Password" class="flex gap-[3px] text-sm font-medium text-gray-700">
          Password
          <img id="password-view" class="w-4 object-contain" src="${extensionUrl}icons/hide.png"/>
        </label>
        <input required placeholder="Enter Password" type="password" id="WBlocker-Password" name="WBlocker-Password" 
        class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md">
        <button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Enter Password
        </button>
      </form>
     <p class="mt-2 text-red-400" id="status"></p>
    </div>
  `;
    } else {
      modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 shadow-lg relative w-[fit-content] h-[fit-content]">
        <button id="WBlocker-Close-Button" class="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700">
          <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <p class="text-lg mb-4 mt-5">Edit Password</p>
        <form id="WBlocker-Password-Form">
          <div class="flex flex-col w-[250px] gap-5">
            <div>
              <label for="WBlocker-Password-old" class="flex gap-[3px] text-sm font-medium text-gray-700">
                Old Password
                <img id="password-view-old" class="w-4 object-contain" src="${extensionUrl}icons/hide.png"/>
              </label>
              <input required placeholder="Enter Password" type="password" id="old-pass" name="WBlocker-Password-old" 
              class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md">
            </div>
            <div>
              <label for="WBlocker-Password" class="flex gap-[3px] text-sm font-medium text-gray-700">
                New Password
                <img id="password-view-new" class="w-4 object-contain" src="${extensionUrl}icons/hide.png"/>
              </label>
              <input required placeholder="Enter Password" type="password" id="new-pass" name="WBlocker-Password" 
              class="mt-1 p-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md">
              <button type="submit" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Enter Password
              </button>
            </div>
          </div>
        </form>
       <p class="mt-2 text-red-400" id="status"></p>
      </div>
    `;
    }
    document.body.appendChild(modal);

    const closeButton: HTMLButtonElement = document.getElementById(
      "WBlocker-Close-Button"
    ) as HTMLButtonElement;
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        modal.remove();
      });
    }

    // for create and enter password mode
    const hideViewPassword: HTMLImageElement = getById(
      "password-view"
    ) as HTMLImageElement;
    const passWordInput: HTMLInputElement = getById(
      "WBlocker-Password"
    ) as HTMLInputElement;

    //status text
    const statusText: HTMLParagraphElement = getById(
      "status"
    ) as HTMLParagraphElement;

    // for edit password mode
    const hideViewPasswordOld: HTMLImageElement = getById(
      "password-view-old"
    ) as HTMLImageElement;
    const hideViewPasswordNew: HTMLImageElement = getById(
      "password-view-new"
    ) as HTMLImageElement;
    const passWordInputOld: HTMLInputElement = getById(
      "old-pass"
    ) as HTMLInputElement;
    const passWordInputNew: HTMLInputElement = getById(
      "new-pass"
    ) as HTMLInputElement;

    if (mode !== "edit") {
      if (hideViewPassword) {
        hideViewPassword.addEventListener("click", () => {
          if (hideViewPassword.src === `${extensionUrl}icons/hide.png`) {
            hideViewPassword.src = `${extensionUrl}icons/visible.png`;
            passWordInput.type = "string";
          } else {
            hideViewPassword.src = `${extensionUrl}icons/hide.png`;
            passWordInput.type = "password";
          }
        });
      }
    } else if (mode === "edit") {
      if (hideViewPasswordOld && hideViewPasswordNew) {
        hideViewPasswordOld.addEventListener("click", () => {
          if (hideViewPasswordOld.src === `${extensionUrl}icons/hide.png`) {
            hideViewPasswordOld.src = `${extensionUrl}icons/visible.png`;
            passWordInputOld.type = "string";
          } else {
            hideViewPasswordOld.src = `${extensionUrl}icons/hide.png`;
            passWordInputOld.type = "password";
          }
        });
        hideViewPasswordNew.addEventListener("click", () => {
          if (hideViewPasswordNew.src === `${extensionUrl}icons/hide.png`) {
            hideViewPasswordNew.src = `${extensionUrl}icons/visible.png`;
            passWordInputNew.type = "string";
          } else {
            hideViewPasswordNew.src = `${extensionUrl}icons/hide.png`;
            passWordInputNew.type = "password";
          }
        });
      }
    }

    const passwordForm: HTMLFormElement = getById(
      "WBlocker-Password-Form"
    ) as HTMLFormElement;
    if (passwordForm) {
      let timeoutId: number | undefined;
      let timpoutIdEditMode: number | undefined;
      passwordForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (mode !== "edit") {
          const { data: password } = simpleEncryptor(passWordInput.value);
          if (
            !_passFromStorage.success &&
            _passFromStorage.data === "Not Found"
          ) {
            const is = await setStorage({
              name: "70617373776F7264",
              value: password,
            });
            if (is.success) {
              modal.remove();
              resolve(true);
            } else {
              resolve(false);
            }
          } else if (
            _passFromStorage.success &&
            _passFromStorage.data
          ) {
            if (_passFromStorage.data === password) {
              modal.remove();
              resolve(true);
            } else {
              if (statusText) {
                clearTimeout(timeoutId);
                statusText.textContent = "Wrong Password";
                timeoutId = Number(
                  setTimeout(() => {
                    statusText.textContent = "";
                  }, 1000)
                );
              }
            }
          }
        } else if (mode === "edit") {
          const { data: oldPass } = simpleEncryptor(passWordInputOld.value);
          const { data: newPass } = simpleEncryptor(passWordInputNew.value);
          const correctPass = await getStorage("70617373776F7264");
          if (correctPass.success && correctPass.data) {
            if (oldPass !== correctPass.data) {
              statusText.classList.add("text-red-400");
              statusText.classList.remove("text-[green]");
              statusText.textContent = "Incorrect Old Password";
            } else {
              const is = await setStorage({
                name: "70617373776F7264",
                value: newPass,
              });
              statusText.classList.remove("text-red-400");
              statusText.classList.add("text-[green]");
              statusText.textContent = "Password Successfully Changed";
              passWordInputOld.value = "";
              passWordInputNew.value = "";
            }
            clearTimeout(timpoutIdEditMode);
            timpoutIdEditMode = Number(
              setTimeout(() => {
                statusText.textContent = "";
                statusText.classList.remove("text-[green]");
                statusText.classList.add("text-red-400");
              }, 1000)
            );
          }
        }
      });
    } else {
      reject(false);
    }
  });
}
