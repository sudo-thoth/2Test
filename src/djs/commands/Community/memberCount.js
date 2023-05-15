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

    let memberCountV3 = async () => {
      // I need the total members,online members count, total bots count, total human count, total bot online count, idle members count, dnd members count, offline members count, and total online members count ( the sum of online, dnd, idle counts), 
      const memberCount = interaction.guild.memberCount;
      
      try {
        const fetchedMembers = await interaction.guild.members.fetch({ withPresences: true });
        const totalOline = fetchedMembers.filter(member => member.presence?.status === 'online').size;
        console.log(`There are currently ${totalOline} members online in this guild!`);
    
        const members = await interaction.guild.members.fetch();
        const onlineMembers = fetchedMembers.filter(member => member.presence?.status === 'online').size;
        const bots = fetchedMembers.filter(member => member.user.bot).size;
        const humans = fetchedMembers.filter(member => !member.user.bot).size;
        const botOnline = fetchedMembers.filter(member => member.user.bot && member.presence?.status === 'online').size;
        const idleMembers = fetchedMembers.filter(member => member.presence?.status === 'idle').size;
        const dndMembers = fetchedMembers.filter(member => member.presence?.status === 'dnd').size;
        const offlineMembers = fetchedMembers.filter(member => {
          // console.log(member.presence, `${member.user.username}'s Presence is that`)

          return member.presence === null || member.presence?.status === 'offline'
        }).size;
          
        const totalOnline = onlineMembers + idleMembers + dndMembers;
  
  
  
        const memberCountEmbedObj = {
          description: `<:5_members_pink_blue_people_ppl:1093195404297908385> **Total Members**\n\`\`\`Total Members is : ${memberCount}\`\`\`\n<:people_humans_ppl:1093220240713842839> **Total Humans**\n\`\`\`Total Humans : ${humans}\`\`\``,
          color: `#040303`,
          author: {
            name: 'Member Count'
          },
          thumbnail: interaction.guild.iconURL({dynamic: true}),
          fields: [
            {
              name: '<:24_online:1093185822087458816> Online Members',
              value: `\`\`\`${onlineMembers}\`\`\``,
              inline: true,
            },
            {
              name: '<:robot_bot:1093195407800139807> Total Bots',
              value: `\`\`\`${bots}\`\`\``,
              inline: true,
            },
            {
              name: '<:icon_idle:1093157263050551467> Idle Members',
              value: `\`\`\`${idleMembers}\`\`\``,
              inline: true,
            },
            {
              name: '<:23_dnd:1093185818874630256> Dnd Members',
              value: `\`\`\`${dndMembers}\`\`\``,
              inline: true,
            },
            {
              name: '<:22_offline:1107537293335597057> Offline Members',
              value: `\`\`\`${offlineMembers}\`\`\``,
              inline: true,
            },
  
          ],
          footer: {
              // the username will be the discord username of the person who ran the command
              text: `Requested by: ${interaction.user.username}`,
              // the icon URL will be the discord avatar of the person who ran the command
              iconURL: `${interaction.user.avatarURL()}`,
          }
      };
        let message;
        try {
          message = createEmbed.createEmbed(memberCountEmbedObj);
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
      }  catch (error) {
        console.log(error);
      }
    }

    await memberCountV3();
  }
};
