const { spawn } = require("child_process");
const cleanStorage = require("../util/helpers");
const path = require("path");
const io = require("../socket");
const Product = require("../models/product");

const postFile = async (req, res, next) => {
  if (!req.file.path) return;

  const uploadDir = path.join(__dirname, "..", "uploads", "audios");
  // TODO clean files
  // cleanStorage(uploadDir, req.file.filename);

  // let transcriptionChunks = [];
  // const fileMetadata = {
  //   name: req.body.title,
  //   type: req.file.minetype,
  //   size: req.file.size,
  //   filename: req.file.filename,
  //   path: req.file.path,
  //   uploadedAt: new Date(),
  // };

  const product = new Product(
    req.body.title,
    req.file.mimetype,
    req.file.size,
    req.file.originalname
  );
  const pythonProcess = spawn("python3", ["../app.py", req.file.path]);

  pythonProcess.stdout.on("data", (data) => {
    const lines = data.toString();
    // console.log("LINES", lines);

    lines.split("\n").forEach((line) => {
      // console.log("LINE", line);
      if (line.trim()) {
        // transcriptionChunks.push(line.trim());
        io.getIO().emit("transcription", { line });
      }
    });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      // console.log("Transcription complete", transcriptionChunks);
      // const transcriptionData = {
      //   ...fileMetadata,
      //   transcription: finalTranscription,
      // };
      product.save();
      res.status(200).json({ product });
    } else {
      res.status(500).json({ error: "Failed to process the audio file" });
    }
  });
};

const getTranscription = async (req, res, next) => {
  res.status(200).json({ action: "completed" });
};

const getHistory = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.status(200).json(products);
};

module.exports = {
  getTranscription,
  postFile,
  getHistory,
};
