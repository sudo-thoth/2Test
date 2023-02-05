// IMPORTS ...
const { ButtonBuilder, ButtonStyle } = require("discord.js");
const scripts = require("../scripts/scripts.js");
const scripts_mongoDB = require("../scripts/scripts_mongoDB.js");

//   // Example Modal Object that gets passed in below
// let buttonObj = {
//     label: "🗜️ Compress File", { less than 45 characters }
//     style: "link", { primary, secondary, success, danger, link}
//     disabled: false, { true, false }
//     emoji: "🗜️"
//     link: "https://www.google.com",
//
// }
// // OR
// let buttonObj = {
//     customID: "compress", { less than 100 characters }
//     label: "🗜️ Compress File", { less than 45 characters }
//     style: "primary", { primary, secondary, success, danger, link}
//     disabled: true, { true, false }
//     emoji: "🗜️"
// }

/**
 * Creates a new row using the provided button object.
 * @param {Object} buttonObj - The button object containing the button properties.
 * @param {string} buttonObj.customID - The custom ID of the button.
 * @param {string} buttonObj.label - The label of the button.
 * @param {string} buttonObj.style - The style of the button.
 * @param {boolean} buttonObj.disabled - Indicates whether the button is disabled.
 * @param {string} buttonObj.emoji - The emoji of the button.
 * @param {string} buttonObj.link - The link of the button.
 */
async function createButton(buttonObj, randID) {
  // destructure the buttonObj
  const {
    customID,
    label,
    style = `primary`,
    disabled = false,
    emoji,
    link,
  } = buttonObj;

  let button = new ButtonBuilder();
  let lessCharsThan = (str, num) => {
    let arr = [];
    for (let i = 0; i < str.length; i++) {
      arr.push(str.charAt(i));
    }
    if (arr.length <= num) {
      return true;
    } else {
      return false;
    }
  };

  // make sure each property is defined with isDefined(), which returns true if the property is defined
  if (!scripts.isDefined(customID) && style !== "link") {
    try {
      throw new Error("customID is not defined");
    } catch (error) {
      scripts.logError(error, "customID is not defined in createButton()");
    }
  } else {
    // DO
    // check to make sure it is a string that is within the character limit for a customID
    // check to make sure custom id is less than or equal to 100 characters
    // if its not throw an error and log with logError()
    console.log(`the customID`, customID);

    if (!scripts.isDefined(customID)) {
      try {
        if (randID) {
          if (await scripts_mongoDB.getData(randID)) {
            if (!link) {
              try {
                throw new Error("customID is not defined");
              } catch (error) {
                scripts.logError(error, "customID is not defined");
              }
            } else {

              button.setURL(link);
            }
          } else {
            button.setURL(`https://google.com/`);
          }
        } else {

          try {
            throw new Error("customID is not defined");
          } catch (error) {
            scripts.logError(error, "customID is not defined");
          }
        }
      } catch (error) {
        scripts.logError(error, "err trying to get data in button create");
      }
    } else {
      if (!lessCharsThan(customID, 100)) {
        try {
          throw new Error("customID is too long");
        } catch (error) {
          scripts.logError(error, "customID is too long: MAX 100 characters");
        }
      }
    }

    if (style !== "link") {
      try {
        button.setCustomId(customID);
      } catch (error) {
        scripts.logError(error, "error w customID");
      }
    } else {

      button.setURL(link); 
    }
  }
  if (!scripts.isDefined(label)) {
    try {
      throw new Error("label is not defined");
    } catch (error) {
      scripts.logError(error, "label is not defined");
      // button.setLabel(" ");
    }
  } else {
    if (!lessCharsThan(label, 80)) {
      try {
        throw new Error("label is too long");
      } catch (error) {
        scripts.logError(error, "label is too long: MAX 45 characters");
      }
    }
    button.setLabel(label);
  }
  if (scripts.isDefined(style)) {
    // DO
    // check to make sure it is a string that is one of the TextInputStyle options
    if (
      style !== "primary" &&
      style !== "secondary" &&
      style !== "success" &&
      style !== "danger" &&
      style !== "link"
    ) {
      try {
        scripts.cLog(
          "style is not a valid Button Style\nAuto Assigning primary"
        );
        style = "primary";
      } catch (error) {
        scripts.logError(error, "style is not a valid Button Style");
      }
    }
    switch (style) {
      case "primary":
        button.setStyle(ButtonStyle.Primary);
        break;
      case "secondary":
        button.setStyle(ButtonStyle.Secondary);
        break;
      case "success":
        button.setStyle(ButtonStyle.Success);
        break;
      case "danger":
        button.setStyle(ButtonStyle.Danger);
        break;
      case "link":
        button.setStyle(ButtonStyle.Link);
        break;
      default:
        button.setStyle(ButtonStyle.Primary);
        break;
    }
    if (button.style === "link") {
      if (!scripts.isDefined(link)) {
        try {
          throw new Error("link is not defined");
        } catch (error) {
          scripts.logError(error, "link is not defined");
        }
      } else {
        button.setURL(link);
      }
    }
  } else {
    button.setStyle(ButtonStyle.Primary);
  }

  if (scripts.isDefined(disabled)) {
    if (typeof disabled !== "boolean") {
      try {
        scripts.cLog(
          "disabled is not a boolean\nAuto Assigning disabled to false"
        );
        disabled = false;
      } catch (error) {
        scripts.logError(error, "disabled is not a boolean");
      }
    }
    button.setDisabled(disabled);
  } else {
    button.setDisabled(false);
  }
  if (scripts.isDefined(emoji)) {
    if (typeof emoji !== "string") {
      try {
        scripts.cLog("emoji is not a string\nAuto Assigning emoji to null");
        emoji = null;
      } catch (error) {
        scripts.logError(error, "emoji is not a string");
      }
    }
    button.setEmoji(emoji);
  }
  console.log(`the button`, button);

  return button;
}

module.exports = { createButton };
