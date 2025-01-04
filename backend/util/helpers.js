const fs = require("fs");
const path = require("path");

const cleanStorage = (directory, currentFile) => {
  const filePath = path.join(directory, currentFile);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", filePath, err);
    }
  });
};

module.exports = cleanStorage;
