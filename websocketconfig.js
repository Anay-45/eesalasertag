const WebSocket = require("ws");
// Define an array of WebSocket server URLs
const serverUrls = [
  "wss://socketsbay.com/wss/v2/1/demo/",
  // Add more server URLs as needed
];

// Create a function to connect to WebSocket servers concurrently
async function connectToWebSocketServers() {
  const websocketConnections = [];

  const connectPromises = serverUrls.map(async (url, index) => {
    const ws = new WebSocket(url);

    await new Promise((resolve, reject) => {
      ws.on("open", () => {
        console.log(`Connected to WebSocket server ${index + 1}: ${url}`);
        resolve();
      });

      ws.on("close", () => {
        console.log(`Disconnected from WebSocket server ${index + 1}: ${url}`);
        resolve();
      });

      ws.on("error", (error) => {
        console.error(`WebSocket error for server ${index + 1}: ${error}`);
        resolve();
      });
    });

    websocketConnections.push(ws);
  });

  await Promise.all(connectPromises);

  return websocketConnections;
}

async function handleMessage(websocketConnections) {
  const messagePromises = websocketConnections.map((ws, index) => {
    return new Promise((resolve, reject) => {
      ws.on("message", (data) => {
        console.log(`Received from Server ${index + 1}: ${data}`);

        // Add your message handling logic here for each WebSocket connection
        // For example, you can parse JSON messages and perform actions based on the content.

        // Resolve the promise to indicate that the message handling is complete.
        resolve();
      });
    });
  });

  await Promise.all(messagePromises);
}
async function sendPeriodicMessage(message, interval, websocketConnections) {
  setInterval(() => {
    // Loop through all WebSocket connections and send the message periodically
    for (const ws of websocketConnections) {
      ws.send(message);
    }
  }, interval);
}

(async () => {
  const websocketConnections = await connectToWebSocketServers();

  // Now you have an array of WebSocket connections, and you can use them for further communication.
  sendPeriodicMessage("Hello, world!", 5000, websocketConnections);
  // Start handling messages from all WebSocket connections concurrently.
  await handleMessage(websocketConnections);
})();

module.exports = connectToWebSocketServers;
