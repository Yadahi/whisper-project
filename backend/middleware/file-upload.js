const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const MIME_TYPE_MAP = {
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
};

const fileUpload = multer({
  limits: 500000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/audios");
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];

      const uuidValue = uuidv4();
      const newFilename = `${uuidValue}.${ext}`;
      cb(null, newFilename);
    },
    fileFilter: (req, file, cb) => {
      const isValid = !!MIME_TYPE_MAP[file.mimetype];
      let error = isValid ? null : new Error("Invalid mime type");
      cb(error, isValid);
    },
  }),
});

module.exports = fileUpload;
