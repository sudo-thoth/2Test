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


const fs = require("fs");
const chalk = require('chalk'); // npm i chalk@4.1.2
const execSync = require("child_process");
const box = require('cli-box');
const path = require("path");
const axios = require("axios-observable").Axios;


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

/**
 * Log the stacktrace and log data
 *
 * @param {string} stacktrace - The stacktrace data
 * @param {string} log - The log data
 *
 */
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
  let result = false;
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
  if (variable !== null && variable !== 'null' && variable !== undefined && variable !== `undefined` && variable !== "" && variable !== 0 && variable !== '0' && variable !== false && variable !== NaN && variable !== Infinity && variable !== -Infinity && variable !== [] && variable !== {}) result = true;
  return result;
}

/**
 * Verify if the module is defined
 *
 * @param {Object} module - The module to verify if is defined
 *
 * @returns {boolean} A boolean indicating if the module is defined
 */
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

/**
 * Create a text box with chalk
 *
 * @param {string} text - The text to put in the box
 *
 * @returns {string} A string of the text in a box, with horizontal lines made of the text length / 2
 *
 */
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


/**
 * Check if the input string matches the curse word pattern
 *
 * @param {string} input - The input string to check for curse words
 *
 * @returns {boolean} A boolean value indicating whether the input string matches the curse word pattern.
 *
 */
function checkForCurseWords(input) {
  // Regular expression pattern for matching curse words and variations
  const curseWordPattern = /d(?:a|e)mn|retard|hell|d(?:a|e)rn|frick|freaking|tit|gosh|heck|asshole|nuts|dick|vagina|fu(?:k|x|ck|uk|uck|uc|c)|pussy|sh(?:oo|i)t|ni(?:ga|ger|gga|gger|g)|ass|boob/i;

  // Check if the input string matches the curse word pattern
  return curseWordPattern.test(input);
}



function compareLists(listA, listB) {
  let songsInA = listA.split('- ');
  let songsInB = listB.split('- ');
  let songsInAButNotB = [];
  let songsInBButNotA = [];

  songsInA.forEach(song => {
    if (!songsInB.includes(song)) {
      songsInAButNotB.push(song);
    }
  });

  songsInB.forEach(song => {
    if (!songsInA.includes(song)) {
      songsInBButNotA.push(song);
    }
  });

  console.log(`Songs in A but not B: ${songsInAButNotB.join(', ')}`);
  console.log(`Songs in B but not A: ${songsInBButNotA.join(', ')}`);
}

/**
 * A function that creates a folder for each song in the array and then sub folders for each song
 * This function takes in an array of strings and a destination string as parameters and creates a new folder
 * for each string in the array in the destination folder.
 *
 * @param {Array<string>} stringArr - An array of strings
 * @param {string} destination - The destination string
 *
 * @returns {void}
 */
function createFolders(stringArr, destination) {
  for (let i = 0; i < stringArr.length; i++) {
    console.log(`string array length: ${stringArr.length}`)
    console.log(`Current Folder Being Created: ${stringArr[i]}`)
    console.log(`new folder path: ${destination + '/' + stringArr[i]}`)
    let folderName = stringArr[i];
    let newFolderPath = destination + '/' + folderName;
    let subFolders = ['Song', 'Art', 'Instrumental', 'Accapella', 'Studio Files', 'Og File', 'Session Mix', 'Snippet_Vid', 'Snippet_Mp3', 'Remaster'];
    // Check if the newFolderPath already exists
    if (fs.existsSync(newFolderPath)) {
      for (let j = 0; j < subFolders.length; j++) {
        let subPath = newFolderPath + '/' + subFolders[j];
        fs.stat(subPath, (err, stat) => {
          if (err) {
             fs.mkdirSync(newFolderPath + '/' + subFolders[j]);
          } else {
            // Do Nothing
            
            
            // if (stat.isDirectory()) {
            //   // is an existing folder
            //   // skip and do nothing
            // } else {
            //   fs.mkdirSync(newFolderPath + '/' + subFolders[j]);
            // }
          }
        });
      }
    } else {
      fs.mkdirSync(newFolderPath);
      for (let j = 0; j < subFolders.length; j++) {
        let subPath = newFolderPath + '/' + subFolders[j];
        fs.stat(subPath, (err, stat) => {
          if (err) {
            fs.mkdirSync(newFolderPath + '/' + subFolders[j]);
          } else {
            // Do Nothing
            
            
            // if (stat.isDirectory()) {
            //   // is an existing folder
            //   // skip and do nothing
            // } else {
            //   fs.mkdirSync(newFolderPath + '/' + subFolders[j]);
            // }
          }
        });
      }
      
    }
  }
 
  // for (let i = 0; i < stringArr.length; i++) {
  //   let folderName = stringArr[i];
  //   let newFolderPath = destination + '/' + folderName;
  //   // Check if the newFolderPath already exists
  //   if (fs.existsSync(newFolderPath)) {
  //     for (let j = 0; j < subFolders.length; j++) {
  //       let subPath = newFolderPath + '/' + subFolders[j];
  //       fs.stat(subPath, (err, stat) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           if (stat.isDirectory()) {
  //             // is an existing folder
  //             // skip and do nothing
  //           } else {
  //             fs.mkdirSync(newFolderPath + '/' + subFolders[j]);
  //           }
  //         }
  //       });
  //     }
  //   } else {
  //     fs.mkdirSync(newFolderPath);
  //     for (let j = 0; j < subFolders.length; j++) {
  //       let subPath = newFolderPath + '/' + subFolders[j];
  //       fs.stat(subPath, (err, stat) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           if (stat.isDirectory()) {
  //             // is an existing folder
  //             // skip and do nothing
  //           } else {
  //             fs.mkdirSync(newFolderPath + '/' + subFolders[j]);
  //           }
  //         }
  //       });
  //     }
  //   }
  // }
  console.log('Folders created');
}



let songs = [
  '100 band jugg | hunnid band jugg | hundred band jugg | 100 band jug | hunnid band jug | hundred band jug | im ballin hard', '1400 999 freestyle | fourteen hundred nine nine nine freestyle | 1400 999 | 1400 999 | matt hardy | matt hardy v1 | matt hardy freestyle', '150 | mask on my face | one fifty', '2019 my year | twenty nineteen my year', '2020 vision | twenty twenty vision', '21 minute freestyle | 21 min freestyle | twenty one minute freestyle | juice wrld insane 21 minute freestyle | insane 21 minute freestyle | no jumper freestyle', '24 hours | twenty four hours', '27 club | twenty seven club | show me love | help me', '2mins in hell | 2 minutes in hell | two mins in hell | two minutes in hell', '30 hours | 30 hours freestyle | thirty hours | thirty hours freestyle | 30 hrs freestyle', '38 special | .38 special | go go | thirty eight special | 38', '400 am | 4am | 400am | 4 | four am | crack addict | give me my fix', '500 am | 5am | 500am | 5 | five am | im cool | im kool | 5am outro | 5am outro (im cool) | 5am (im kool)', '6 | six | 911 | overdose for clout | nosebleeds | overdose |', '67 | sixty seven | martian | sergeant', '70s | seventies | seventys | the 70s | the seventies | the seventys', '734 | seven three four | seven hundred thirty four | think too much | g fazos', '7am freestyle | 700 am freestyle | seven am freestyle', '8 min freestyle | feel real | 8 minute freestyle | eight minute freestyle | eight min freestyle | eight minute freestyle (v1)', '808 freestyle | split my brains | eight o eight freestyle | eight zero eight freestyle | wait 4 me | wait for me | wait 4 me (v1.1) | spilt my brains', '9 minute freestyle | 9 min freestyle | nine min freestyle | forever | forever pt 2 | forever part 2 | forever part 2 with jbucks', '90210 | speed demon | heat up', 'abyss | real right | club life | dy 1 | my abyss', 'abyss | the party never ends | no bystanders og | no bystanders | no bystanders v2 | TPNE', 'abyss interlude | abyss | Abyss Interlude (v1.1) | Ups and Downs | ups & downs', 'act right', 'addicted | love and drugs', 'adore you | dark knight | seen a soul like yours | hold u | adore u | hold you', 'agree to disagree', 'aint livin right | aint living right', 'aint talkin toronto', 'airport security', 'all alone | on my own | fighting | all on my own', 'all burnt up', 'all girls are the same | same', 'all night', 'all of me | what to think | dolce', 'all out', 'all smoke', 'all talk | bankroll', 'all the same', 'already', 'already dead | relapse', 'alright | buried alive', 'always workin', 'analog', 'and go | come & go | ruin this one | off my chest | come and go | & go', 'animal | obsessed | but how', 'another one | dj khaled', 'another thing to do it | attdi | do it', 'another way', 'anxiety', 'any other way', 'anything but normal', 'aquafina | in the cut', 'armed and dangerous | armed & dangerous', 'army armory', 'astray', 'astronauts', 'attachments | i fell in love with the attachments | versace', 'autograph | on my line | twitter beef', 'aye aye', 'aye ayee | ayee | god damn', 'back home', 'back in chicago | first class | broke ass', 'back on it', 'bad boy | the bad boys', 'bad energy | bad memories', 'baguettes | chanel vintage | peanut butter seats', 'ball | larry bird', 'bandit | molly savage | stole her | bad bitch bandit', 'bank account', 'barbarian | vandal', 'battle scars', 'been a while | last time', 'been myself', 'been through this | thousand times | a thousand times | 1000 times | ive been thought this a 1000 times', 'before tomorrow', 'bel air', 'best around | racks out', 'best believe', 'best of em | western', 'betray my trust | betrayal', 'better off alone', 'big', 'big dog', 'big swag', 'billy idol | mary jane', 'birds eye view | girl i knew', 'biscotti in the air | real ones | putting biscotti in the air', 'bitch youre done | youre done | ur done | bitch ur done', 'bitter asff | bitter asf', 'bitty | bity', 'black & white | black and white | friends', 'blastoff | blast off', 'blink 182', 'blood on my jeans | on the run', 'bloody blade | carved in my brain', 'blowing up', 'blue cash', 'blue shit | gentleman', 'body bag | catch a body', 'bonnie & clyde | bonnie and clyde', 'boomerang | livin life', 'boondocks | broke to rich', 'boss of me', 'bottle', 'bout that', 'boy wit da bandz | goin crazy', 'buck 50', 'bullet for my valentine', 'burn | in the fire', 'bury me alive | did it again | lullabies | i did it again | used to', 'busch', 'bussin', 'bustin | savages', 'bye bye | out your mind', 'ca$h out | cash out | black out', 'cake | molly water | sacrifices | off this earth | purge | flavor', 'cali girl | cali | where are you | cali girl where are you | cali girl... where are you<3', 'californication | relocate', 'candles', 'cant be saved | dylan | delorean', 'cant feel my face | safe | safe og', 'cant go', 'cant help it | emotional overdose', 'cant keep up | cash up', 'cant leave you alone | marroon 5', 'cant let go | special', 'cant survive', 'carry it | gun', 'cavalier | kung fu', 'cerebral | obsessed', 'cha ching | spend it', 'change you down | chase you down', 'cheat code | no reload', 'chicago to la | couple ms', 'chimp | pimp', 'choppa', 'chosen one', 'chrome | cardi b choppa', 'cigarettes', 'classic trap', 'classroom', 'clean heart | heart clean', 'club wit a k', 'cocaine', 'codeine casket', 'codeine cobain', 'codeine guzzler', 'codependent | not that easy', 'come around', 'coming over | heartbreak music', 'come on wit it | heat seekers | come on with it', 'common sense | i love you', 'complications', 'condone it', 'confessions | rough', 'confide | help me hide', 'confide to', 'confused', 'conjuring | wont die', 'connection', 'contained | change | leave me dead', 'conversations | devil conversations', 'cooking orders | gun in the bag', 'coraline | call me coraline', 'coupe | crew | yo bishh', 'cowboy hunt', 'crossing the line | clean', 'cruising', 'cursed | lotti blu ray', 'cursed heart | dont play', 'dagger | facetime', 'daily', 'damn right | what i wanna do', 'danny phantom', 'dark arts | lock on | barry bonds', 'dark place', 'dark thoughts | on your mind', 'dark tints | double rs', 'day one', 'death penalty | dark queen', 'death race | death race for love | drfl', 'deep in', 'demise', 'demo wreck', 'demon love', 'demons and angels og | hang with us | demons and angels | demons & angels', 'denial | denial <3 demo | denial demo', 'deprived', 'desire', 'devil horns', 'die to live', 'die to me', 'different | different story', 'different phases | matrix | this cant be happening | this cant be happening <3 og', 'diors', 'dirty soda | do the most | no coaster | coca cola | the coast', 'dj khalid', 'do re mi | man down', 'do you know the way v1 | do you know the way | the way | do you know the wae | the wae', 'do you know the way v2 | do you know the way | the way | do you know the wae | the wae', 'dome | juck', 'dont care', 'dont go | widow', 'dont got time', 'dont know what im on | dont know what i know', 'dont talk to me', 'doom', 'door | meet me at the door | uh', 'draco on me | backwoods', 'dream$ | dreams', 'drive me crazy', 'drivin so fast | so fast', 'drown', 'drugs are my friends | sick | sick of my friends', 'drugz', 'drunk and honest ducks', 'ducks', 'dumb slut', 'dummy', 'dyslexic | hectic', 'electric chair | insecurities', 'elevate', 'empty', 'end of the road', 'everlasting | let it bust', 'everlasting love', 'evil twins', 'eye contact | look me in the eyes', 'eyes up', 'facetious | for the weekend', 'faded | oh no', 'fall back', 'fall through', 'falling down', 'fast | last call', 'fast forward | passport', 'feel alone | stuck in my mind', 'feeling', 'feeling myself | psychedelics', 'feline', 'fever | nerves', 'fine china', 'finessin hoes | for your life | on the daily', 'fire', 'fire in my lungs', 'fireflies | fire flies | must be nice', 'first time', 'flavor', 'flaws | ray charles', 'flaws and sins', 'fleur de lis | mr freeze | mr.freeze | fur elise | für elise', 'flex', 'flintstones | wartime', 'floor it', 'foo foo | amusing', 'for the taking', 'forever | left you', 'forever love', 'forget me not | dont forget me | smile to go', 'four words | fuck you pay me | fypm', 'franky on me', 'freaked it | air em out', 'freestyle | freestyle 2 | iceberg avalanche | buckle my shoe | juice x chance freestyle | nothin but a g thang | reach', 'friends die | fuck about your feelings', 'from afar', 'from my window | world from my window | wrld from my window | 3 xans | window | xo | wrld my window', 'from the bottom', 'from the start', 'fuck it | how dat go', 'fuck it up', 'Fuck What You Sayin | Sayin', 'fuck you mean | fym', 'gamble | off the rip | rich', 'game', 'gave her all of me', 'get geeked', 'get over | heart of mine', 'get through it | get through it interlude | interlude | if anybody', 'girl of my dreams', 'girl with the blonde hair | artic tundra', 'girlfriend | your loss | try again', 'globetrotter | money', 'glock handler', 'go | paid | go go go', 'go hard | go hard 1.0 | out the rut', 'go hard 2.0 v1 | go hard 2.0 | out the rut', 'go hard 2.0 v2 | go hard 2.0 | out the rut', 'go home', 'godzilla', 'goin crazy', 'golden x get away | golden x getaway interlude | golden getaway | interlude', 'gone', 'good day', 'good days | yeah yeah yeah', 'good time | good times | all life long', 'goosebumps 2k17 | 2k17 goosebumps | goosebumps remix', 'gopro', 'got nothing on me | your boyfriend', 'goyard bag | brand new', 'grace', 'graduation', 'grateful v1 | grateful', 'grateful v2 | grateful', 'gta | grand theft auto', 'gucci purse | kyrie irving', 'gun you down | 2 percs', 'haha | im too high', 'hairline trigger | maybe', 'hard at life | move the bale', 'hard to digest | mr miyagi | mr.miyagi', 'hard work pays off | hard work', 'hate her friends | i hate her friends | trip to france', 'hate me', 'hear me calling', 'heart exposure | mood', 'heavy | heavy hook only | hook only', 'hell', 'hell girl | choppa', 'hemotions | muddy emotions', 'hennessy | henny', 'her friend', 'here we go again', 'heroin music | pills in the regal | party by myself | pills and the reefer', 'hey mister', 'hey wonderland', 'hi tech talk | kill tech top | hi tech top | kill tech talk', 'hide', 'high all week | open shop', 'high tide | surfin', 'his to keep', 'hit | issues', 'hit a lick', 'hold me down', 'hold my hand', 'hollywood dreams | hollywood dreams come true | hollywood dreams come true 999', 'homocide', 'honest | hook', 'honestly', 'hope i did it', 'horrible | lean wit it', 'hot ham | hot ham remix | 2 many', 'hunnid', 'hurt me | sticks and stones | sticks & stones', 'hypnotic | keep it together | hypnotic og | long day', 'i do this | for you', 'i dont know', 'i dont need it', 'I dont want to lose you | I dont want to lose you freestyle | freestyle | lose you', 'i know one thing | i know one thing <3', 'i love it | luv', 'i need you | out of luck | not enough', 'i swear', 'i wanna', 'i will follow | try this', 'i wonder whats wrong | i wonder | demons in my mind | scheming', 'idgaf | i dont give a fuck', 'ill be fine', 'im still', 'im the shit | imda$$ixx', 'impatient | keycard', 'in a minute v1 | antisocial v1 | in a minute | antisocial', 'in a minute v2 | antisocial v2 | in a minute | antisocial', 'in a minute v3 | antisocial v3 | in a minute | antisocial', 'in a minute v4 | antisocial v4 | in a minute | antisocial', 'in a mix', 'in my arm | bad news', 'in my bag | bruce wayne', 'in my head', 'in my heart', 'in the cut', 'in the moment | she on the go', 'in the summer | gave her all of me v2 | another place', 'in the trap', 'in this bitch | v2 | v3', 'infatuated', 'infrared', 'inner peace | traveling | travelling', 'iron on me | challenger', 'irony', 'issues | hit', 'it wont hurt', 'jack & jill | jack and jill | cheat code', 'jack wit a bean | for the team | jack with a bean', 'jeffery', 'jet lag v1 | jet lag | jetlag', 'jet lag v4 | jet lag | jetlag', 'jet lag v2 | jet lag | jetlag', 'jordan | woah pt 2 | woah | woah pt.2', 'juice never had to flex', 'juicy', 'junkie | dont care', 'just letting you know', 'k like a russian', 'karate kid', 'kawasaki', 'keep it', 'keep up | speed me up | v2 | v3', 'kickflip', 'kiki | king kong', 'kill benjamin | money war', 'killing my vibe v1 | ignorant v1 | killing my vibe | ignorant | bigger and better | bigger & better', 'killing my vibe v2 | ignorant v2 | killing my vibe | ignorant | bigger and better | bigger & better', 'killing myself', 'kirbys selecta', 'kkk | aint coming back', 'know us', 'knuck if you buck', 'ktm drip | dont fall off | let em in', 'lair | codeine music', 'last call | fast v2', 'late night | amazing', 'late night thoughts', 'lauryn hill v1 | wishing well v1 | lauryn hill |  wishing well og | wishing well', 'lauryn hill v2 | wishing well v2 | lauryn hill | wishing well', 'lauryn hill v3 | wishing well v3 | lauryn hill | wishing well', 'lava girl | stick talk | lavagirl', 'lavender town | tweekin | tweakin', 'lavish', 'lean wit me | live', 'leave me alone | void', 'left 4 dead | zombie shit | beam on my 9 | beam on my .9 | beam on my nine | left for dead', 'legends', 'let em know', 'let go | hit the road', 'let her leave', 'let it go v1 | fenty v1 | dont tempt me | fenty freestyle | let it go | fenty', 'let it go v3 | fenty v3 | on the regular | dont tempt me | fenty freestyle | let it go | fenty', 'on the regular | fenty v2 | let it go v2 | fenty freestyle | let it go | fenty', 'let me know | i wonder why freestyle', 'let you know | on the low | what I need', 'lets get it', 'lets go', 'life chase', 'lifes a dungeon | chase the dragon', 'lifes a mess | lifes a mess 2 | lifes a mess ii | v1 | v2 | v3', 'like a pro | no promo', 'live forever', 'living at the top | simple', 'lock box', 'london interlude | roaming | london', 'london tipton', 'lone ranger | let me be', 'long gone', 'long gone pt 2', 'long time coming', 'loose screw | prolly', 'lose a dream', 'lose me', 'lost cause', 'lost her', 'lost love', 'lost my mind freestyle | lost my mind | freestyle', 'lost too many | i lost too many | goblin', 'lotti lotti | new girl | lurkin', 'love and leave them | love & leave them | love and leave em', 'love no hoe', 'love over there', 'love story | our love story | i need it', 'love you always | starfire | being in love', 'lovers lane | miles and miles', 'lucid dreams | forget me | remember me | lucid dreams live | live | lucid dreams remix', 'made it work | under 25', 'make believe', 'make it back | make it back v1 | v1', 'make it sell', 'make it there', 'mama said', 'man down | rockstar boy | moment', 'man man', 'man of the year | breakthrough | v1 |v2', 'mannequin challenge', 'mansion | here i go again', 'masterpiece', 'matt hardy | matty hardy 999 | 1400999 freestyle | 1400999 freestyle pt. 2 | 1400999 freestyle pt 2 | encore', 'maze', 'mclaren drive | tic tac toe | i dont care', 'me', 'me & u | me and u | me and you | me & you', 'meadows | rose petals', 'megan good | never ever good | megan good v2 | v1 | v2 | v8', 'melody', 'mental overload', 'midnight | titanic', 'migos', 'mind control | eye contact', 'mind games', 'minus | lette | minus v2 | minus v3 | v1 | v2 | v3', 'misery avenue v1 | back to me | this is me | misery avenue v2 | misery avenue v4 | misery avenue | v1 |v2 | v4', 'misunderstood | misunderstud', 'mmmmm | mmm | mm', 'molly and mike | molly & mike | molly n mike', 'moncler year | dirt bike', 'money hunt | double dutch', 'moonlight', 'morning again | in the morning again', 'morphine', 'moshpit', 'mothership', 'motions | motion', 'move on | help me', 'moves | moves <3', 'mr heart break | mr.heartbreak | v1 | v2', 'murder rate | keep save', 'my bad', 'my fault | my fault <3 | all my fault', 'my gang | together', 'my life in a nutshell | milan | pain heal', 'my phone', 'my spot | hunt you down', 'my way home | over sprung | oversprung | we just begun', 'my way home pt 2 | used and abused | my way home part 2 | my way home pt. 2 | left for dead | left 4 dead', 'my x was poison | my x was poison 9 9 9 | x-poison', 'my year', 'my zone', 'narcotics | blues', 'naruto', 'nascar | forget it', 'nesquick | hoover', 'never cared | young god', 'never scared', 'new finesse', 'nightmare', 'nintendo', 'no benefits', 'no breaks | cold summer | breaks over', 'no chance', 'no depot | cheat code | nemo', 'no good', 'no hook', 'no hook freestyle', 'no issue | space cadets', 'no jumper', 'no laces', 'no limit no hook | juice man | no limit', 'no love no trust | trust no one', 'no me ame | dont love me | no me ame v2 | v1 | v2', 'no more', 'no reason | what have i done', 'no russian | relocate | v1', 'no shame | fall in love', 'no short cuts', 'no time | toro', 'no trespassing', 'no vanity | lost my vanity', 'no wrong | poison in the air', 'nobody', 'not sorry', 'not that safe | stem', 'nuketown', 'numb the pain', 'nuts itch | automatic', 'oceans | waves', 'off the rip | gamble', 'oh dear | nlmb oh dear | nlmb', 'oh my oh my', 'oj glove | aj glove', 'ok | leave me alone', 'okay | okay! | okay!!', 'old me | old me <3', 'omen | overseer | blood sweat tears', 'on a plane', 'on and on | v2', 'on god', 'on my mind', 'on the rise | count my dough', 'on the road | let it off | reload', 'on the run | blood on my jeans', 'on time | righteous pt. 2 | righteous | righteous part 2 | righteous part two | righeous pt. two', 'on tour | you dont know me | bonjour', 'only for u | only for you', 'only you on my mind', 'oreo | v1 | v2', 'orlando', 'osama | catch up', 'out my body', 'out my way', 'out the dust | rhyme poet', 'out the projects', 'outta pocket', 'over n over | over & over | over and over', 'oxy | v1', 'oxy in the dark', 'pain heal | my life in a nutshell', 'paranoid', 'pause', 'peace of mind', 'perc floating | coffins', 'percaholic | boss of me', 'percs', 'personification | it aint so', 'peru', 'pesos', 'pieces', 'play fair', 'play your role', 'playing games | im not playing fair', 'plug | lucid dreams pt. 2 | lucid dreams | lucid dreams part 2 | lucid dreams part two | lucid dreams pt. two', 'pop it', 'pop rock | pop tart', 'pop-punkstar | pop punkstar | v1 | v2', 'porridge', 'potions | hell', 'pressure me | dont play', 'pretty boy', 'priceless | wraith', 'prime', 'prime time | primetime', 'ptsd', 'pump | fight', 'purple devil', 'purple moncler', 'purple substance | substance | double up', 'put me down', 'python', 'quitter | no good woman', 'race beginning', 'racks in', 'radio', 'rain dance | v1 | v2 | v3', 'rainbow | taste the rainbow', 'ran off', 'range', 'ransom | ransom remix | v1', 'rarris rovers', 'ration | until the plug comes back around', 'reach freestyle', 'real shit', 'realer n realer | real n realer | realer and realer | real and realer | realer & realer | real & realer | v1', 'realize', 'rebel blood', 'red bently | gigalo', 'red dead redemption', 'red moonlight', 'relapse', 'remind me of the summer | addicitons', 'reminds me of you | v1', 'rental | cha ching | k', 'rich and blind | rich & blind', 'rich and dangerous | feel like a god', 'rich forever | jetta', 'rich nigga shit | rich nia shit | rich nigga | rich nia', 'rider', 'right now', 'right or wrong', 'righteous | righteous demo', 'rikers', 'ring ring | simmer down | royer | v1', 'road runners', 'robbery | robbery remix | robbery demo', 'rock', 'rockstar girl | rock star girl', 'rockstar in his prime | deal wit this hurt | deal with this hurt | demo', 'rockstar lifestyle', 'rockstar status', 'rodents', 'roses', 'rotate | drag race', 'round', 'run', 'run a fade', 'run away', 'run that shit', 'runaway | chills | fighting demons', 'runaway freestyle | runaway remix | runaway', 'rush', 'rush sad rockstar | sad rockstar | chop a brick', 'safe', 'same clothes', 'scared of love', 'scarface | london', 'scissors', 'screw juice | infinity', 'semi addict | static shock', 'set me free | im not where i need to be | v1 | v2', 'sexual healing', 'shadows | sorrows', 'shes the one | shes the 1', 'shit talk | so hard', 'shoot for love | shoot for you | v2', 'shoot me love', 'shorty', 'shot em down', 'sick em', 'singalong | wrong lyrics right song', 'skyline | freestyle | skyline freestyle', 'slasher', 'sleep paralysis', 'slenderman', 'slick rick freestyle | slick rick freestyle 999 | slick rick | freestyle', 'slide | slide remix', 'slowly', 'smile | sad | demo | v1', 'smoke', 'so fake', 'so low | blind fold', 'so what | too in love', 'soda pop | apparent | v1 | v2', 'some more', 'someone new | $omething new', 'something to prove', 'sometimes v1 | sometimes | hate the world | sometime', 'sometimes v2 | sometimes | hate the world | sometime', 'sour | midnight hours', 'spanglish', 'stabbed you | had to |', 'starfire interlude | tears', 'stargazing | not an option', 'starstruck | sadness | v1 | v2 | v3 | v4', 'status | rockstar status v2', 'stay high | v1', 'sticks | lit | ya dig', 'stomp em out', 'stop talking | stick talk', 'stranger', 'stuck in my ways', 'stumblin | back and forth | back & forth', 'submission', 'substance | regardless | freestyle interlude', 'sugarfish', 'suicidal | be mine | sucidal remix | remix | v1 | v2', 'sun | all in | gums', 'sun goes down | lost cause', 'survive', 'swear', 'swisher | hilfiger', 'syphilis', 'tag', 'take my soul | soul taker | fighting off my demons', 'take off | green light', 'takeover | no breaks | breaks over', 'tales of the toxic', 'talking to voices', 'taskforce', 'tattoos and ink | long live the hustle | reminds me of your love', 'telepathy | telepathy freestyle | freestyle | telepathy pt 2 | telepathy pt. 2', 'tell me u luv me | tell me you lve me | demo', 'tell your friends', 'tempted | ten speed | 10 speed', 'that sad shit', 'thats a 50 | thats a fifty | v1 |v2', 'the bees knees', 'the light', 'the old me', 'the race', 'they all talk | make the news | catch up', 'this cant be happening | this cant be happening to me | this cant be happening to me <3 | this cant be happening to me... no way <3', 'thoughts', 'thrills', 'through emotions | glowed up', 'through my head', 'tick tock', 'tick tock | in the air', 'time anymore | in zone', 'time stops | cant die | i cant die | nipsey hustle tribute', 'to the grave | feelings', 'told her | cursed | cursed pt 2 | v2', 'tonight', 'too far', 'too many | way too many', 'too much cash | tmc', 'too smooth', 'toxic humans', 'track race | scarface', 'transformer', 'trap phone | i know what you want', 'trap phone bling | hotline bling | hot line bling remix | remix', 'trees | love dont grow on trees', 'tribe', 'trick or treat | halloween', 'trifling', 'triple 9 | sipping 999 | 999', 'troubled kids | pesos', 'trust issues', 'try me', 'turkey burgers | turkey burger', 'tweakin', 'twins | luigi', 'two cups (everythings going my way) | two cups | everythings going my way | two cups everythings going my way', 'u cant tell me', 'uh huh', 'uncertain shadows | further', 'under her skin', 'underworld | underwrld', 'unexplainable | look again | v2', 'until i die | party in my mind', 'until its over (closure) | until its over closer | until its over | closure', 'until the plug comes back around | ration | plug | demo', 'untitled', 'untitled hook only | hook only', 'up up and away | up and away | demo', 'ups and downs', 'used to', 'victorious | up', 'vlone thugs', 'waiting for the drugs to hit me', 'wandered to la | hotel | v1 | v2', 'want to | ronald', 'wasted | wasted remix | remix', 'watch me', 'watch your tone | bad to the bone', 'water | i want it', 'wavy', 'we aint goin', 'we dont get along', 'wedding ring | i need everything', 'what being rich feels like | wbrfl | v1 | v2', 'what else', 'whatever i like | 4l', 'whats brakkin | whats brakin | whats brakking', 'where i stay | my side | my side remix', 'whimpers in the dark', 'whip | alaska', 'whip | show n tell | show and tell', 'whistles | woke up rich | whistles og | og', 'who r u | who are you | who are u | who r you', 'who shot cupid? | who shot cupid', 'willing to die | dismissed', 'withdrawals | high again | pyschedelics og | pychedelics | drought', 'without me | v1 | v2', 'woah', 'wont let go', 'work', 'work out | come to me', 'worth it | common sense', 'wrld on drugs | demo', 'wrong time | surf', 'xmas list | x-mas list | christmas list', 'yacht club', 'yeah yeah yeahh', 'you', 'you aint safe', 'you and i | you & i', 'you dont know me | codependent v2', 'you freestyle | best i ever had remix | best i ever had | freestyle | remix', 'you wouldnt understand | outrage | demo', 'youdontloveme | too drunk | you dont love me', 'your man | france | shopping in france', 'youre my everything | left', 'z nation', 'zero toleration | flossing | flossin', 'zoom', 'scars | drug life', 'codeiner | uh woah'
];


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
    getSuccessColor,
    getErrorColor,
    checkForCurseWords,
    createFolders,
    songs

}