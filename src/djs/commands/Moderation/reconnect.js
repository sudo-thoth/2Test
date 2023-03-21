require("dotenv").config({ path: "../../../../my.env" });
const client = require("../../index.js");
const mongoose = require('mongoose');
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');
const { MongoDB_Token_Wok_Beta } = process.env;
let token = MongoDB_Token_Wok_Beta;
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
    return console.log(error)
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
      return await interaction.editReply({embeds: [new EmbedBuilder()
        .setDescription(
          '<a:Giveaways:1052611718519459850> The bot is already connected to the database, no need to reconnect\n> \`status\` <:7688moderationvlow:1086718114802176172>'
        )
        .setColor(0xf1c40f)]}).then(async () => {
          await scripts.delay(5000);
           await interaction.deleteReply()
        }).catch((error) => {
          console.log(error)
          });
        
        // delete reply
    }

    const embed = new EmbedBuilder()
      .setDescription('<a:DiscordLoading:1075796965515853955> Reconnecting the bot...\n> \`status\` <a:loading:999005098153877616>')
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
      await mongoose.connect(token)
      console.log(`---------- >> MongoDB is Online << ----------`)
      client.connectedToMongoose = true;
    }catch(error){
      client.connectedToMongoose = false;
        console.error
      } finally {
        if(client.connectedToMongoose){
          //send success message/embed
          console.log(`connected once again`)
          let embed = new EmbedBuilder()
          .setDescription('__<a:success:1022450272586444912> **Success**__\n> \`status\` <:7688moderationvlow:1086718114802176172>')
          .setColor(scripts.getSuccessColor());
          await interaction.editReply({embeds: [embed]}).then(async () => {
            await scripts.delay(1000);
            embed = new EmbedBuilder()
          .setDescription('<:success:776752856501583872> **Database Connected**\n> \`status\` <:7688moderationvlow:1086718114802176172>')
          .setColor(scripts.getSuccessColor());
            await interaction.editReply({embeds: [embed]}).then(async () => {
              await scripts.delay(1000);
              await interaction.deleteReply();
            }).catch(error => {
              console.error(error);
            });
          }).catch((error) => {
            console.error(error);
          });
        } else {
          // send failed to connect, try again message/embed
          console.log(`failed to connect to db`);
          let embed = new EmbedBuilder()
          .setDescription('__<a:attention:760937915643068430> **Fail**__\n> \`status\` <:1486moderationvhighest:1086718105042034880>\nFailed to connect to the database, please try again.\n\nThis is likely due to slow internet connection. If problem is consistent, wait some time and try again.')
          .setFooter('Contact Steve Jobs if problem persists.')
          .setColor(scripts.getErrorColor());
          await interaction.editReply({embeds: [embed]}).then(async () => {
            await scripts.delay(10999);
            await interaction.deleteReply();
          }).catch(error => {
            console.error(error);
          });
        }
      }
      
    }
  },
};

