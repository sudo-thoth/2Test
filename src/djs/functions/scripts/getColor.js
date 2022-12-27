const { generateColors } = require('./generateColors');
const { getRand } = require('./getRand');
const { logError } = require('./logError');

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
    throw new Error('There are no more unique hex codes in the cache.');
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
    logError(error, 'Failed to get a random color');
  }
}

module.exports = getColor;