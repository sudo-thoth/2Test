const {logError} = require("./logError.js");
const {generateHexCode} = require("./generateHexCode.js");
const { cLog } = require("./cLog.js");


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


module.exports = function generateColors(num = 1) {
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
};
