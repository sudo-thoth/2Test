// Before anything must install boxen package @ npm i boxen

const {boxen} = require("boxen");
const {logError} = require('./logError');
 
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

module.exports = function inBox(text, color = 'yellow'){
    
    try {
	return boxen(text, {
	        padding: 1,
	        margin: 1,
	        borderStyle: "round",
	        borderColor: color,
	        backgroundColor: "#555555" // gray
	    });
} catch (error) {
    logError(error, 'in the process of creating a box around a string to be logged to the console');
	return text;
	
}
}