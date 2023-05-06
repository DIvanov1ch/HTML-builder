const { stdin, stdout, exit } = process;
const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');

const pathToFile = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(pathToFile);
const readLine = readline.createInterface({ input: stdin, output: stdout });

stdout.write('Hello, guys!\nEnter your text: \n');
readLine.on('line', data => {
  if (data === 'exit') {
    exit();
  } else {
    writeStream.write(`${data}\n`);
  }
});

process.on('exit', code => {
  if (code === 0) {
    stdout.write('Bye-bye!');
  }
});