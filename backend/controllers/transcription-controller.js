const { spawn } = require("child_process");
const cleanStorage = require("../util/helpers");
const path = require("path");
const io = require("../socket");
const Product = require("../models/product");
const { ObjectId } = require("mongodb");

const postFile = async (req, res, next) => {
  try {
    if (!req.file?.path) {
      const error = new Error("File not uploaded.");
      error.code = 400;
      return next(error);
    }

    let transcriptionChunks = [];
    let responseSent = false;

    const product = new Product(
      req.body.title,
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
          try {
            const parsedLine = JSON.parse(line.trim());
            transcriptionChunks.push(parsedLine);
            io.getIO().emit("transcription", { parsedLine });
          } catch (err) {
            console.error("Error parsing line from Python:", err);
          }
        }
      });
    });

    pythonProcess.stderr.on("data", (data) => {
      const stderrOutput = data.toString();

      // Ignore warnings that match specific patterns
      if (stderrOutput.includes("FP16 is not supported")) {
        console.warn("Python warning:", stderrOutput); // Log as a warning
        return;
      }

      if (!responseSent) {
        responseSent = true; // Ensure error response is sent only once
        console.error("Error from Python Process:", data.toString());
        const error = new Error(`Python error: ${data.toString()}`);
        next(error);
      }
    });

    pythonProcess.on("close", (code) => {
      if (responseSent) return;

      if (code === 0) {
        product.transcriptionData = transcriptionChunks;
        product.save();
        res.status(200).json({ product });
      } else {
        const error = new Error("Failed to process the audio file");
        error.code = 500;
        return next(error);
      }
    });
  } catch (error) {
    if (!responseSent) next(error);
  }
};

const getAllTranscriptions = async (req, res, next) => {
  try {
    const products = await Product.fetchAll();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getTranscriptionById = async (req, res, next) => {
  try {
    const productId = req.params.pid;
    if (!ObjectId.isValid(productId)) {
      const error = new Error("Invalid id");
      error.code = 400;
      return next(error);
    }

    const productItem = await Product.findById(productId);

    if (!productItem) {
      const error = new Error("Product not found.");
      error.code = 400;
      return next(error);
    }

    res.status(200).json({
      ...productItem,
      file: {
        type: productItem.type,
        size: productItem.size,
        originalname: productItem.originalname,
        filename: productItem.filename,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteTranscription = async (req, res, next) => {
  try {
    const productId = req.params.pid;
    const uploadDir = path.join(__dirname, "..", "uploads", "audios");

    if (!ObjectId.isValid(productId)) {
      const error = new Error("Invalid product ID format.");
      error.code = 400;
      return next(error);
    }

    const deleteProduct = await Product.findById(productId);

    if (!deleteProduct) {
      const error = new Error("Product not found.");
      error.code = 404;
      return next(error);
    }

    await Product.deleteById(productId);
    cleanStorage(uploadDir, deleteProduct.filename);

    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};

// TODO finish
const updateTranscription = async (req, res, next) => {
  const productId = req.params.pid;
  const updatedTitle = req.body.title;
  console.log("UPDATED TITLE", updatedTitle);
};

module.exports = {
  postFile,
  getAllTranscriptions,
  getTranscriptionById,
  deleteTranscription,
  updateTranscription,
};
