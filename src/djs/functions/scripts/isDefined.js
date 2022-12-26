/**
 * Returns a boolean indicating whether the given variable is defined
 *
 * @param {any} variable - The variable to check
 * @return {boolean} - True if the variable is defined, false otherwise
 */
module.exports = function isDefined(variable) {
    if (variable === null) return false;
    return typeof variable !== 'undefined';
}