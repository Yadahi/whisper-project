const { spawn } = require("child_process");
const cleanStorage = require("../util/helpers");
const path = require("path");
const io = require("../socket");
const Product = require("../models/product");

const postFile = async (req, res, next) => {
  console.log("REQUEST", req.body);
  console.log("FILE", req.file);

  if (!req.file.path) {
    return res.status(400).json({ error: "File not uploaded." });
  }

  let transcriptionChunks = [];

  const product = new Product(
    req.body.title,
    req.file,
    req.file.mimetype,
    req.file.size,
    req.file.originalname,
    req.file.filename,
    req.file.path,
    req.user._id
  );

  const pythonProcess = spawn("python3", ["../app.py", req.file.path]);

  pythonProcess.stdout.on("data", (data) => {
    const lines = data.toString();

    lines.split("\n").forEach((line) => {
      if (line.trim()) {
        const parsedLine = JSON.parse(line.trim());
        transcriptionChunks.push(parsedLine);

        io.getIO().emit("transcription", { parsedLine });
      }
    });
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error("Error:", data.toString());
  });

  pythonProcess.on("close", (code) => {
    if (code === 0) {
      product.transcriptionData = transcriptionChunks;
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

const getAllTranscriptions = async (req, res, next) => {
  const products = await Product.fetchAll();
  res.status(200).json(products);
};

const getTranscriptionById = async (req, res, next) => {
  const productId = req.params.pid;
  const productItem = await Product.findById(productId);
  res.status(200).json(productItem);
};

const deleteTranscription = async (req, res, next) => {
  const productId = req.params.pid;
  const uploadDir = path.join(__dirname, "..", "uploads", "audios");

  let deleteProduct;

  try {
    deleteProduct = await Product.findById(productId);

    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found." });
    }

    await Product.deleteById(productId);
    cleanStorage(uploadDir, deleteProduct.filename);
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Deleting product failed." });
  }
};

const updateTranscription = async (req, res, next) => {
  const productId = req.params.pid;
  const updatedTitle = req.body.title;
  console.log("UPDATED TITLE", updatedTitle);
};

module.exports = {
  getTranscription,
  postFile,
  getAllTranscriptions,
  getTranscriptionById,
  deleteTranscription,
  updateTranscription,
};
