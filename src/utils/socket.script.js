/**
 *  THIS WILL BE NOT INCLUDED IN .production-build
 */
let socket = new WebSocket("ws://localhost:3000");
export function connect_to_socket() {
  if (socket) {
    socket.addEventListener("open", (e) => {
      console.log("Connected to WebSocket server");
      socket.send(location.href);
    });
    socket.addEventListener("message", (event) => {
      if (event.data === "reload") {
        chrome.runtime.sendMessage({ type: "reload" }, function (response) {
          console.log("Response:", response);
        });
      }
    });
    socket.addEventListener("close", () => {
      console.log("Disconnected from WebSocket server");
      // connect_to_socket();
    });
    socket.addEventListener("error", (error) => {
      console.error("WebSocket error, check the server if its on:", error);
      // connect_to_socket();
    });
  } else {
  }
}
connect_to_socket();
/**EOF*/
