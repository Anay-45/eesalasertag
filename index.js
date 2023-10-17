const express = require("express");
const app = express();

const arduinoroutes = require("./routes/arduinoapi");
const redisRoutes = require("./routes/redis-api");
const statsapi = require("./routes/statsapi");
const body = require("body-parser");
require("./websocketconfig");

require("./helper/handlewebsocketmsg");

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
app.use("/api2", statsapi);

//Starting Server

app.use(express.static("client/build"));
// let the react app to handle any unknown routes
// serve up the index.html if express does'nt recognize the route
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
