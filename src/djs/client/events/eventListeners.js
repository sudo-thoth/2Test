const client = require(`../../index.js`);
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require(`../../functions/scripts/scripts_djs.js`);
const scripts_mongoDB = require(`../../functions/scripts/scripts_mongoDB.js`);

// const index = require(`src/djs/index.js`)
// const client = index.getClient();
// console.log(client);
if (client) {
  console.log(`The Client`, client);
  client.on("interactionCreate", async (interaction) => {
    const interactionObj = scripts_djs.getInteractionObj(interaction);
    const { id, channel, guild, userInfo, customID } = interactionObj;
    const { name, displayName, userId, avatar, role, roleID, roleName } =
      userInfo;
    const { guildId, guildName, guildIcon, guildOwner, guildOwnerID } = guild;
     let randID = 0;
    if (!interaction.isCommand()) {
	randID = scripts_djs.extractID(customID);
}

    // BUTTONS
    if (interaction.isButton()) {
      if (customID.includes("newleak")) {
        // Launch New Leak Modal
        let data = scripts_djs.getModalData_NewLeak(interaction);
        const {title, description, color, footer, thumbnail, author, fields, image, timestamp, url, buttons, components, embeds, files, content, options, ephemeral } = data;
        
        let modal = await scripts_djs.modal_NewLeak(randID);
        await interaction.showModal(modal);
      } else if (customID.includes("ogfile")) {
        // Launch OG File Modal
        let modal = await scripts_djs.modal_NewOGFile(randID);
        await interaction.showModal(modal);
      } else if (customID.includes("studiosession")) {
        // Launch Studio Session Modal
        let modal = await scripts_djs.modal_NewStudioSession(randID);
        await interaction.showModal(modal);
      } else if (customID.includes("snippet")) {
        // Launch Snippet Modal
        let modal = await scripts_djs.modal_NewSnippet(randID);
        await interaction.showModal(modal);
      } else if (customID.includes("groupbuybtn")) {
        // Launch Group Buy Hub {Embed}
      } else if (customID.includes("custom")) {
        // Launch Custom Modal
        let modal = await scripts_djs.modal_NewCustomAnnouncement(randID);
        await interaction.showModal(modal);
      }
    }

    // MODALS
    if (interaction.isModalSubmit()) {
      // defer the interaction
      await interaction.deferReply({
        ephemeral: true,
      });
      
      if (customID.includes(`newleakmodal`)) {
        // use a getter function to retrieve the roles, target channel, 
        let modalInput = scripts_djs.getModalInput_A(randID, interaction);
      } else if (customID.includes(`newogfilemodal`)) {
        let modalInput = scripts_djs.getModalInput_A(randID, interaction);
        scripts_djs.createAnnounceEmbed(randID, modalInput, 1, interaction)
        scripts_djs.sendDraft(randID)

      } else if (customID.includes(`newstudiosessionmodal`)) {
        let modalInput = scripts_djs.getModalInput_A(randID, interaction);
      } else if (customID.includes(`newsnippetmodal`)) {
        let modalInput = scripts_djs.getModalInput_B(randID, interaction);
      } else if (customID.includes(`newcustomannouncementmodal`)) {
        let modalInput = scripts_djs.getModalInput_C(randID, interaction);
      }
    }
  });
}
