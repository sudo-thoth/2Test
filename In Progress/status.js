const { SlashCommandBuilder } = require("@discordjs/builders");
const { logError } = require('../src/djs/functions/scripts/scripts.js');
const createEmbed = require('../src/djs/functions/create/createEmbed.js');

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
      const mc = `**Server Member Count: ${interaction.guild.memberCount}**`;

      // create a embed field with an actionRow button to send to Discord
      const field = {
        name: `Member Count`,
        value: `${mc}`,
        inline: false,
      };
      // create a field for bot count in the server
      const botCount = {
        name: `Bot Count`,
        value: `${interaction.guild.members.cache.filter(member => member.user.bot).size}`,
        inline: false,
      };
      // create a field for human count in the server
      const humanCount = {
        name: `Human Count`,
        value: `${interaction.guild.members.cache.filter(member => !member.user.bot).size}`,
        inline: false,
      };
      // create a field for online count in the server
      const onlineCount = {
        name: `Online Count`,
        value: `${interaction.guild.members.cache.filter(member => member.presence.status === 'online').size}`,
        inline: false,
      };
      // create a field for offline count in the server
      const offlineCount = {
        name: `Offline Count`,
        value: `${interaction.guild.members.cache.filter(member => member.presence.status === 'offline').size}`,
        inline: false,
      };
      // create a field for idle count in the server
      const idleCount = {
        name: `Idle Count`,
        value: `${interaction.guild.members.cache.filter(member => member.presence.status === 'idle').size}`,
        inline: false,
      };
      // create a field for dnd count in the server
      const dndCount = {
        name: `Do Not Disturb Count`,
        value: `${interaction.guild.members.cache.filter(member => member.presence.status === 'dnd').size}`,
        inline: false,
      };
      // create a field for streaming count in the server
      const streamingCount = {
        name: `Streaming Count`,
        value: `${interaction.guild.members.cache.filter(member => member.presence.activities[0] && member.presence.activities[0].type === 'STREAMING').size}`,
        inline: false,
      };
      // create a field for mobile count in the server
      const mobileCount = {
        name: `Mobile Count`,
        value: `${interaction.guild.members.cache.filter(member => member.presence.clientStatus && member.presence.clientStatus.mobile).size}`,
        inline: false,
      };
      // create a field for desktop count in the server
      const desktopCount = {
        name: `Desktop Count`,
        value: `${interaction.guild.members.cache.filter(member => member.presence.clientStatus && member.presence.clientStatus.desktop).size}`,
        inline: false,
      };
      // create a field for web count in the server
      const webCount = {
        name: `Web Count`,
        value: `${interaction.guild.members.cache.filter(member => member.presence.clientStatus && member.presence.clientStatus.web).size}`,
        inline: false,
      };
      

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
        console.log(`- Embed:`, message);
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
