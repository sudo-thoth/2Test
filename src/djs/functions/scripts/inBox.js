// Before anything must install boxen package @ npm i boxen

const box = require('cli-box');
const { logError } = require('./logError');


const chalk = require('chalk');

const chalkBox = (text) => {
  const horizontalLine = '-'.repeat((text.length)/2);
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

function inBox(text, color = 'yellow'){
    try {
	return box(text,{
			borderStyle: 'round',
			borderColor: color,
			bgColor: '#555555', // gray
			padding: [1, 2],
			margin: [1, 2],
			// float: 'right',
		  });
} catch (error) {
    logError(error, 'in the process of creating a box around a string to be logged to the console');
	return text;
	
}
}
module.exports = chalkBox, inBox;