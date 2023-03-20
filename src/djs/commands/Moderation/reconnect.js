require("dotenv").config({ path: "../../../../my.env" });
const client = require("../../index.js");
const mongoose = require('mongoose');
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const { MongoDB_Token_Wok_Beta } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reconnect')
    .setDescription('ReAttempts to connect the bot to the database')
    .setDefaultPermission(false)
    .addBooleanOption((option) =>
      option
        .setName('confirm')
        .setDescription('Confirm the reconnect.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const confirmed = options.getBoolean('confirm');
    try{
    await interaction.deferReply({ephemeral: true});
  } catch (error) {
    console.log(error)
  }

    if (!confirmed) {
      const embed = new EmbedBuilder()
        .setDescription(
          'Please confirm the reconnect by running the command again with the `confirm` option set to `true`.'
        )
        .setColor(0xf1c40f);

      try {
        await interaction.editReply({ embeds: [embed] });
      } catch (error) {
        console.error('Failed to send reply:', error);
      }

      return;
    }
    if (client.connectedToMongoose){
      await interaction.editReply({embeds: [new EmbedBuilder()
        .setDescription(
          'The bot is already connected to the database, no need to reconnect'
        )
        .setColor(0xf1c40f)]})
        return
        // delete reply
    }

    const embed = new EmbedBuilder()
      .setDescription('Reconnecting the bot...')
      .setColor(0x3498db);

    try {
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Failed to send reply:', error);
    }
    if (mongoose === undefined) {
      return;
    } else {
      try{
      await mongoose.connect(MongoDB_Token_Wok_Beta)
      console.log(`---------- >> MongoDB is Online << ----------`)
      client.connectedToMongoose = true;
    }catch(error){
      client.connectedToMongoose = false;
        console.error
      } finally {
        if(client.connectedToMongoose){
          //send success message/embed
          console.log(`connected once again`)
        } else {
          // send failed to connect, try again message/embed
          console.log(`failed to connect to db`);
        }
      }
      
    }
  },
};
