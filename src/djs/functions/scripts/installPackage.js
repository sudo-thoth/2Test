// Import the execSync function from the child_process module
const { execSync } = require("child_process");

/**
 * Installs a list of npm packages.
 *
 * @param {string[]} packageNames - An array of package names to be installed.
 *
 * @returns {void}
 *
 * @throws {Error} If an error occurs while executing the installPackages function.
 */

// Define the installPackages function, which takes an array of package names as an argument
module.exports = function installPackages(packageNames) {
  // Initialize a variable to keep track of the number of installed packages
  let numOfInstalledPackages = 0;
  // Use a try-catch block to handle any errors that may occur while executing the following code
  try {
    // Log a message to the console indicating that the installation process has started
    console.log(`In Progress of installing Packages . . . . .`);

    // Loop through the array of package names
    for (const packageName of packageNames) {
      // Use a try-catch block to handle any errors that may occur while installing a specific package
      try {
        // Use the execSync function to install the package using npm
        execSync(`npm install ${packageName}`, { stdio: "inherit" });
        // Increment the count of installed packages
        numOfInstalledPackages++;
      } catch (error) {
        // If the error has a code of "MODULE_NOT_FOUND", it means that the child_process package is not installed
        if (error.code === "MODULE_NOT_FOUND") {
          // Log a message to the console indicating that the child_process package must be installed
          console.log(
            `The 'child_process' package is not installed. Please install it by running 'npm install child_process' and try again.`
          );
        } else {
          // If the error is not a "MODULE_NOT_FOUND" error, it is assumed to be a different error, and the original error message is displayed
          console.error(`Failed to install ${packageName}.`);
        }
      }
    }
    // Log a message to the console indicating that the installation process has completed successfully
    console.log(
      `✅ Successfully Completed installPackages() installed ${numOfInstalledPackages} packages.`
    );
  } catch (error) {
    // If an error occurs outside of the inner try-catch block, it is assumed to be a different error, and the original error message is displayed
    console.error(`Error executing installPackages(): ${error.message}`);
  }
};
