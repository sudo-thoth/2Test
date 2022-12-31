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
  
  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split('\n');
  const funcCallerLine = errorLines[2]; // "at createEmbed (/Users/logantucker/Desktop/projects/bots/2test/src/djs/functions/create/createEmbed.js:79:11)"
  
  // Extract the file name, file path, line number, and column using the regular expression and array destructuring assignment as shown in the previous example
  const extractInfoRegex = /at\s(.*)\s\((.*):(\d+):(\d+)\)/;
  const [, fileName, filePath, lineNumber, column] = funcCallerLine.match(extractInfoRegex);
  const fileNameWithExtension = path.basename(filePath);

  // Define two log messages
  let logWithData = `
  ${chalk.red.bold.bgGray("Error Details:")}
  ${"---------------"}
  ${chalk.bold.bgGray("Message:")} ${error.message}
  ${"---------------"}
  ${chalk.bold.blue.bgWhite("File:")} ${fileNameWithExtension}
  ${chalk.bold.cyan.bgWhite("Line:")} ${lineNumber}
  ${"---------------"}
  ${chalk.bold.yellow.bgGray("Data:")} ${JSON.stringify(data)}
  ${chalk.red(`Error Summary`)} ${error}
  `;

  let logWithoutData = `
  ${chalk.underline.red.bgGray("❌ Error Occurred ❌")}
  ${"---------------"}
  ${chalk.bold.bgGray("Message:")} ${error.message}
  ${"---------------"}
  ${chalk.bold.blue.bgWhite("File:")} ${fileNameWithExtension}
  ${chalk.bold.cyan.bgWhite("Line:")} ${lineNumber}
  `;

  // Check if the 'data' argument is defined
  if (data) {
    // Ask the user if they want to log the error
    process.stdout.write("Would you like to log this error? (Y/N) ");

    // Set a timeout to log the error after 15 seconds if no response is received
    let timeoutId = setTimeout(() => {
      try {
        console.log(inBox(logWithoutData), error);
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
          console.log(inBox(logWithData), error);
        } catch (err) {
          console.error(err);
        }
        return;
      } else {
        try {
          console.log(inBox(logWithoutData), error);
        } catch (err) {
          console.error(err);
        }
        return;
      }
    });
  } else {
    // If the 'data' argument is not defined, log the error message only
    try {
      console.log(inBox(logWithoutData), error);
    } catch (err) {
      console.error(err);
    }
    return;
  }
}


function logger(stacktrace, log){
  console.log(`start`)
  // console.log(stacktrace + log)
  
  // const stackTrace = new Error().stack;
  // console.log(`${stackTrace}`)

  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split('\n');
  const funcCallerLine = errorLines[2]; // "at createEmbed (/Users/logantucker/Desktop/projects/bots/2test/src/djs/functions/create/createEmbed.js:79:11)"
  
  // Extract the file name, file path, line number, and column using the regular expression and array destructuring assignment as shown in the previous example
  const extractInfoRegex = /at\s(.*)\s\((.*):(\d+):(\d+)\)/;
  const [, fileName, filePath, lineNumber, column] = funcCallerLine.match(extractInfoRegex);
  const fileNameWithExtension = path.basename(filePath);

console.log(fileName);

  console.log(`fileNameWithExtension:`,fileNameWithExtension); // "createEmbed.js"
  console.log(`filename:`,fileName); // "createEmbed"
  console.log(`filePath:`,filePath); // "/Users/logantucker/Desktop/projects/bots/2test/src/djs/functions/create/createEmbed.js"
  console.log(`lineNumber`,lineNumber); // "79"
  console.log(`column`,column); // "11"

  const logData = `
  ${chalk.bold.bgGray("Function/Error Called From:")} ${log}
  ${"---------------"}
  ${chalk.bold.blue.bgWhite("File:")} ${fileNameWithExtension}
  ${chalk.bold.cyan.bgWhite("Line:")} ${lineNumber}
  ${"---------------"}
  ${chalk.bold.yellow.bgGray("Data:")} ${JSON.stringify(data)}
  ${chalk.red(`Error Summary`)} ${error}
  `;
  console.log(logData)


  
  console.log(`end`)
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

  const errorMessage = new Error().stack;
  const errorLines = errorMessage.split('\n');
  const funcCallerLine = errorLines[2]; // "at createEmbed (/Users/logantucker/Desktop/projects/bots/2test/src/djs/functions/create/createEmbed.js:79:11)"
  
  // Extract the file name, file path, line number, and column using the regular expression and array destructuring assignment as shown in the previous example
  const extractInfoRegex = /at\s(.*)\s\((.*):(\d+):(\d+)\)/;
  const [, fileName, filePath, lineNumber, column] = funcCallerLine.match(extractInfoRegex);
  const fileNameWithExtension = path.basename(filePath);

  const lineLog = `${chalk.underline.italic.yellow.bgGray(
    " >>>>>> Log <<<<<< "
  )}`;

  let lineData;
  if (typeof data === "string"){
    lineData = `${chalk.yellow.bold.bgGray("Message:")}
    ${chalk.yellow.bgGray(data)}`;
  } else {
  lineData = `${chalk.yellow.bold.bgGray("Data:")}
    ${chalk.yellow.bgGray(data)}`;
  }
  const lineDivider = `${"---------------"}`;
  const logInfo = `
    ${chalk.underline.blue.bgGray("Location:")}
    ${chalk.bold.blue.bgWhite(`File: ${fileNameWithExtension}`)}
    ${chalk.bold.cyan.bgWhite(`Line: ${lineNumber}`)}`;

  // Create the log string using template literals and the chalk library to add formatting.
  // The log string includes the data being logged, as well as the file and line number where the consoleLog() function was called.
  // The data is displayed in yellow bold text, and the file and line number are displayed in blue and cyan bold text, respectively.
  // A horizontal line is also added to visually separate the data from the file and line number.
  const logs = data
    ? `
    ${lineLog}
    ${lineData}
    ${logInfo}
    
  `
    : `
  ${lineLog}
  ${logInfo}
  `;

  // Surround the log string with a box using the inBox() function and log the result to the console.
  try {
    console.log(inBox(logs),inBox(data));
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
  let numOfColors;
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

    
numOfColors = colorsGenerated;
    // exit the loop when the required number of colors have been generated
    if (colors.length === num) {
      break;
    }
  }
  // log the progress of the loop
  // cLog(`Generated ${numOfColors + 1} colors`);

  // return the array of hex codes
  return colors;
}

function getSuccessColor() {
  return `00ff00`;
}

function getErrorColor() {
  return [255, 0, 0];
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
        return text;
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
    return '#040303';
  }
}

function getInteractionObj(interaction){
// check to make sure the interaction is an object
if (typeof interaction !== "object") {
  try {
    throw new Error("The interaction is not an object");
  } catch (error) {
    logError(error);
  }
} else {
  try {
  let obj = {
    id: `${interaction.id}`,
    channel: `${interaction.channel}`,
    guild: `${interaction.guild}`,
    userInfo: {
      // get the user name of the user who triggered the interaction
    name: `${interaction.member.user.username}`,
      displayName: `${interaction.member.displayName}`,
    // get the user id of the user who triggered the interaction
    userId: `${interaction.member.user.id}`,
    // get the user avatar of the user who triggered the interaction
    avatar: `${interaction.member.user.avatarURL()}`,
    // get the user role of the user who triggered the interaction
    role: `${interaction.member.roles.highest.name}`,
    // get the user role id of the user who triggered the interaction
    roleID: `${interaction.member.roles.highest.id}`,
    // get the user role name of the user who triggered the interaction
    roleName: `${interaction.member.roles.highest.name}`
    }
  }
  return obj;
} catch (error) {
  logError(error, "Error creating interaction object");
}
}
}


function checkForCurseWords(input) {
  // Regular expression pattern for matching curse words and variations
  const curseWordPattern = /d(?:a|e)mn|retard|hell|d(?:a|e)rn|frick|freaking|tit|gosh|heck|asshole|nuts|dick|vagina|fu(?:k|x|ck|uk|uck|uc|c)|pussy|sh(?:oo|i)t|ni(?:ga|ger|gga|gger|g)|ass|boob/i;

  // Check if the input string matches the curse word pattern
  return curseWordPattern.test(input);
}


/**
 * Returns a string of a bulleted list of every command found.
 *
 * @param {Object} client - The client object from which to get the commands.
 * @param {string[]} exclude - An array of command names to exclude from the list.
 *
 * @returns {string} A string of a bulleted list of commands.
 *
 * @throws {Error} If there is an error getting the commands.
 *
 * @example
 * getCommands(client, ['command1', 'command2']); // returns a string of a bulleted list of commands except 'command1' and 'command2'
 */
function getCommands(client, exclude = []) {
  try {
    // Get the commands array from the client object.
    const commands = client.commands;
    // Initialize a variable to store the string of the bulleted list.
    let listString = '';
    // Iterate through the commands array and for each command, append a string to listString that consists of a bullet point and the command name.
    commands.forEach(command => {
      if (!exclude.includes(command.data.name)) {
      listString += '\n- \`/' + `${command.data.name}` + '\`';
      }
    });
    // Return the listString variable.
    return listString;
  } catch (error) {
    // Log the error message and a descriptive message using the logError function.
    logError(error, "Error getting commands");
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
    getColor,
    logger,
    getInteractionObj,
    getCommands,
    getSuccessColor,
    getErrorColor,
    checkForCurseWords,
}