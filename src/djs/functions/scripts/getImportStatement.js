
const path = require('path');

module.exports = function getImportStatement(fileA, fileB) {
    const pathToSrc = '/path/to/src';
    const pathToFileA = `${pathToSrc}/${fileA}.js`;
    const pathToFileB = `${pathToSrc}/${fileB}.js`;
  
    // Find the relative path from fileB to fileA
    const relativePath = path.relative(pathToFileB, pathToFileA);
  
    console.log(`import ${fileA} from './${relativePath}';`);
    // Return the import statement
    return relativePath.toString();
  }