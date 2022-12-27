const { logError } = require('./logError');
// a helper function to generate a random hex code

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
module.exports = function generateHexCode() {
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
  };
