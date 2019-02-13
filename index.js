const fs = require('fs');
const csv = require("csv-parser");

const inputPath = 'input';
const inputImagesPath = 'input/images';
const outputPath = 'output';

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

fs.readdirSync(inputPath, {withFileTypes: true})
  .filter(dirent => !dirent.isDirectory() && dirent.name.lastIndexOf('.csv') === dirent.name.length - 4)
  .map(dirent => dirent.name)
  .forEach(fileName => {
    console.log('Read file: ' + fileName);
    let outputDirName = fileName.replace('.csv', '');

    fs.createReadStream(inputPath + '/' + fileName)
      .pipe(csv())
      .on('data', (data) => {
        let searchName = data['Name'];
        // console.log(searchName);

        fs.readdirSync(inputImagesPath, {withFileTypes: true})
          .filter(dirent => !dirent.isDirectory() && dirent.name.indexOf(searchName) !== -1)
          .map(dirent => dirent.name)
          .forEach(fileName => {
            let outputDir = outputPath + '/' + outputDirName;

            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir)
            }

            if (!fs.existsSync(outputDir + '/' + fileName)) {
              console.log('Copy: ' + fileName);

              fs.copyFile(inputImagesPath + '/' + fileName, outputDir + '/' + fileName, (err) => {
                if (err) {
                  console.log('Copy error: ' + fileName);
                }
              });
            }
          });
      });
  });
