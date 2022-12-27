// Before anything must install chalk package @ npm i chalk

const { chalk } = require('chalk');
const { inBox } = require('./inBox');
const { logError } = require('./logError');






/**
 * Logs data to the console with the file and line number where the function was called.
 * The data is also surrounded by a box.
 *
 * @param {any} data - The data to log.
 *
 * @example
 * consoleLog("Something went wrong");
 * // logs the data, the file and line number where the function was called, and surrounds the output with a box
 */
module.exports = function cLog(data) {
  // Get the stack trace of the current error.
  // The stack trace is a string that contains information about the current call stack.
  // Each line of the stack trace represents a function call, with the most recent function call at the top.
  const stackTrace = new Error().stack;

  // Split the stack trace into an array of lines.
  const lines = stackTrace.split("\n");

  // The second line of the stack trace (lines[1]) contains the file and line number where the consoleLog() function was called.
  // The file and line number are in the format "file:lineNumber".
  // For example, if the consoleLog() function was called from "main.js:15", the second line of the stack trace would be "    at consoleLog (main.js:15)".
  const fileAndLineNumber = lines[1];

  // Extract the file and line number from the second line of the stack trace.
  // The file and line number are between the parentheses "(" and ")".
  // For example, if the second line of the stack trace is "    at consoleLog (main.js:15)",
  // the file and line number are "main.js:15".
  const fileAndLineNumberString = fileAndLineNumber.substring(
    fileAndLineNumber.indexOf("(") + 1,
    fileAndLineNumber.indexOf(")")
  );

  // Split the file and line number string into the file and line number using a regular expression.
  // The regular expression matches any character (`.+`) one or more times (`+`) followed by a `:` character and one or more digits (`\d+`).
  // The parentheses (`()`) around `.+` and `\d+` capture the matched characters, so that they can be accessed later using the `slice()` method.

  // The `slice()` method returns an array of the captured strings, with the first element being the file path and the second element being the line number.
  const [file, lineNumber] = fileAndLineNumberString.match(/(.+):(\d+)/).slice(1);

  // Create the log string using template literals and the chalk library to add formatting.
  // The log string includes the data being logged, as well as the file and line number where the consoleLog() function was called.
  // The data is displayed in yellow bold text, and the file and line number are displayed in blue and cyan bold text, respectively.
  // A horizontal line is also added to visually separate the data from the file and line number.
  const logs = data ? `
  ${chalk.underline.bold.italic.yellow.size(17)("Log:")}
${chalk.yellow.bold("Data:")}
${chalk.yellow(data)}
${'-------------------------------'}

${chalk.underline.bold.blue.size(17)("Location:")}
${chalk.bold.blue(`File: ${file}`)}
${chalk.bold.cyan(`Line: ${lineNumber}`)}
` : `
${chalk.underline.bold.italic.yellow.size(17)("Log:")}
${'-------------------------------'}

${chalk.underline.bold.blue.size(17)("Location:")}
${chalk.bold.blue(`File: ${file}`)}
${chalk.bold.cyan(`Line: ${lineNumber}`)}
`;

// Surround the log string with a box using the inBox() function and log the result to the console.
try {
    console.log(inBox(logs));
  } catch (err) {
    logError(err, `Error in consoleLog() function. | Meaning an error when trying to do a regular logging.`);
  }

};