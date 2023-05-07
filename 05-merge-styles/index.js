const { error } = require('console');
const { readdir } = require('fs/promises');
const { join, extname } = require('path');
const fs = require('fs');

const source = join(__dirname, 'styles');
const destination = join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(destination);

readdir(source, { withFileTypes: true }).then(dirents => {
  const files = dirents.filter(dirent => dirent.isFile()).map(file => file.name);
  const styleFiles = files.filter(file => extname(file) === '.css');
  const paths = styleFiles.map(file => join(source, file));
  paths.forEach(path => {
    const readStream = fs.createReadStream(path);
    readStream.pipe(writeStream, { end: false });
  });
}).catch(error);