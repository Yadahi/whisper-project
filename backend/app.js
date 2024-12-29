const express = require("express");
const { createServer } = require("node:http");
const socket = require("./socket");
const bodyParser = require("body-parser");
const mongoConnect = require("./util/database");
const { runServer } = require("./util/database");

const transcriptionRoutes = require("./routes/transcription-routes");

const app = express();
const server = createServer(app);
const port = 3000;
const io = socket.init(server);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/", transcriptionRoutes);

io.on("connection", (socket) => {
  console.log("a user connected");
});

// server.listen(port, () => {
//   console.log(`example app listening on port ${port}`);
// });
// mongoConnect((client) => {
//   console.log(client);

//   server.listen(port, () => {
//     console.log(`example app listening on port ${port}`);
//   });
// });
runServer(server).catch(console.dir);
