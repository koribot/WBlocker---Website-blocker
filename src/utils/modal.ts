export function modal(message?: string) {
  let timeoutid: any = -1;
  clearTimeout(timeoutid);
  const isModal = document.getElementById("SOA-MODAL");
  if (isModal === null) {
    const modal = document.createElement("div");
    modal.id = "SOA-MODAL";
    modal.innerHTML = `
      <div class="soa-container">
        <p class="soa-content">${message}</p>
      </div>
    `;
    document.body.appendChild(modal);
    timeoutid = setTimeout(() => {
      window.document.body.removeChild(modal);
    }, 2000);
  }
}