const { SlashCommandBuilder } = require("@discordjs/builders");
const message = ``;
const commandName = "commandslist";
const commandDescription = 'Get a list of all the commands';
const scripts = require('../../functions/scripts/scripts.js');
const scripts_djs = require('../../functions/scripts/scripts_djs.js');
const client = require("../../index.js");
const createEmb = require('../../functions/create/createEmbed.js');
const createActRow = require('../../functions/create/createActionRow.js');
const createBtn = require('../../functions/create/createButton.js');
// modify this code so that only 1 embed is shown at a time via 1 message with an action row with buttons to cycle through each page aka each embed in the embeds array. there should be 4 buttons in the action row, 1 button to go to the first page, 1 button to go the the previous page (unless on the first page), 1 button to go the the next page (unless on the last page), 1 button to go the the last result. remove the followUps and just all an update of the message's embed everytime one of the buttons is clicked.

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    // // HOW to Create an action row with a button
    // let buttonObj = {
    //       customID: "compress", // { less than 100 characters }
    //       label: "🗜️ Compress File", // { less than 45 characters }
    //       style: "primary", // { primary, secondary, success, danger, link}
    //       disabled: true,  // { true, false }
    //       emoji: "🗜️"
    //   }
    // let newButton = createBtn.createButton(buttonObj, scripts_djs.getRandID());
    // let actionRowObj = {
    //       components: [
    //       newButton // ... up to 5 in order from top to bottom
    //       ]
    //     }
    // let buttonRow = createActRow.createActionRow(actionRowObj);
    //     // action row with button complete

    let commands = client.commands;
    let commandsArray = [...commands.keys()]
    let commandsDescriptionArray = [...commands.values()]
    let commandsDescription = [];
    for (let i = 0; i < commandsDescriptionArray.length; i++) {
      commandsDescription[i] = commandsDescriptionArray[i].data.description;
    }
    let commandObjs = [];
    for (let i = 0; i < commandsArray.length; i++) {
      commandObjs[i] = {
        title: commandsArray[i],
        description: commandsDescription[i]
      }
    }

    let embeds = [];
    let current = 0;
    let page = 1;
    let total = commandObjs.length;
    let embedObj = {
      title: 'Commands Available',
      footer: {
        text: `Page ${page} of ${Math.ceil(total / 5)}`,
        iconURL: interaction.client.user.avatarURL()
    }

  }
  let fields = [];
    for (let i = 0; i < commandObjs.length; i++) {
      // for every 5 fields add the fields to the embed and push the embed to the embeds array
      if (current < 5) {
        if (current == 0) {
          embedObj = {
            title: 'Commands Available',
            footer: {
              text: `Page ${page} of ${Math.ceil(total / 5)}`,
              iconURL: interaction.client.user.avatarURL()
          }
        }
      }
        fields.push({
          name: `\`/${commandObjs[i].title}\``,
          value: `${commandObjs[i].description}`,
          inline: true
        })
        embedObj.fields = fields; 

        current++;
      }
      if (current == 5 || i == total - 1) {
        let embed = createEmb.createEmbed(embedObj);       
        embeds.push(embed);
        fields = [];
        current = 0;
        page++;
      }
    }
    for (let i = 0; i < embeds.length; i++) {
      if (i == 0) {
        console.log(`Sending embed ${i + 1} of ${embeds.length}...`, embeds[i])
        try {
          await interaction.editReply({content: `<@${interaction.user.id}> Here are the Commands for <@${interaction.client.user.id}>`, embeds: [embeds[i]], ephemeral: true});
        } catch (error) {
          scripts.logError(error, `Failed while replying to interaction with command list: ${interaction.commandName}`);

        }
      } else {
        console.log(`Sending embed ${i + 1} of ${embeds.length}...`, embeds[i])
        try {
          await interaction.followUp({embeds: [embeds[i]], ephemeral: true});
        } catch (error) {
          scripts.logError(error, `Failed while replying to interaction with command list: ${interaction.commandName}`);

        }
      }
    }
    console.log(`${commandName} Complete: ✅`);
  }
};
