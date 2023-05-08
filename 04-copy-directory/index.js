const { error } = require('console');
const { mkdir, copyFile, readdir, rm } = require('fs/promises');
const { join } = require('path');

const sourcePath = join(__dirname, 'files');
const destinationPath = join(__dirname, 'files-copy');

async function copyDir(src, dest) {
  await rm(dest, { force: true, recursive: true });
  await mkdir(dest, { recursive: true });

  await readdir(src).then(files => {
    files.forEach(file => {
      const source = join(src, file);
      const destination = join(dest, file);
      copyFile(source, destination).catch(error);
    });
  });
}

copyDir(sourcePath, destinationPath).catch(error);