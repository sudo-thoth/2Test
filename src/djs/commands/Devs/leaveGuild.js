const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    StringSelectMenuBuilder,
  } = require("discord.js");
  
  
  const scripts = require("../../functions/scripts/scripts.js");
  const scripts_djs = require("../../functions/scripts/scripts_djs.js");
  const createEmb = require("../../functions/create/createEmbed.js");
  const createBtn = require("../../functions/create/createButton.js");
  const createActRow = require("../../functions/create/createActionRow.js");
  const client = require("../../index.js");
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("leave-guild")
      .setDescription(
        "LEAVE"
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
      // .addStringOption((option) =>
      //       option
      //         .setName("server-id")
      //         .setDescription("What Server ID do you want to leave?")
      //         .setRequired(true)
      //     ),
  
      async execute(interaction) {
        try {
          await interaction.deferReply({ ephemeral: true });
        } catch (error) {
          console.log(error)
        }
        if(interaction.user.id !== '975944168373370940') return;
  
        
  
        // Create an array of guilds the bot is in
        const guilds = client.guilds.cache.map((guild) => ({
          label: guild.name,
          value: guild.id,
      }));
  
      // Create a MessageSelectMenu and add the guilds as options
      const selectMenu = new StringSelectMenuBuilder()
          .setCustomId('leave-guild-guild_selector')
          .setPlaceholder('Select a guild to leave')
          .setMinValues(1)
          .addOptions(guilds);
  
  
  
      const row = await createActRow.createActionRow({components: [selectMenu]});
  
      // Send the message with the select menu
      const guildSelectionmesssage = await interaction.editReply({
          content: 'Select the guild you want the bot to leave:',
          components: [row],
          ephemeral: true,
      });
  
      // Wait for the interaction on the select menu
      const filter = (i) => i.user.id === interaction.user.id;
      const collected = guildSelectionmesssage.createMessageComponentCollector( filter,{componentType: 'SELECT_MENU', time: 60000});
  
  
      collected.on('collect', async (collected) => {
        console.log(collected)
          // Get the selected guild
      const guildID = collected.values[0];
      const guild = client.guilds.cache.get(guildID);
  
      try {
          await guild.leave();
          await interaction.followUp({
              content: `The bot has successfully left the guild "${guild.name}" with ID ${guildID}.`,
              ephemeral: true,
          });
          try {
            await guildSelectionmesssage.delete();
          } catch (error) {
           console.log(error)
           
          }
      } catch (error) {
          console.error(error);
          await interaction.followUp({
              content: 'An error occurred while attempting to leave the guild.',
              ephemeral: true,
          });
          try {
            await guildSelectionmesssage.delete();
          } catch (error) {
           console.log(error)
           
          }
      }
      });
  
  
      collected.on('end', async (collected) => {
  
        try {
          await guildSelectionmesssage.delete();
        } catch (error) {
         console.log(error)
         
        }
      });
    
  
  
        // const guildID = interaction.options.getString('server-id');
        // const guild = client.guilds.cache.get(guildID);
  
        // if (!guild) {
        //     await interaction.reply({
        //         content: 'The bot is not a member of the specified guild.',
        //         ephemeral: true,
        //     });
        //     return;
        // }
  
        // try {
        //   {
        //     // const generalChannel = guild.channels.cache.find(channel => channel.name.toLowerCase() === 'general' && channel.type === 'GUILD_TEXT');
  
        //     // if (generalChannel && generalChannel.permissionsFor(guild.me).has('SEND_MESSAGES')) {
        //     //     await generalChannel.send('Goodbye! I am leaving this server.');
        //     // }
  
        //     await guild.leave();
        //     await interaction.reply({
        //         content: `The bot has successfully left the guild with ID ${guildID}.`,
        //         ephemeral: true,
        //     });
        // } catch (error) {
        //     console.error(error);
        //     await interaction.reply({
        //         content: 'An error occurred while attempting to leave the guild.',
        //         ephemeral: true,
        //     });
        // }
    }
  };
  