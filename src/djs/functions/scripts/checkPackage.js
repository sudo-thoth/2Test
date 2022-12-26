function manualLog(error, fileFunction)  {
    console.log(`❌ Failed Importing ${fileFunction} due to incorrect directory path. \u2B05`);
    console.log("-------------------------------");
    console.log(`Message: ${error.message}`);
    console.log("-------------------------------");
    console.log(`File: ${error.fileName}`);
    console.log(`Line: ${error.lineNumber}`);
}
try {
	const getImportStatement = require(`./getImportStatement.js`);
} catch (error) {
  manualLog(error, `getImportStatement.js`);
	return
}


try {
	const logError = require(`${getImportStatement(`logError`, `checkPackage`)}./logError.js`);
} catch (error) {
  manualLog(error, `logError.js`);
  return
	
}


module.exports = function checkPackage(packageName) {
    try {
      require(packageName);
    } catch (error) {
      logError(error);
    }
  }