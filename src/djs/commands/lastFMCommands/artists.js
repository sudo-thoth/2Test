const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm.js');
const { SlashCommandBuilder } = require("discord.js");
const jsdom = require("jsdom");
const client = require("../../index.js")
require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;
const scripts = require("../../functions/scripts/scripts.js")
const createEmb = require("../../functions/create/createEmbed.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("tartists-lastfm")
    .setDescription("Top Artists - LastFM")
    .addStringOption(option => option.setName("time-period").setDescription("Time Period").addChoices(
        { name: "Overall", value: "overall"},
        { name: "7 Days", value: "7d" },
        { name: "1 Month", value: "1m" },
        { name: "3 Months", value: "3m" },
        { name: "6 Months", value: "6m" },
        { name: "1 Year", value: "1y" },
      ).setRequired(true))
    .addUserOption(option => option.setName("target").setDescription("Choose a User other than Yourself")),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({embeds: [createEmb.createEmbed({ description: `<a:Discord_loading:1094515757074874428>`})]})
          } catch (error) {
            console.log(error, `error deferring reply`);
          }
          let userinfoget = interaction?.options?.getUser("target") || interaction.user;

          let LFuser;
          try{
              LFuser = await lastfmModel.findOne({ userID: userinfoget?.id });
              if(!LFuser){
                  const embed = createEmb.createEmbed({color: scripts.getErrorColor(), description: `❌ \`Invalid LastFM\`\nMake Sure Your LastFM is Set-up Properly with \`/set-lastfm\``})
                  return await interaction.editReply({embeds: [embed]})
              }
          } catch(err) {
            console.log(err);
            if(err.message.includes(`buffering timed out`)){
                const embed = createEmb.createEmbed({color: scripts.getErrorColor(), description: `❌ \`Unable to connect to the database\`\n\`Wait a minute or two and try again\``})
                return await interaction.editReply({embeds: [embed]})
            }
          }
  
          let timelength = interaction?.options?.getString("time-period") ? (interaction.options.getString("time-period") === 'overall' ? 'Overall' : interaction.options.getString("time-period")) : 'Overall';
          let uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LFuser?.lastfmID}&api_key=${lastFM_API_ID}&limit=10`;
          
          switch (timelength) {
            case '7d': 
              uri += `&period=7day`;
              break;
            case '1m':
              uri += `&period=1month`;
              break;
            case '3m':
              uri += `&period=3month`;
              break;
            case '6m':
              uri += `&period=6month`;
              break;
            case '1y':
              uri += `&period=12month`;
              break;
            default:
              uri = uri;
              break;
          }
          
          const topartists = await axios.get(uri);
          
          const dom1 = new jsdom.JSDOM(topartists.data, {
            contentType: "text/xml",
          });
          
          let artistList = '';
          let totalPlays = 0;
          let artistNodes = dom1.window.document.querySelectorAll('artist');
          for (let i = 0; i < artistNodes.length; i++) {
            let rank = i + 1;
            let artist = artistNodes[i].querySelector('name').textContent;
            let url = artistNodes[i].querySelector('url').textContent;
            let playcount = artistNodes[i].querySelector('playcount').textContent;
            totalPlays += parseInt(playcount);
            artistList += `\`${rank}.\` **[${artist}](${url})** (\`${playcount <= 1 ? `${playcount} Play` : `${playcount} Plays`}\`)\n`;
          }
          
          const embed = {
            color: userinfoget.hexAccentColor,
            title: `${LFuser?.lastfmID} | Top Artists (${timelength})`,
            url: `https://www.last.fm/user/${LFuser?.lastfmID}`,
            footer: {
              text: `Requested by: ${interaction.user.username} | Total Plays: ${totalPlays}`,
              iconURL: interaction.user.avatarURL({dynamic: true})
            },
            description: artistList
          };
          
          await interaction.channel.send({embeds: [createEmb.createEmbed(embed)]});
          await interaction.editReply({embeds: [createEmb.createEmbed({color:scripts.getSuccessColor(), description: `<:check:1088834644381794365>`})]});
          await scripts.delay(3330);
          await interaction.deleteReply();

    }
}