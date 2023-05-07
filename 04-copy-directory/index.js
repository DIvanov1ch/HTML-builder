const { error } = require('console');
const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const { join } = require('path');

const sourcePath = join(__dirname, 'files');
const destinationPath = join(__dirname, 'files-copy');

function copyDir(src, dest) {
  mkdir(dest, { recursive: true }).catch(error);
  
  readdir(src).catch(error).then(files => {
    files.forEach(file => {
      const source = join(src, file);
      const destination = join(dest, file);
      copyFile(source, destination).catch(error);
    });
  });

  readdir(dest).catch(error).then(files => {
    files.forEach(file => {
      readdir(src).catch(error).then(files => {
        if (!files.includes(file)) {
          const unexistFile = join(dest, file);
          rm(unexistFile, { recursive: true }).catch(error);
        }
      });
    });
  });
}

copyDir(sourcePath, destinationPath);