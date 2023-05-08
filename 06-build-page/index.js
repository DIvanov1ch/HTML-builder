const { error } = require('console');
const { mkdir, copyFile, readdir, rm, readFile, writeFile } = require('fs/promises');
const { join, extname } = require('path');
const fs = require('fs');

async function buildPage() {
  const assetsDest = join(__dirname, 'project-dist', 'assets');
  const assetsSrc = join(__dirname, 'assets');
  const projectPath = join(__dirname, 'project-dist');

  await rm(projectPath, { force: true, recursive: true });
  await mkdir(projectPath, { recursive: true });
  await Promise.all([
    copyDir(assetsSrc, assetsDest),
    mergeStyles(),
    createHTML(),
  ]);
}
buildPage().catch(error);

async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });

  await readdir(src, { withFileTypes: true }).then(files => {
    files.forEach(file => {
      const source = join(src, file.name);
      const destination = join(dest, file.name);
      if (file.isFile()) {
        copyFile(source, destination).catch(error);
      } else {
        copyDir(source, destination);
      }
    });
  }).catch(error);
}

async function mergeStyles() {
  const styleSrc = join(__dirname, 'styles');
  const styleDest = join(__dirname, 'project-dist', 'style.css');
  const cssWriter = fs.createWriteStream(styleDest);

  await readdir(styleSrc, { withFileTypes: true }).then(dirents => {
    const files = dirents.filter(dirent => dirent.isFile()).map(file => file.name);
    const styleFiles = files.filter(file => extname(file) === '.css');
    const paths = styleFiles.map(file => join(styleSrc, file));
    paths.forEach(path => {
      const cssReader = fs.createReadStream(path);
      cssReader.pipe(cssWriter, { end: false });
    });
  }).catch(error);
}

async function createHTML() {
  const htmlSrc = join(__dirname, 'template.html');
  const htmlDest = join(__dirname, 'project-dist', 'index.html');
  const htmlComponents = join(__dirname, 'components');

  const [files, template] = await Promise.all([
    getComponents(htmlComponents),
    getTemplate(htmlSrc),
  ]);

  const htmlFiles = files.filter(file => extname(file) === '.html');
  const componentPaths = htmlFiles.map(file => join(htmlComponents, file));
  const fileNames = htmlFiles.map(file => file.split('.').shift());
  let finishedHTML = template;

  componentPaths.forEach(path => {
    readFile(path, { encoding: 'utf-8' }).then(data => {
      let component = data;
      const fileName = fileNames.filter(name => path.includes(name)).pop();
      finishedHTML = finishedHTML.replace(`{{${fileName}}}`, `\n${component}\n`);
      writeFile(htmlDest, finishedHTML).catch(error);
    }).catch(error);
  });
}

async function getComponents(path) {
  return await readdir(path, { withFileTypes: true })
    .then(dirents => dirents.filter(dirent => dirent.isFile()).map(file => file.name))
    .catch(error);
}

async function getTemplate(path) {
  return await readFile(path, { encoding: 'utf-8' })
    .then(data => data)
    .catch(error);
}