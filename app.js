const express = require('express');
const multer = require('multer');
const { splitImageIntoChunks } = require('./helpers/Split-image');

const app = express();
const port = 3000;

// Configure multer to store uploaded files in a specific folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'ImageTemp');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Handle POST request with file upload
app.post('/upload', upload.single('image'), (req, res) => {
  const imagePath = './ImageTemp/bridge-01@2x.png';
  splitImageIntoChunks(imagePath);
  res.send('File uploaded successfully');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
