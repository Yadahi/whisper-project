const express = require("express");
const { createServer } = require("node:http");
const socket = require("./socket");
const bodyParser = require("body-parser");
const { runServer } = require("./util/database");
const User = require("./models/user");

const transcriptionRoutes = require("./routes/transcription-routes");

const app = express();
const server = createServer(app);
const io = socket.init(server);
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use((req, res, next) => {
  User.findById("6779a0909acce51ff109fa5c")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/", transcriptionRoutes);

runServer(server).catch(console.dir);
