const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Input image path

// Output directory for image parts
const outputDirectory = './ImageParts';

// Size of each part in pixels
const partSize = 500; // Change this to your desired part size

// Create the output directory if it doesn't exist
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory);
}

function splitImageIntoChunks(imagePath) {
  console.log('masuk splitimage');
  sharp(imagePath)
    .metadata()
    .then((metadata) => {
      const width = metadata.width;
      const height = metadata.height;

      // Calculate the number of parts in the X and Y directions
      const numPartsX = Math.ceil(width / partSize);
      const numPartsY = Math.ceil(height / partSize);

      // Loop through each part and save it as a separate image
      for (let x = 0; x < numPartsX; x++) {
        for (let y = 0; y < numPartsY; y++) {
          const left = x * partSize;
          const top = y * partSize;
          const right = Math.min(left + partSize, width); // Ensure we don't go beyond image boundaries
          const bottom = Math.min(top + partSize, height); // Ensure we don't go beyond image boundaries

          if (left < right && top < bottom) {
            const outputFile = `${outputDirectory}/part_${x}_${y}.jpg`;

            // Crop and save the part
            sharp(imagePath)
              .extract({ left, top, width: right - left, height: bottom - top })
              .toFile(outputFile, (err, info) => {
                if (err) {
                  console.error(`Error saving part ${x}_${y}: ${err}`);
                } else {
                  console.log(`Part ${x}_${y} saved as ${outputFile}`);
                }
              });
          }
        }
      }
    })
    .catch((err) => {
      console.error('Error reading image metadata:', err);
    });
}

module.exports = { splitImageIntoChunks };
