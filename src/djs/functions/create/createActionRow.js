// IMPORTS ...
const {
    ActionRowBuilder,
  } = require("discord.js");
  const scripts = require('../scripts/scripts.js');
  
  //   // Example Action Row Object that gets passed in below
  //   let actionRowObj = {
  //     components: [
  //     button_A,
  //     button_B, ... up to 5 in order from top to bottom
  //     ]
  //   }
  // OR
  //  let actionRowObj = {
    //     components: [
    //     selectMenu_A
    //     ]
    //   }

  
  
  /**
   * Creates a new actionRow using the provided action row object.
   * @param {Object} actionRowObj.components - An array of components to be added to the actionRow.
   */
  async function createActionRow(actionRowObj) {
    // destructure the actionRowObj
    console.log(actionRowObj)
    
    const { components } = actionRowObj;
    // make sure each property is defined with isDefined(), which returns true if the property is defined
    if (!scripts.isDefined(components)) {
      scripts.logError(
        new Error("Components property is not defined"),
        `Error Creating Action Row`
      );
    }
    
    console.log(components)

    // make sure there are not more than 5  components in the actionRowObj
    if (components.length > 5) {
        scripts.logError(
            new Error("Components property length is greater than 5"),
            `Error Creating Action Row`
            );
    }

  
    let newCustomActionRow;
    // put try catch blocks around newCustomActionRow variable declaration and ActionRowBuilder() instantiation, use logError() to log the error
    try {
      newCustomActionRow = new ActionRowBuilder();
    } catch (error) {
      scripts.logError(error, `Error Creating Action Row`);
    }
  
    components.forEach((component) => {
        // put try catch blocks around a check to make sure the component is a button or selectMenu, if not, log an error and continue
        if (!component.type === "BUTTON" || !component.type === "SELECT_MENU") {
            scripts.logError(
                new Error("Component is not a button or selectMenu"),
                `Error Creating Action Row`
                );
        }

        if (component.type === "SELECT_MENU") {
            if (components.length > 1) {
                scripts.logError(
                    new Error("If Select Menu is present, Max Component Length is 1; Components property length is greater than 1"),
                    `Error Creating Action Row`
                    );
            }
        }

      // put try catch blocks around newCustomActionRow.addComponents() and createTextInputField() function calls, catch error and continue, but make the error message custom like "Error adding row "blank" to modal ${error.line}"
      try {
        newCustomActionRow.addComponents(component);
      } catch (error) {
        scripts.logError(error, `Error adding component ${component.customID} to the Action Row`);
      }
    });
  
    return newCustomActionRow;
  }
  
  
  module.exports = { createActionRow };
  
  