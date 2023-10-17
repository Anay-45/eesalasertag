const websocketConnections = require("../websocketconfig");

// Create a function to handle messages from all WebSocket connections concurrently
async function handleMessage() {
  const messagePromises = websocketConnections.map((ws, index) => {
    return new Promise((resolve, reject) => {
      ws.on("message", (data) => {
        console.log(`Received from Server ${index + 1}: ${data}`);

        // Add your message handling logic here for each WebSocket connection
        // For example, you can parse JSON messages and perform actions based on the content.

        // Resolve the promise to indicate that the message handling is complete.
        ws.send(`Received from Server ${index + 1}: ${data}`);
        resolve();
      });
    });
  });

  await Promise.all(messagePromises);
}

module.exports = handleMessage;
