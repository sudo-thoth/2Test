// Import the required modules
const chalk = require("chalk"); // npm i chalk@4.1.2
const inBox = require("./inBox.js");



/**
 * This module logs errors to the console, with the option to log additional data if it is provided.
 *
 * @param {Error} error - The error object to be logged.
 * @param {Object} [data] - Additional data to be logged with the error.
 */
module.exports = function logError(error, data) {

  // Define two log messages
let logWithData = `
${chalk.red.bold.bgGray("Error Details:")}
${'---------------'}
${chalk.bold.bgGray("Message:")} ${error.message}
${'---------------'}
${chalk.bold.blue.bgWhite("File:")} ${error.fileName}
${chalk.bold.cyan.bgWhite("Line:")} ${error.lineNumber}
${'---------------'}
${chalk.bold.yellow.bgGray("Data:")} ${JSON.stringify(data)}
`;

let logWithoutData = `
${chalk.underline.red.bgGray("❌ Error Occurred ❌")}
${'---------------'}
${chalk.bold.bgGray("Message:")} ${error.message}
${'---------------'}
${chalk.bold.blue.bgWhite("File:")} ${error.fileName}
${chalk.bold.cyan.bgWhite("Line:")} ${error.lineNumber}
`;

  // Check if the 'data' argument is defined
  if (data) {
    // Ask the user if they want to log the error
    process.stdout.write("Would you like to log this error? (Y/N) ");

    // Set a timeout to log the error after 15 seconds if no response is received
    let timeoutId = setTimeout(() => {
      try {
        console.log(inBox(logWithoutData));
      } catch (err) {
        console.error(err);
      }
      return;
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
        try {
          console.log(inBox(logWithData));
        } catch (err) {
          console.error(err);
        }
        return;
      } else {
        try {
          console.log(inBox(logWithoutData));
        } catch (err) {
          console.error(err);
        }
        return;
      }
    });
  } else {
    // If the 'data' argument is not defined, log the error message only
    try {
      console.log(inBox(logWithoutData));
    } catch (err) {
      console.error(err);
    }
    return;
  }
};
