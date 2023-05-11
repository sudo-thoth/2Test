// IMPORTS ...
const { ButtonBuilder, ButtonStyle } = require("discord.js");
const scripts = require("../scripts/scripts.js");
const scripts_mongoDB = require("../scripts/scripts_mongoDB.js");

/**
 * Creates a new row using the provided button object.
 * @param {Object} buttonObj - The button object containing the button properties.
 * @param {string} buttonObj.customID - The custom ID of the button.
 * @param {string} buttonObj.label - The label of the button.
 * @param {string} buttonObj.style - The style of the button.
 * @param {boolean} buttonObj.disabled - Indicates whether the button is disabled.
 * @param {string} buttonObj.emoji - The emoji of the button.
 * @param {string} buttonObj.link - The link of the button.
 * @param {string} buttonObj.url - The url of the button (alternative to link property).
 */
async function createButton(buttonObj, randID) {
  // destructure the buttonObj
  const {
    customID,
    label,
    style = "primary",
    disabled = false,
    emoji,
    link,
    url,
  } = buttonObj;

  let button = new ButtonBuilder();

  if (!scripts.isDefined(customID) && style !== "link") {
    scripts.logError(new Error("customID is not defined"), "customID is not defined in createButton()");
  } else {
    if (style !== "link") {
      if (scripts.isDefined(customID) && customID.length <= 100) {
        button.setCustomId(customID);
      } else {
        scripts.logError(new Error("customID is too long"), "customID is too long: MAX 100 characters");
      }
    } else if (link) {
      button.setURL(link);
    } else if (url) {
      button.setURL(url);
    }
  }

  if (scripts.isDefined(label)) {
    if (label.length <= 80) {
      button.setLabel(label);
    } else {
      scripts.logError(new Error("label is too long"), "label is too long: MAX 80 characters");
    }
  }

  const styleMap = {
    primary: ButtonStyle.Primary,
    secondary: ButtonStyle.Secondary,
    success: ButtonStyle.Success,
    danger: ButtonStyle.Danger,
    link: ButtonStyle.Link,
    "1": ButtonStyle.Primary,
    "2": ButtonStyle.Secondary,
    "3": ButtonStyle.Success,
    "4": ButtonStyle.Danger,
    "5": ButtonStyle.Link,
  };
  
  if (scripts.isDefined(style)) {
    let buttonStyle = styleMap[style.toString().toLowerCase()];
  
    if (buttonStyle) {
      button.setStyle(buttonStyle);
    } else {
      scripts.logError(new Error("style is not valid"), "style is not valid");
      button.setStyle(ButtonStyle.Primary);
    }
  } else {
    button.setStyle(ButtonStyle.Primary);
  }
  

  if (button?.data?.style === ButtonStyle.Link && (scripts.isDefined(link) || scripts.isDefined(url))) {
    button.setURL(link || url);
  }

  if (scripts.isDefined(disabled)) {
    if (typeof disabled === "boolean") {
      button.setDisabled(disabled);
    } else {
      scripts.logError(new Error("disabled is not a boolean"), "disabled is not a boolean");
      button.setDisabled(false);
    }
  } else {
    button.setDisabled(false);
  }

  if (scripts.isDefined(emoji)) {
    if (typeof emoji === "string") {
      button.setEmoji(emoji);
    } else {
      scripts.logError(new Error("emoji is not a string"), "emoji is not a string");
    }
  }

  return button;
}

module.exports = { createButton };