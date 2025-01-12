const express = require("express");
const router = express.Router();
const transcriptionController = require("../controllers/transcription-controller");
const fileUpload = require("../middleware/file-upload");

router.post("/", fileUpload.single("audio"), transcriptionController.postFile);

router.get("/", transcriptionController.getTranscription);

router.get("/all", transcriptionController.getAllTranscriptions);

router.get("/:pid", transcriptionController.getTranscriptionById);

router.delete("/:pid", transcriptionController.deleteTranscription);

// router.patch("/:pid", transcriptionController.updateTranscription);

module.exports = router;
