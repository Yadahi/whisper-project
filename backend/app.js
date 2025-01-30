const express = require("express");
const path = require("path");
const { createServer } = require("node:http");
const socket = require("./socket");
const bodyParser = require("body-parser");
const { runServer } = require("./util/database");
const User = require("./models/user");

const transcriptionRoutes = require("./routes/transcription-routes");

const app = express();
const server = createServer(app);
const io = socket.init(server);

// CORS Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use(bodyParser.json());

// Serve static files
app.use("/uploads/audios", express.static(path.join("uploads", "audios")));

// Middleware to fetch user
app.use((req, res, next) => {
  User.findById("6779a0909acce51ff109fa5c")
    .then((user) => {
      req.user = new User(user.name, user.email, user._id);
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

// Routes
app.use("/", transcriptionRoutes);

app.use((req, res, next) => {
  const error = new Error("Could not find this route.");
  error.code = 404;
  return next(error);
});

// Error-handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  console.log("test", error.message);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

// Start server
runServer(server).catch(console.dir);
