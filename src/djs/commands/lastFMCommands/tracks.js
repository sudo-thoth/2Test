const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm.js');
const { SlashCommandBuilder } = require("discord.js");
const jsdom = require("jsdom");
const client = require("../../index.js")
require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;
const scripts = require("../../functions/scripts/scripts.js")
const createEmb = require("../../functions/create/createEmbed.js")

function calculateTotalPlays(dom) {
    let albumNodes = dom.window.document.querySelectorAll('album');
    let totalPlays = 0;
    albumNodes.forEach((album) => {
      totalPlays += parseInt(album.querySelector('playcount').textContent);
    });
    return totalPlays;
  }

module.exports = {
    data: new SlashCommandBuilder()
    .setName("tt-lastfm")
    .setDescription("Top Tracks - LastFM")
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
            let uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LFuser?.lastfmID}&api_key=${lastFM_API_ID}&limit=10`
            let albumuri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${LFuser?.lastfmID}&api_key=${lastFM_API_ID}&limit=10`
            switch (timelength) {
                case '7d': 
                    uri += `&period=7day`;
                    albumuri += `&period=7day`; 
                    break;
                case '1m':
                    uri += `&period=1month`;
                    albumuri += `&period=1month`;
                    break;
                case '3m':
                    uri += `&period=3month`;
                    albumuri += `&period=3month`;
                    break;
                case '6m':
                    uri += `&period=6month`;
                    albumuri += `&period=6month`;
                    break;
                case '1y':
                    uri += `&period=12month`;
                    albumuri += `&period=12month`;
                    break;
                default:
                    uri = uri;
                    albumuri = albumuri;
                    break;
            }
   
            const topalbums = await axios.get(albumuri);

            const dom = new jsdom.JSDOM(topalbums.data, {
              contentType: "text/xml",
            });
            
            const toptracks = await axios.get(uri)
            
            const dom1 = new jsdom.JSDOM(toptracks.data, {
                contentType: "text/xml",
            });

            const embed = {
                color: userinfoget.hexAccentColor,
                title: `${LFuser?.lastfmID} | Top Tracks (${timelength})`,
                url: `https://www.last.fm/user/${LFuser?.lastfmID}`,
                footer: {
                    text: `Requested by: ${interaction.user.username} | Total Plays: ${calculateTotalPlays(dom)}`,
                    iconURL: interaction.user.avatarURL({dynamic: true})
                }
            }
            
            let tracks = [];
            let artists = [];
            let urls = [];
            let plays = [];
            embed.fields = [];
            
            let trackNodes = dom1.window.document.querySelectorAll('track');
            let description = '';
            if (trackNodes.length > 0) {
            
                for (let i = 0; i < trackNodes.length; i++) {
                    let track = trackNodes[i].querySelector('name').textContent;
                    let artist = trackNodes[i].querySelector('artist name').textContent;
                    let url = trackNodes[i].querySelector('url').textContent;
                    let play = trackNodes[i].querySelector('playcount').textContent;
                    let rank = i + 1;
            
                    if (description.length + `\`${rank}.\` **[${track}](${url})** by **[ *${artist}* ]** (\`${play <= 1 ? `${play} Play` : `${play} Plays`}\`)\n`.length > 4000) {
                        let remainingTracks = trackNodes.length - i;
                        description += `...and ${remainingTracks} more`;
                        break;
                    }
            
                    description += `\`${rank}.\` **[${track}](${url})** by **[ *${artist}* ]** (\`${play <= 1 ? `${play} Play` : `${play} Plays`}\`)\n`;
                }
            
                embed.description = description;
                if (description.includes('more')) {
                    embed.description += `\n\nNote: Some tracks were not displayed due to the 4096 character limit.`;
                }
            } else {
                embed.description = 'No tracks were found';
                return await interaction.editReply({embeds: [createEmb.createEmbed(embed)]})
            }
            
            await interaction.channel.send({embeds: [createEmb.createEmbed(embed)]})
            await interaction.editReply({embeds: [createEmb.createEmbed({color:scripts.getSuccessColor(), description: `<:check:1088834644381794365>`})]})
            await scripts.delay(3330)
            await interaction.deleteReply()
            
}
}