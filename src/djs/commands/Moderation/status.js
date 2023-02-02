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
    let serverStatsObj = scripts_djs.getServerInfoObj(interaction);
    let { memberCount, botCount, humanCount, onlineCount, offlineCount, idleCount, dndCount, onlineHumans, onlineBots } = serverStatsObj;

    let status = async () => {
      // works
      const memberCnt = {
        name: `\`Member Count\``,
        value: `\`${memberCount}\``,
        inline: false,
      };
      // create a field for bot count in the server
      // works
      const botCnt = {
        name: `\`Bot Count\``,
        value: `\`${botCount}\``,
        inline: false,
      };
      // create a field for human count in the server
      // works
      const humanCnt = {
        name: `\`Human Count\``,
        value: `\`${humanCount}\``,
        inline: false,
      };
      // create a field for online count in the server
      // works sometimes
      const onlineCnt = {
        name: `\`Online Count\``,
        value: `\`${onlineCount}\``,
        inline: false,
      };
      // create a field for offline count in the server
      // not working
      const offlineCnt = {
        name: `\`Offline Count\``,
        value: `\`${offlineCount}\``,
        inline: false,
      };
      // create a field for idle count in the server
      // not working
      const idleCnt = {
        name: `\`Idle Count\``,
        value: `\`${idleCount}\``,
        inline: false,
      };
      // create a field for dnd count in the server
      // not working
      const dndCnt = {
        name: `\`Do Not Disturb Count\``,
        value: `\`${dndCount}\``,
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

      let onlineHumanCnt = {
        name: `\`Online Humans\``,
        value: `\`${onlineHumans}\``,
        inline: false,
      };

      const fieldGroupA = [serverDate, memberCnt, botCnt, humanCnt, onlineCnt];
      const fieldGroupB = [offlineCnt, idleCnt, dndCnt, streamingCount, mobileCount];
      const fieldGroupC = [desktopCount, webCount];
      const fieldGroupD = [serverDate, memberCnt, botCnt, humanCnt, onlineHumanCnt ];

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
        fields: fieldGroupD,
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
