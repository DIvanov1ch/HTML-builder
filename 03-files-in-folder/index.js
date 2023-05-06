const fs = require('fs');
const path = require('path');
const { stdout } = process;
const { readdir } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

readdir(pathToFolder, { withFileTypes: true }).then(dirents => {
  const files = dirents.filter(dirent => dirent.isFile()).map(file => file.name);
  const paths = files.map(file => path.join(__dirname, 'secret-folder', `${file}`));

  paths.map(_path => fs.stat(_path, (error, file) => {
    if (error) {
      stdout.write(`Error: ${error.message}`);
    }
    stdout.write(`${path.parse(_path).name} - ${path.extname(_path).slice(1)} - ${file.size} bytes\n`);
  }));
});

