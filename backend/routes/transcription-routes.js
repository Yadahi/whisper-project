const express = require("express");
const router = express.Router();
const transcriptionController = require("../controllers/transcription-controller");
const fileUpload = require("../middleware/file-upload");

router.post("/", fileUpload.single("audio"), transcriptionController.postFile);

router.get("/", transcriptionController.getTranscription);

router.get("/history", transcriptionController.getHistory);

module.exports = router;
