// All Functions Contained Within This File
/*
    logError,
    cLog,
    isDefined,
    verifyImport,
    installPackages,
    getImportStatement,
    generateColors,
    getRand,
    generateHexCode,
    chalkBox,
    inBox,
    getColor
*/



const chalk = require('chalk'); // npm i chalk@4.1.2
const execSync = require("child_process");
const box = require('cli-box');
const path = require("path");


// Script Functions to be exported

/**
 * This module logs errors to the console, with the option to log additional data if it is provided.
 *
 * @param {Error} error - The error object to be logged.
 * @param {Object} [data] - Additional data to be logged with the error.
 */
function logError(error, data) {
  // Define two log messages
  let logWithData = `
  ${chalk.red.bold.bgGray("Error Details:")}
  ${"---------------"}
  ${chalk.bold.bgGray("Message:")} ${error.message}
  ${"---------------"}
  ${chalk.bold.blue.bgWhite("File:")} ${error.fileName}
  ${chalk.bold.cyan.bgWhite("Line:")} ${error.lineNumber}
  ${"---------------"}
  ${chalk.bold.yellow.bgGray("Data:")} ${JSON.stringify(data)}
  ${chalk.red(`Error Summary`)} ${error}
  `;

  let logWithoutData = `
  ${chalk.underline.red.bgGray("❌ Error Occurred ❌")}
  ${"---------------"}
  ${chalk.bold.bgGray("Message:")} ${error.message}
  ${"---------------"}
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
          console.log(error);
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
}

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
function cLog(data) {
  // Get the stack trace of the current error.
  // The stack trace is a string that contains information about the current call stack.
  // Each line of the stack trace represents a function call, with the most recent function call at the top.
  const stackTrace = new Error().stack;
  cLog(`The StackTrace ${stackTrace}`);

  // Split the stack trace into an array of lines.
  const lines = stackTrace.split("\n");
  cLog(`The StackTrace ${lines}`);

  // The second line of the stack trace (lines[1]) contains the file and line number where the consoleLog() function was called.
  // The file and line number are in the format "file:lineNumber:columnNumber".
  // For example, if the consoleLog() function was called from "main.js:15:5", the second line of the stack trace would be "    at consoleLog (main.js:15:5)".
  const fileAndLineNumber = lines[1];
  cLog(`The File and Line Number ${fileAndLineNumber}`);

  // Extract the file and line number from the second line of the stack trace.
  // The file and line number are between the parentheses "(" and ")".
  // For example, if the second line of the stack trace is "    at consoleLog (main.js:15:5)",
  // the file and line number are "main.js:15:5".
  const fileAndLineNumberString = fileAndLineNumber.substring(
    fileAndLineNumber.indexOf("(") + 1,
    fileAndLineNumber.indexOf(")")
  );

  // Split the file and line number string into the file, line number, and column number using a regular expression.
  // The regular expression matches any character (`.+`) one or more times (`+`) followed by a `:` character,
  // one or more digits (`\d+`), and another `:` character and one or more digits (`:\d+`).
  // The parentheses (`()`) around `.+` and `\d+` capture the matched characters, so that they can be accessed later using the array destructuring syntax.
  const [file, lineNumber, columnNumber] = fileAndLineNumberString.match(
    /(.+):(\d+):(\d+)/
  );

  const lineLog = `${chalk.underline.italic.yellow.bgGray(
    " >>>>>> Log <<<<<< "
  )}`;
  const lineData = `${chalk.yellow.bold.bgGray("Data:")}
    ${chalk.yellow.bgGray(data)}`;
  const lineDivider = `${"---------------"}`;
  const logInfo = `
    ${chalk.underline.blue.bgGray("Location:")}
    ${chalk.bold.blue.bgWhite(`File: ${file}`)}
    ${chalk.bold.cyan.bgWhite(`Line: ${lineNumber}`)}`;

  // Create the log string using template literals and the chalk library to add formatting.
  // The log string includes the data being logged, as well as the file and line number where the consoleLog() function was called.
  // The data is displayed in yellow bold text, and the file and line number are displayed in blue and cyan bold text, respectively.
  // A horizontal line is also added to visually separate the data from the file and line number.
  const logs = data
    ? `
    ${lineLog}
    ${lineData}
    ${lineDivider}
    ${logInfo}
  `
    : `
  ${lineLog}
  ${lineDivider}
  ${logInfo}
  `;

  // Surround the log string with a box using the inBox() function and log the result to the console.
  try {
    console.log(inBox(logs));
  } catch (err) {
    console.log(`About to log an error`);
    logError(
      err,
      `Error in consoleLog() function. | Meaning an error when trying to do a regular logging.`
    );
  }
  return 999;
}

/**
 * Returns a boolean indicating whether the given variable is defined
 *
 * @param {any} variable - The variable to check
 * @return {boolean} - True if the variable is defined, false otherwise
 */
function isDefined(variable) {
  // add a check to make sure only one argument is passed in
  if (arguments.length !== 1) {
    try {
      throw new Error("isDefined() only accepts one argument");
    } catch (error) {
      logError(
        error,
        "isDefined() only accepts one argument, more than one argument was passed in"
      );
    }
  }

  if (variable === null) return false;
  return typeof variable !== "undefined";
}

// Needs a Description
function verifyImport(module) {
  // check if the module is defined
  if (module !== undefined) {
    return true;
  } else {
    return false;
  }
}

/**
 * Installs a list of npm packages.
 *
 * @param {string[]} packageNames - An array of package names to be installed.
 *
 * @returns {void}
 *
 * @throws {Error} If an error occurs while executing the installPackages function.
 */

function installPackages(packageNames) {
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
}

/**
 * Generates an array of unique hex codes.
 *
 * @param {number} num - The number of hex codes to generate. Must be a positive integer.
 * @returns {string[]} An array of hex codes.
 *
 * @throws {Error} If 'num' is not a positive integer.
 *
 * @example
 * generateColors(5); // returns an array of 5 unique hex codes
 */
function generateColors(num = 1) {
  if (typeof num !== "number" || num < 1 || num % 1 !== 0) {
    try {
      throw new Error("'num' must be a positive integer");
    } catch (error) {
      let about = "'num' must be a positive integer";
      logError(error, about);
    }
  }

  // an array to store the hex codes
  const colors = [];

  // generate 'num' hex codes
  for (let colorsGenerated = 0; num > colorsGenerated; colorsGenerated++) {
    try {
      // generate a hex code
      const color = generateHexCode();
      // check if the hex code is already in the array and add it to the array if it's not
      if (!colors.includes(color)) {
        colors.push(color);
      } else {
        // if the hex code is already in the array, decrement the counter so we generate another hex code
        colorsGenerated--;
      }
    } catch (error) {
      // log the error and continue generating colors
      logError(error, "Error generating hex code");
      colorsGenerated--;
    }

    // log the progress of the loop
    cLog(`Generated ${colorsGenerated + 1} colors`);

    // exit the loop when the required number of colors have been generated
    if (colors.length === num) {
      break;
    }
  }

  // return the array of hex codes
  return colors;
}

/**
 * Generates an import statement for fileA relative to fileB.
 *
 * @param {string} fileA - The name of the file to be imported.
 * @param {string} fileB - The name of the file from which fileA will be imported.
 *
 * @returns {string} The import statement.
 */
function getImportStatement(fileA, fileB) {
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
}

/**
 * Returns a random value/element from an array or object.
 *
 * @param {Array|Object} data - The array or object to select from.
 * @returns {any} A random element from the array or object.
 *
 * @throws {Error} If the passed variable is not an array or object.
 * @throws {Error} If the passed array is empty.
 * @throws {Error} If the passed variable is null or undefined.
 *
 * @example
 * getRand([1, 2, 3, 4, 5]); // returns a random element from the array
 * getRand({a: 1, b: 2, c: 3}); // returns a random value from the object
 */
function getRand(data = []) {
  try {
    // Check if the passed variable is null or undefined
    if (data == null) {
      throw new Error("Passed variable is null or undefined");
    }

    // Check if the passed variable is an array
    if (Array.isArray(data)) {
      // Check if the passed array is empty
      if (data.length === 0) {
        throw new Error("Passed array is empty");
      }

      // Generate a random number between 0 and the number of elements in the array
      const randIndex = Math.floor(Math.random() * data.length);

      // Return the element at the randomly-chosen index
      return data[randIndex];
    } else if (typeof data === "object" && data !== null) {
      // Get the keys of the object
      const keys = Object.keys(data);

      // Generate a random number between 0 and the number of keys in the object
      const randIndex = Math.floor(Math.random() * keys.length);

      // Return the value at the randomly-chosen key
      return data[keys[randIndex]];
    } else {
      throw new Error("Passed variable is not an array or object");
    }
  } catch (error) {
    // Log the error using the provided logError function
    try {
      logError(error);
    } catch (error) {
      console.error(error);
      return;
    }
  }
}

/**
 * Generates a random hex code for a color.
 *
 * @returns {string} - The generated hex code.
 *
 * @throws {Error} - If an error occurs while generating the hex code.
 *
 * @example
 * generateHexCode();
 * // returns a string such as "#ffaadd"
 */
function generateHexCode() {
  try {
    // generate a random number between 0 and 255 for each of the red, green, and blue channels
    const r = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const g = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");
    const b = Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0");

    // return the hex code as a string
    return `#${r}${g}${b}`;
  } catch (error) {
    // if an error occurs, catch it and throw it again so that it can be handled by the caller
    logError(error, "Error generating hex code");
  }
}

// Needs Description
function chalkBox(text) {
  const horizontalLine = "-".repeat(text.length / 2);
  let boxed = `
    ${chalk.bgGray.bold(horizontalLine)}
    ${` ${text} `}
      ${chalk.bgGray.bold(horizontalLine)}
      `;
  return boxed;
}

/**
 * Creates a box around a given string with specified options.
 *
 * @param {string} text - The text to be surrounded by a box.
 * @param {string} [color='yellow'] - The color of the border.
 * @returns {string} - The text surrounded by a box.
 *
 * @example
 * inBox("Hello, World!", "red");
 * // returns the text "Hello, World!" surrounded by a red box
 */
function inBox(text, color = "yellow") {
    // check color is a string and if not set to yellow
    if (typeof color !== "string") {
        color = "yellow";
    }

    // check text is a string and if not, return an error message
    if (typeof text !== "string") {
        return "Error: Invalid input for inBox function. Input must be a string.";
    }

    try {
        return chalkBox(text);
    } catch (error) {
        console.log("Error Attempting to use the chalkBox function : in the process of creating a box around a string to be logged to the console");
        return ;
    }
}

/**
 * A cache of unique hex codes.
 *
 * @type {Set}
 * The colorCache object is a Set that stores a set of unique hex codes.
 */
const colorCache = new Set();
/**
 * Returns a random color from a set of unique hex codes.
 *
 * @returns {string} A random hex code.
 *
 * @throws {Error} If there are no more unique hex codes in the cache.
 *
 * @example
 * getColor(); // returns a random hex code
 */
function getColor() {
  if (colorCache.size === 0) {
    throw new Error("There are no more unique hex codes in the cache.");
  }

  try {
    // The generateColors() function generates an array of unique hex codes.
    // The getRand() function returns a random element from an array.
    // If the colorCache is empty, a new set of unique hex codes is generated and added to the cache.
    if (colorCache.size === 0) {
      const colors = generateColors(100);
      for (const color of colors) {
        colorCache.add(color);
      }
    }

    // Choose a random color from the cache and remove it from the cache using the delete() method.
    const color = getRand([...colorCache]);
    colorCache.delete(color);

    // Return the selected color.
    return color;
  } catch (error) {
    // The try block attempts to get a random color from the cache and remove it from the cache.
    // If an error occurs, it is caught in the catch block and a new error is thrown with a more descriptive message.
    logError(error, "Failed to get a random color");
  }
}


module.exports = {
    logError,
    cLog,
    isDefined,
    verifyImport,
    installPackages,
    getImportStatement,
    generateColors,
    getRand,
    generateHexCode,
    chalkBox,
    inBox,
    getColor
}