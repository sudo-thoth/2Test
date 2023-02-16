const client = require(`../../src/djs/index.js`);

const { SlashCommandBuilder } = require("@discordjs/builders");
const commandName = "stop";
const commandDescription = "Generate Kraken Links";


// FUNCTION TEST STATION Config.
// Currently testing the cLog() function
// Make Sure To change BOTH funcName AND the Import to the relevant function being tested

const createEmbed = require('../../src/djs/functions/create/createEmbed.js');
const scripts = require('../../src/djs/functions/scripts/scripts.js');

// making the funcName bold in the success and fail messages
module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`)
    ,
async execute(interaction) {
         console.log(`the start command was stopped by ${interaction.user.username}#${interaction.user.discriminator}`)
         interaction.reply({content: `The start command was stopped by ${interaction.user.username}#${interaction.user.discriminator}`});
  }



}
