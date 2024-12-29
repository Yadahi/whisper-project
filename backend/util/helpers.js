const fs = require("fs");
const path = require("path");

const cleanStorage = (directory, currentFile) => {
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }
    files.forEach((file) => {
      if (file === currentFile) {
        return;
      }

      const filePath = path.join(directory, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", filePath, err);
        } else {
          console.log("Deleted file:", filePath);
        }
      });
    });
  });
};

module.exports = cleanStorage;
