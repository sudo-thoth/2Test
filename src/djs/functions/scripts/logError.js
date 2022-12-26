// Before anything must install chalk package @ npm i chalk
const installPackage = require('./installPackage');
installPackage('chalk', 'exists');
const chalk = require('chalk');

console.log(chalk.bold("Error Details:")); // Bold text
console.log(chalk.underline(`Message: ${error.message}`)); // Underlined text
console.log("-------------------------------");
console.log(chalk.red(`File: ${error.fileName}`));

module.exports = function logError(error, data) {
  // Print the error message to the console
  console.error(error.message);

  if (exists(data)) {
    // Ask the user if they want to log the error
    process.stdout.write("Would you like to log this error? (Y/N) ");

    // Set a timeout to log the error after 15 seconds if no response is received
    let timeoutId = setTimeout(() => {
      console.log("\n❌ Error Occurred ❌");
      console.log(`Message: ${error.message}`);
      console.log("-------------------------------");
      console.log(`File: ${error.fileName}`);
      console.log(`Line: ${error.lineNumber}`);
    }, 15000);

    // Wait for the user's response
    process.stdin.once("data", (input) => {
      // Convert the input to a string and remove all whitespace
      input = input.toString().replace(/\s/g, "");

      // Clear the timeout
      clearTimeout(timeoutId);

      // If the user responds with "Y", "Yes", or an empty line, log the error and data
      if (
        input.toUpperCase() === "Y" ||
        input.toLowerCase() === "yes" ||
        input === ""
      ) {
        console.log("\nError Details:");
        console.log(`Message: ${error.message}`);
        console.log("-------------------------------");
        console.log(`File: ${error.fileName}`);
        console.log("-------------------------------");
        console.log(`Line: ${error.lineNumber}`);
        console.log("-------------------------------");
        console.log(`Data: ${JSON.stringify(data)}`);
      } else {
        console.log("\n❌ Error Occurred ❌");
        console.log(`Message: ${error.message}`);
        console.log("-------------------------------");
        console.log(`File: ${error.fileName}`);
        console.log(`Line: ${error.lineNumber}`);
      }
    });
  } else {
    console.log("\n❌ Error Occurred ❌");
    console.log(`Message: ${error.message}`);
    console.log("-------------------------------");
    console.log(`File: ${error.fileName}`);
    console.log(`Line: ${error.lineNumber}`);
  }
};
