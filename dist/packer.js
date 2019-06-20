const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const babel = require('@babel/core');

const srcDir = path.join(__dirname, '..', 'src');
const destDir = path.join(__dirname, 'gg.js');

chokidar.watch(srcDir, {}).on('change', (event, path) => {
  try {
    let packedData = 'const GG = (config = {}) => {\n';
    packedData += 'const GG_E = {};\nconst GG_I = {}\n\n';
    const files = walk(srcDir);
    for (const file of files) {
      packedData += fs.readFileSync(file, 'utf8') + '\n\n';
    }
    packedData += 'GG_Setup();\n\nreturn GG_E;\n}';
    const babeled = babel.transformSync(packedData, {
      minified: true,
      comments: false,
      presets: [ [ "@babel/preset-env", 
                    { "useBuiltIns": "entry", "corejs": "3.0.0" } ] ]
    }).code;
    fs.writeFileSync(destDir, babeled);
    console.log("File updated");
  }
  catch (error) {
    console.error(error);
  }
});

const walk = function(dir) {
  const results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
      file = dir + '/' + file;
      const stat = fs.statSync(file);
      if (stat && stat.isDirectory()) { 
          /* Recurse into a subdirectory */
          results = results.concat(walk(file));
      } else { 
          /* Is a file */
          results.push(file);
      }
  });
  return results;
}