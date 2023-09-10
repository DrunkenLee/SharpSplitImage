const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Directory containing image parts
const inputDirectory = './ImageParts';

// Output file path for the reassembled image
const outputImagePath = './Images/reassembled_image.jpg';

function reassembleImage() {
  // Read all image part files in the input directory
  fs.readdir(inputDirectory, (err, files) => {
    if (err) {
      console.error('Error reading input directory:', err);
      return;
    }

    // Sort the files to ensure they are processed in the correct order
    files.sort();

    // Create an array to hold the paths of all image parts
    const partPaths = files.map((file) => path.join(inputDirectory, file));

    // Create an array to hold promises for reading and processing each image part
    const partPromises = partPaths.map((partPath) => sharp(partPath).toBuffer());

    // Wait for all promises to resolve
    Promise.all(partPromises)
      .then((partBuffers) => {
        // Get the dimensions of the first part
        sharp(partPaths[0])
          .metadata()
          .then((metadata) => {
            const width = metadata.width;
            const height = metadata.height;

            // Create a new image with the same dimensions as the parts
            sharp({
              create: {
                width,
                height,
                channels: 4, // 4 channels for RGBA color
                background: { r: 255, g: 255, b: 255, alpha: 0 }, // Background color (transparent)
              },
            })
              .composite(
                partBuffers.map((partBuffer, index) => ({
                  input: partBuffer,
                  top: 0,
                  left: index * width, // Position each part horizontally
                }))
              )
              .toFile(outputImagePath, (err, info) => {
                if (err) {
                  console.error('Error reassembling image:', err);
                } else {
                  console.log(`Image reassembled and saved as ${outputImagePath}`);
                }
              });
          })
          .catch((err) => {
            console.error('Error getting dimensions of the first part:', err);
          });
      })
      .catch((err) => {
        console.error('Error processing image parts:', err);
      });
  });
}

module.exports = { reassembleImage };
