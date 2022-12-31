const { SlashCommandBuilder } = require("@discordjs/builders");
const scripts = require('../../functions/scripts/scripts.js');
const createEmbed = require('../../functions/create/createEmbed.js');

const commandName = "status";
const commandDescription = "Get the status of the server along with additional information";

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`),
  async execute(interaction) {
    // This is the same as the above function, but with an embed
    let status = async () => {
      // works
      const memberCount = {
        name: `\`Member Count\``,
        value: `\`${interaction.guild.memberCount}\``,
        inline: false,
      };
      // create a field for bot count in the server
      // works
      const botCount = {
        name: `\`Bot Count\``,
        value: `\`${interaction.guild.members.cache.filter(member => member.user.bot).size}\``,
        inline: false,
      };
      // create a field for human count in the server
      // works
      const humanCount = {
        name: `\`Human Count\``,
        value: `\`${interaction.guild.members.cache.filter(member => !member.user.bot).size}\``,
        inline: false,
      };
      // create a field for online count in the server
      // works sometimes
      const onlineCount = {
        name: `\`Online Count\``,
        value: `\`${interaction.guild.members.cache.size}\``,
        inline: false,
      };
      // create a field for offline count in the server
      // not working
      const offlineCount = {
        name: `\`Offline Count\``,
        value: `\`${(interaction.guild.memberCount) - (interaction.guild.members.cache.size)}\``,
        inline: false,
      };
      // create a field for idle count in the server
      // not working
      const idleCount = {
        name: `\`Idle Count\``,
        value: `\`${interaction.guild.members.cache.filter(member => { 
          return member.presence?.status && member.presence?.status === "idle";
        }).size}\``,
        inline: false,
      };
      // create a field for dnd count in the server
      // not working
      const dndCount = {
        name: `\`Do Not Disturb Count\``,
        value: `\`${interaction.guild.members.cache.filter(member =>  { 
          return member.presence?.status && member.presence?.status === "dnd";
        }).size}\``,
        inline: false,
      };
      // create a field for streaming count in the server
      // not working
      const streamingCount = {
        name: `\`Streaming Count\``,
        value: `\`${interaction.guild.members.cache.filter(member => member.presence?.activities[0] && member.presence?.activities[0].type === 'STREAMING').size}\``,
        inline: false,
      };
      // create a field for mobile count in the server
      // not working
      const mobileCount = {
        name: `\`Mobile Count\``,
        value: `\`${interaction.guild.members.cache.filter(member => member.presence?.clientStatus && member.presence?.clientStatus.mobile).size}\``,
        inline: false,
      };
      // create a field for desktop count in the server
      // not working
      const desktopCount = {
        name: `\`Desktop Count\``,
        value: `\`${interaction.guild.members.cache.filter(member => member.presence?.clientStatus && member.presence?.clientStatus.desktop).size}\``,
        inline: false,
      };
      // create a field for web count in the server
      // not working
      const webCount = {
        name: `\`Web Count\``,
        value: `\`${interaction.guild.members.cache.filter(member => member.presence?.clientStatus && member.presence?.clientStatus.web).size}\``,
        inline: false,
      };
      // create a field for server established date
      // works
      const serverDate = {
        name: `\`Server Established\``,
        value: `\`${interaction.guild.createdAt}\``,
        inline: false,
      };
      const fieldGroupA = [serverDate, memberCount, botCount, humanCount, onlineCount];
      const fieldGroupB = [offlineCount, idleCount, dndCount, streamingCount, mobileCount];
      const fieldGroupC = [desktopCount, webCount];

      const statusEmbedObj = {
        title: `Server Status`,
        color: `${scripts.getColor()}`,
        author: {
            // the username will be the discord username of the person who ran the command
            username: `${scripts.getInteractionObj(interaction).userInfo.name}`,
            // the icon URL will be the discord avatar of the person who ran the command
            iconURL: `${scripts.getInteractionObj(interaction).userInfo.avatar}`,
            url: `https://discord.com/users/${scripts.getInteractionObj(interaction).id}`
        },
        fields: fieldGroupA,
    };
      let message;
      try {
        message = createEmbed(statusEmbedObj);
      } catch (error) {
        logError(error, `Error creating ${commandName} embed`);
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
            console.log(`${commandName} Command Successfully Executed: ✅`);
          } catch (error) {
            console.error(error);
            console.log(`${commandName} Command Failed to Execute: ❌`);
            logError(error, `Error sending ${commandName} to Discord`);
          }
          console.log(`${commandName} Command Complete: ✅`);
    }
    status();
  }
};
