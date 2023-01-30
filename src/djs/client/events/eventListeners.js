const client = require(`../../index.js`)
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require(`../../functions/scripts/scripts_djs.js`);

// const index = require(`src/djs/index.js`)
// const client = index.getClient();
// console.log(client);
if (client) {
  client.on("interactionCreate", async (interaction) => {
    const interactionObj = scripts_djs.getInteractionObj(interaction);
    const { id, channel, guild, userInfo, customID } = interactionObj;
    const { name, displayName, userId, avatar, role, roleID, roleName} = userInfo;
  const { guildId, guildName, guildIcon, guildOwner, guildOwnerID } = guild;

    // BUTTONS
    if (interaction.isButton()) {
        if (customID.includes('newleak')) {
          // Launch New Leak Modal
          console.log(`Button Clicked: ${customID}`);
        } else if (customID.includes('ogfile')) {
          // Launch OG File Modal
          console.log(`Button Clicked: ${customID}`);
        } else if (customID.includes('studiosession')) {
          // Launch Studio Session Modal
          console.log(`Button Clicked: ${customID}`);
        } else if (customID.includes('snippet')) {
          // Launch Snippet Modal
            console.log(`Button Clicked: ${customID}`);
          } else if (customID.includes('groupbuybtn')) {
            // Launch Group Buy Modal
            console.log(`Button Clicked: ${customID}`);
          } else if (customID.includes('custom')) {
            // Launch Custom Modal
            return interaction.update(message);
          }
    } 
  });
}
