const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
const server = http.createServer(app);
const wss1 = new WebSocket.Server({ server, path: "/ws1" });
const data = require("./model/data");

const arduinoroutes = require("./routes/arduinoapi");
const redisRoutes = require("./routes/redis-api");
const body = require("body-parser");

const connectDb = require("./config");
//body-parser
app.use(body.json());
app.use(
  body.urlencoded({
    extended: true,
  })
);

//configuring env
require("dotenv").config();

//connecting to database
connectDb();

//defining apis
app.use("/api", arduinoroutes);
app.use("/api1", redisRoutes);

wss1.on("connection", (ws) => {
  console.log("Client connected to WebSocket");

  ws.on("message", async (message) => {
    let string = message.toString("utf-8");

    const match = string.match(/^\w+(?::\w+)*$/);

    if (match) {
      try {
        string = string.split(":");
        const PlayerData = await data.findOne({ arduinoId: string[0] });
        if (!PlayerData) {
          ws.send("Player not found");
          return;
        }
        if (string[1] == "inc") {
          PlayerData.count++;
          PlayerData.killedby.push(+string[2]);
          if (PlayerData.count % 3 == 0) {
            PlayerData.hits++;
          }
          await PlayerData.save();
          ws.send("Data incremented");
        } else if (string[1] == "status") {
          ws.send(PlayerData.status ? "true" : "false");
        } else {
          ws.send("Invalid");
        }
      } catch (ex) {
        ws.send("error");
      }
    } else {
      ws.send("Invalid");
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected from WebSocket");
  });
});

//Starting Server

app.use(express.static("client/build"));
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
