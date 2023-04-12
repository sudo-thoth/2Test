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
    .setName("recent-lastfm")
    .setDescription("Check a Users Recent Tracks - LastFM")
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
          const uri = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=10`
          
          const toptracks = await axios.get(uri);
                    
          const dom1 = new jsdom.JSDOM(toptracks.data, {
              contentType: "text/xml",
          });
                    
          const recenttracks = dom1.window.document.querySelectorAll('track');
          const recenttrackarray = Array.from(recenttracks);
                    
          let description = '';
           let embed ={}         
          if (recenttrackarray.length > 0) {
              embed = {
                  color: userinfoget.hexAccentColor,
                  title: `${LFuser.lastfmID} | Recent Tracks`,
                  url: `https://www.last.fm/user/${LFuser.lastfmID}`,
                  footer: {
                      text: `Requested by: ${interaction.user.username}`,
                      iconURL: interaction.user.avatarURL({dynamic: true})
                  },
                  fields: []
              };
              const recenttracknames = dom1.window.document.querySelectorAll('track name');
              const recenttracknamearray = Array.from(recenttracknames);
              const recenttrackartists = dom1.window.document.querySelectorAll('track artist');
              const recenttrackartistarray = Array.from(recenttrackartists);
              const recenttrackurl = dom1.window.document.querySelectorAll('track url');
              const recenttrackurlarray = Array.from(recenttrackurl);
              const trackname = [];
              const artistname = [];
              const trackurl = [];
              const artisturl = [];
              for (i = 0; i < recenttracknamearray.length; i++) {
                trackname.push(recenttracknamearray[i].innerHTML);
                artistname.push(recenttrackartistarray[i].innerHTML);
                trackurl.push(recenttrackurlarray[i].innerHTML);
                let trackname1 = recenttracknamearray[i].innerHTML;
                let tempurl = recenttrackurlarray[i].innerHTML;
                let artisturl1 = tempurl.substring(0, tempurl.length - trackname1.length - 3);
                artisturl.push(artisturl1);
              }
              try {
                for (let i = 0; i < recenttrackarray.length; i++) {
                  let trackn = trackname[i];
                  let artistn = artistname[i];
                  let url = trackurl[i];
                  let date = recenttrackarray[i].querySelector('date').getAttribute('uts');
                  let field = {
                    name: `\`${i+1}.\` [${trackn}](${url})`,
                    value: `**${artistn}** \`[\`<t:${date}:R>\`]\`` +
                           ``
                  };
                  if (description.length + `${field.name} by ${field.value}\n`.length > 4000) {
                    let remainingTracks = recenttrackarray.length - i;
                    description += `...and ${remainingTracks} more`;
                    break;
                  }
                  description += `${field.name} *by* ${field.value}\n`;
                }
              } catch (error) {
                console.log(error);
                if (error.message.includes('Cannot read properties')) {
                  description = `\`\`\`No Recent Tracks Found\`\`\``
                } else {
                  description = `An error occurred`;
                }
              }
              if (description.includes('more')) {
                description += `\n\nNote: Some tracks were not displayed due to the 4096 character limit.`;
              }
              embed.description = description;

          } else {
            embed = {
                color: scripts.getErrorColor(),
                title: `${LFuser.lastfmID} | Recent Tracks`,
                url: `https://www.last.fm/user/${LFuser.lastfmID}`,
                description: `\`\`\`No Recent Tracks Found\`\`\``,
                footer: {
                    text: `Requested by: ${interaction.user.username}`,
                    iconURL: interaction.user.avatarURL({dynamic: true})
                },
                fields: []
            }

          }
          await interaction.channel.send({embeds: [createEmb.createEmbed(embed)]})
          await interaction.editReply({embeds: [createEmb.createEmbed({color:scripts.getSuccessColor(), description: `<:check:1088834644381794365>`})]});
          await scripts.delay(3330);
          await interaction.deleteReply();
          

    }
}