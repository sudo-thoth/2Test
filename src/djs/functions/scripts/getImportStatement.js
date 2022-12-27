const { path } = require("path");
const { logError } = require("./logError");
/**
 * Generates an import statement for fileA relative to fileB.
 *
 * @param {string} fileA - The name of the file to be imported.
 * @param {string} fileB - The name of the file from which fileA will be imported.
 *
 * @returns {string} The import statement.
 */
module.exports = function getImportStatement(fileA, fileB) {
  // Find the path to the src directory relative to the current file
  const pathToSrc = path.join(__dirname, "src");
  const pathToFileA = path.join(pathToSrc, `${fileA}.js`);
  const pathToFileB = path.join(pathToSrc, `${fileB}.js`);

  // Find the relative path from fileB to fileA
  const relativePath = path.relative(pathToFileB, pathToFileA);
  if (relativePath) {
    console.log(
      `The relative path from ${fileB} to ${fileA} is ${relativePath}`
    );
    // Return the import statement
    return relativePath.toString();
  } else {
    try {
      logError(
        error,
        `Error generating import statement from ${fileB} to ${fileA}`
      );
    } catch (error) {
      console.log(
        `The 'logError' file path is incorrect in getImportStatement.js`
      );
    }
  }
};
