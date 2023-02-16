const { SlashCommandBuilder } = require("@discordjs/builders");
const { logError } = require('../../functions/scripts/scripts.js');
const createEmbed = require('../../functions/create/createEmbed.js');

const commandName = "membercount";
const commandDescription = "See the member count of the server";

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`),
  async execute(interaction) {
    // Command Code, sent as regular message text
    let memberCountV1 = async () => {
      const message = `Server Member Count: ${interaction.guild.memberCount}`;
          try {
            await interaction.reply({
              content: `${message}`,
              ephemeral: true,
            });
            console.log(`Member Count Command Successfully Executed: ✅`);
          } catch (error) {
            console.log(`Member Count Command Failed to Execute: ❌`);
          }
          console.log(`Member Count Command Complete: ✅`);
    }    
    // This is the same as the above function, but with an embed
    let memberCountV2 = async () => {
      const mc = `**Member Count: ${interaction.guild.memberCount}**`;

      const memberCountEmbedObj = {
        description: `${mc}`,
        color: `#040303`,
        author: {
            // the username will be the discord username of the person who ran the command
            username: `${interaction.user.username}`,
            // the icon URL will be the discord avatar of the person who ran the command
            iconURL: `${interaction.user.avatarURL()}`,
            url: `https://discord.com/users/${interaction.user.id}`,
            // role will be the highest role of the person who ran the command
            role: `${interaction.member.roles.highest}`
        }
    };
      let message;
      try {
        message = createEmbed(memberCountEmbedObj);
        console.log(`Embed Created: ✅`);
        console.log(`- Embed Object:`, memberCountEmbedObj);
      } catch (error) {
        logError(error, 'Error creating Member Count embed');
      }

          try {
            // Send the embed to Discord channel not as a reply or ephemeral message
            await interaction.reply({
              embeds: [message],
            });
            // // Send the embed to Discord channel as a reply or ephemeral message
            // await interaction.reply({
            //   content: `hi`,
            //   embeds: [message],
            // });
            console.log(`Member Count Command Successfully Executed: ✅`);
          } catch (error) {
            console.error(error);
            console.log(`Member Count Command Failed to Execute: ❌`);
            logError(error, 'Error sending Member Count to Discord');
          }
          console.log(`Member Count Command Complete: ✅`);
    }
    memberCountV2();
  }
};
