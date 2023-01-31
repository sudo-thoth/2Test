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
      let modalInput = null;
      let embed = null;
      if (customID.includes(`newleakmodal`) || customID.includes(`newogfilemodal`) || customID.includes(`newstudiosessionmodal`)) {
        modalInput = scripts_djs.getModalInput_A(randID, interaction);
        embed = scripts_djs.createAnnounceEmbed(randID, modalInput, 1, interaction)
scripts_MongoDB.addModal_Embed(randID, modalInput, embed)
        scripts_djs.sendDraft(randID)

      } else if (customID.includes(`newsnippetmodal`)) {
        modalInput = scripts_djs.getModalInput_B(randID, interaction);
        embed = scripts_djs.createAnnounceEmbed(randID, modalInput, 2, interaction)
        scripts_MongoDB.addModalData(randID, modalInput)
      scripts_MongoDB.addModal_Embed(randID, modalInput, embed)
        scripts_djs.sendDraft(randID)
      } else if (customID.includes(`newcustomannouncementmodal`)) {
        modalInput = scripts_djs.getModalInput_C(randID, interaction);
        embed = scripts_djs.createAnnounceEmbed(randID, modalInput, 3, interaction)
        scripts_MongoDB.addModal_Embed(randID, modalInput, embed)
        scripts_djs.sendDraft(randID)
      }
      
      scripts_MongoDB.addModalData(randID, modalInput)
      // TODO: Add addEmbed() function
      scripts_MongoDB.addEmbed(randID, embed)
    }
  });
}



let {
    leakName, altLeakNames, dateOfLeak, price, notes, era, title, description, content, contentHeader, additionalDetails
    } = modalInput;
