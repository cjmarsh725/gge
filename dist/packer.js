var fs = require('fs');
var path = require('path');
var chokidar = require('chokidar');

var srcDir = path.join(__dirname, '..', 'src');
var destDir = path.join(__dirname, 'gg.js');

chokidar.watch(srcDir, {}).on('change', (event, path) => {
  try {
    let packedData = 'const GG = (config = {}) => {\n';
    packedData += 'const GG_E = {};\nconst GG_I = {}\n\n';
    const files = walk(srcDir);
    for (const file of files) {
      packedData += fs.readFileSync(file, 'utf8') + '\n\n';
    }
    packedData += 'GG_Setup();\n'
    packedData += '\nreturn GG_E;\n}'
    fs.writeFileSync(destDir, packedData);
  }
  catch (error) {
    console.error(error);
  }
});

var walk = function(dir) {
  var results = [];
  var list = fs.readdirSync(dir);
  list.forEach(function(file) {
      file = dir + '/' + file;
      var stat = fs.statSync(file);
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