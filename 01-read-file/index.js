const fs = require('fs');
const path = require('path');
const { stdout } = process;

const pathToText = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathToText);
let data = '';

readStream.on('data', chunk => data += chunk.toString());
readStream.on('end', () => stdout.write(data));
readStream.on('error', error => stdout.write(`Error: ${error.message}`));