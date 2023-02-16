// IMPORTS ...
const {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
  } = require("discord.js");
  const scripts = require('../scripts/scripts.js');
  
  //   // Example Modal Object that gets passed in below
  //   let modalObj = {
  //     customID: "newCustomModal",
  //     title: "Create Your own CUSTOM Announcement",
  //     inputFields: [
  //     {
  //         customID: "title",
  //         label: "What is the title of the announcement?",
  //         style: "TextInputStyle.Short",
  //         placeholder: "Placeholder",
  //         required: true
  //     },
  //     {
  //         customID: "description",
  //         label: "What is the title of the announcement?",
  //         style: "TextInputStyle.Short",
  //         placeholder: "Placeholder",
  //         required: true
  //     }
  // ]
  //   }
  

//   let selectMenuObj = {
//     type: "role", - required - the type of select menu - {role, channel, }
//     customID: "selectMenu",
//     placeholder: "Select a role",
//     MinValues: 1, - optional - the min number of options that can be selected within this select menu
//     MaxValues: 2, - optional - the max number of options that can be selected within this select menu
//     options: [
//         {
//             label: "Role 1", - required - the label of the option - max 25 characters
//             value: "role1", - required - the value of the option - max 50 characters
//             description: "Role 1 description", - optional - the description of the option - max 100 characters
//             emoji: "👍",
//             default: true - optional - whether this option is selected by default
//         },
//         {
//             label: "Role 2",
//             value: "role2",
//             description: "Role 2 description",
//             emoji: "👎",
//             default: false
//         } ... up to 5 options
//     ]
//     }
    
  
  /**
   * Creates a new modal using the provided modal object.
   * @param {Object} modalObj - The modal object containing the modal properties.
   * @param {string} modalObj.customID - The custom ID of the modal.
   * @param {string} modalObj.title - The title of the modal.
   * @param {Array} modalObj.inputFields - An array of inputField action rows to be added to the modal.
   */
  async function createModal(modalObj) {
    // destructure the modalObj
    const { customID, title, inputFields } = modalObj;
    // make sure each property is defined with isDefined(), which returns true if the property is defined
    if (!scripts.isDefined(customID) || !scripts.isDefined(title) || !scripts.isDefined(inputFields)) {
      scripts.logError(
        new Error("One or more modal properties are not defined"),
        `Error creating modal`
      );
    }
  
    let newCustomModal;
    // put try catch blocks around newCustomModal variable declaration and ModalBuilder() instantiation, use logError() to log the error
    try {
      newCustomModal = new ModalBuilder().setCustomId(customID).setTitle(title);
    } catch (error) {
      scripts.logError(error, `Error creating modal`);
    }
  
    inputFields.forEach((field) => {
      // put try catch blocks around newCustomModal.addComponents() and createTextInputField() function calls, catch error and continue, but make the error message custom like "Error adding row "blank" to modal ${error.line}"
      try {
        newCustomModal.addComponents(createTextInputField(field));
      } catch (error) {
        scripts.logError(error, `Error adding field ${field.customID} to modal`);
      }
    });
  
    return newCustomModal;
  }
  
  /**
   * Creates a new row using the provided text input object.
   * @param {Object} textInputObj - The text input object containing the text input properties.
   * @param {string} textInputObj.customID - The custom ID of the text input.
   * @param {string} textInputObj.label - The label of the text input.
   * @param {string} textInputObj.style - The style of the text input.
   * @param {string} textInputObj.placeholder - The placeholder text of the text input.
   * @param {boolean} textInputObj.required - Indicates whether the text input is required.
   */
  const createTextInputField = (textInputObj) => {
    // destructure the textInputObj
    const {
      customID,
      label,
      style = `TextInputStyle.Short`,
      placeholder,
      required = false,
    } = textInputObj;
  
    let textInputField = new TextInputBuilder();
  
    // make sure each property is defined with isDefined(), which returns true if the property is defined
    if (!scripts.isDefined(customID)) {
      try {
        throw new Error("customID is not defined");
      } catch (error) {
        scripts.logError(error, "customID is not defined in createTextInputField()");
      }
    } else {
      // DO
      // check to make sure it is a string that is within the character limit for a customID
      // check to make sure custom id is less than or equal to 100 characters
      // if its not throw an error and log with logError()
      if (customID.length > 100) {
        try {
          throw new Error("customID is too long");
        } catch (error) {
          scripts.logError(error, "customID is too long: MAX 100 characters");
        }
      }
      try {
        textInputField.setCustomId(customID);
      } catch (error) {
        scripts.logError(error, "error w customID");
      }
    }
    if (!scripts.isDefined(label)) {
      try {
        throw new Error("label is not defined");
      } catch (error) {
        scripts.logError(error, "label is not defined");
      }
    } else {
      if (label.length > 45) {
        try {
          throw new Error("label is too long");
        } catch (error) {
          scripts.logError(error, "label is too long: MAX 45 characters");
        }
      }
      textInputField.setLabel(label);
    }
    if (scripts.isDefined(style)) {
      // DO
      // check to make sure it is a string that is one of the TextInputStyle options
      if (
        style !== "TextInputStyle.Short" &&
        style !== "TextInputStyle.Paragraph"
      ) {
        try {
          scripts.cLog(
            "style is not a valid TextInputStyle\nAuto Assigning TextInputStyle.Short"
          );
          style = "TextInputStyle.Short";
        } catch (error) {
          scripts.logError(error, "style is not a valid TextInputStyle");
        }
      }
      textInputField.setStyle(style);
    }
    if (scripts.isDefined(placeholder)) {
      if (placeholder.length > 100) {
        try {
          throw new Error("placeholder is too long");
        } catch (error) {
          scripts.logError(error, "placeholder is too long: MAX 100 characters");
        }
      }
      textInputField.setPlaceholder(placeholder);
    }
    if (scripts.isDefined(required)) {
      if (typeof required !== "boolean") {      try {
          scripts.cLog("required is not a boolean\nAuto Assigning required to false");
          required = false;
        } catch (error) {
          scripts.logError(error, "required is not a boolean");
        }
        textInputField.setRequired(required);
      }
    } else {
      textInputField.setRequired(false);
    }
  
    return new ActionRowBuilder().addComponents(textInputField);
  };
  
  module.exports = { createModal, createTextInputField };
  
  