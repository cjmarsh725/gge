var fs = require('fs');
var path = require('path');

var srcDir = path.join(__dirname, '..', 'src');
var destDir = path.join(__dirname, 'packed.js');
fs.watch(srcDir, function (eventType, filename) {
  try {
    let packedData = '';
    const files = walk(srcDir);
    for (const file of files) {
      packedData += fs.readFileSync(file, 'utf8') + '\n\n';
    }
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