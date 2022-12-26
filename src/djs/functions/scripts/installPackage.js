// Importing the required modules
try {
    const logError = require('./logError');

} catch (error) {
    console.log(`❌ Failed to import logError.js due to incorrect directory path. \u2B05`);
    console.log("-------------------------------");
    console.log(`Message: ${error.message}`);
      console.log("-------------------------------");
      console.log(`File: ${error.fileName}`);
      console.log(`Line: ${error.lineNumber}`);
      return;

}

try {
	const checkPackage = require('./checkPackage');
} catch (error) {
    let about = `This error occurred due to an incorrect directory path from the checkPackage.js file \u2B05 installPackage.js.`;
    // print right-arrow symbol
    console.log(`\u2B05`);
    try {
        logError(error, about);
    } catch (error) {
        console.log(`❌ Failed to import logError.js due to incorrect directory path. \u2B05`);
        console.log("-------------------------------");
        console.log(`Message: ${error.message}`);
          console.log("-------------------------------");
          console.log(`File: ${error.fileName}`);
          console.log(`Line: ${error.lineNumber}`);
          return;
    }
	
}



try {
    const { execSync } = require('child_process');
  } catch (error) {
    let about = `This error occurred due to an incorrect directory path from the checkPackage.js file \u2B05 installPackage.js.\nMust install child_process || npm install child_process`;
    try {
	logError(error, about);
} catch (error) {
	console.log(`❌ Failed to import logError.js due to incorrect directory path. \u2B05`);
    console.log("-------------------------------");
    console.log(`Message: ${error.message}`);
      console.log("-------------------------------");
      console.log(`File: ${error.fileName}`);
      console.log(`Line: ${error.lineNumber}`);
      return;
}
  }




module.exports = function installPackages(packageNames) {
  let numOfInstalledPackages = 0;

    if (checkPackage('execSync')) {
      console.log(`In Progress of installing Packages . . . . .`);
	for (const packageName of packageNames) {
	      try {
	        execSync(`npm install ${packageName}`, { stdio: 'inherit' });
          numOfInstalledPackages++;
	      } catch (error) {
	        let about = `Failed to install ${packageName}.`;
	        try {
            logError(error, about);
          } catch (error) {
            console.log(`❌ Failed Execute logError() \u2B05`);
              console.log("-------------------------------");
              console.log(`Message: ${error.message}`);
                console.log("-------------------------------");
                console.log(`File: ${error.fileName}`);
                console.log(`Line: ${error.lineNumber}`);
          }
	      }
	    }
      console.log(`✅ Successfully Completed installPackages() installed ${numOfInstalledPackages} packages.`);
} else {
    console.log(`❌ Failed to install 'execSync' package. Therefore cannot install any packages automatically \u2B05\nMust install child_process || npm install child_process`);
      return
}
  }