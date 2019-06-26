const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const babel = require('@babel/core');

const srcDir = path.join(__dirname, '..', '..', 'src');
const destDir = path.join(__dirname, '..', 'gg.js');
const openDir = path.join(__dirname, 'open');
const closeDir = path.join(__dirname, 'close');
const packDir = path.join(__dirname, 'pack');

chokidar.watch(srcDir, {}).on('change', (e, p) => {
  try {
    let packedData = fs.readFileSync(openDir, 'utf8');
    const files = fs.readFileSync(packDir, 'utf8').replace(/\r\n/g,'\n').split("\n");
    for (const file of files) {
      if (file === '') continue;
      const filePath = path.join(srcDir, file + '.js');
      packedData += fs.readFileSync(filePath, 'utf8') + '\n\n';
    }
    packedData += fs.readFileSync(closeDir, 'utf8');
    const babeled = babel.transformSync(packedData, {
      minified: true,
      comments: false,
      presets: [ [ "@babel/preset-env", 
                    { "useBuiltIns": "entry", "corejs": "3.0.0" } ] ]
    }).code;
    fs.writeFileSync(destDir, babeled);
  }
  catch (error) {
    console.error(error);
  }
});