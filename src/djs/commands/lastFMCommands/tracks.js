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
          let userinfoget = interaction?.options?.getString("target") || interaction.user;


        let LFuser;
        try{
            LFuser = await lastfmModel.findOne({ userID: userinfoget.id });
            if(!LFuser){
                const embed = createEmb.createEmbed({color: scripts.getErrorColor(), description: `❌ \`Invalid LastFM\`\nMakeSure Your LastFM is Set-up Properly with \`/set-lastfm\``})
                return await interaction.editReply({embeds: [embed]})
            }
        } catch(err) {
            console.log(err);
        }

            let timelength = interaction?.options?.getString("time-period") ? (interaction.options.getString("time-period") === 'overall' ? 'Overall' : interaction.options.getString("time-period")) : 'Overall';
        let uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=10`
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
        
    
        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });
        const embed = {
  color : userinfoget.hexAccentColor,
  title: `${LFuser.lastfmID} | Top Tracks (${timeperiod})`,
  url: `https://www.last.fm/user/${LFuser.lastfmID}`,
    }

let tracks = [];
let artists = [];
let urls = [];
let plays = [];
embed.fields = [];

let trackNodes = dom1.window.document.querySelectorAll('track');
for (let i = 0; i < trackNodes.length && i < 10; i++) {
  let track = trackNodes[i].querySelector('name').textContent;
  let artist = trackNodes[i].querySelector('artist name').textContent;
  let url = trackNodes[i].querySelector('url').textContent;
  let play = trackNodes[i].querySelector('playcount').textContent;
  
  tracks.push(track);
  artists.push(artist);
  urls.push(url);
  plays.push(play);

}

let playcount = plays.reduce((total, num) => total + parseFloat(num), 0);
embed.footer = { text: `Requested by: ${interaction.user.username} | Total Plays: ${playcount}`, iconURL: userinfoget.avatarURL()}

if (trackNodes.length > 0) {
  let description = '';
  for (let i = 0; i < tracks.length && i < 10; i++) {
    let rank = i + 1;
    description += `\`${rank}.\` **[${tracks[i]}](${urls[i]})** by **[${artists[i]}]** (\`${plays[i]}\`)\n`;
  }
  if (trackNodes.length > 10) {
    description += `...and ${trackNodes.length - 10} more`;
  }
  embed.description = description;
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