const { logError } = require('./logError.js');

/**
 * Returns a boolean indicating whether the given variable is defined
 *
 * @param {any} variable - The variable to check
 * @return {boolean} - True if the variable is defined, false otherwise
 */
module.exports = function isDefined(variable) {
    // add a check to make sure only one argument is passed in 
    if (arguments.length !== 1){ try {
	throw new Error('isDefined() only accepts one argument')
} catch (error) {
    logError(error, 'isDefined() only accepts one argument, more than one argument was passed in')
};
    }

    if (variable === null) return false;
    return typeof variable !== 'undefined';
}