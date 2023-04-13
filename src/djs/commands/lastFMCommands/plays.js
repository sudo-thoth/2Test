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
    .setName("plays-artist-lastfm")
    .setDescription("Checks # of plays for a given artist - LastFM")
    .addStringOption(option => option.setName("artist").setDescription("Choose an Artist to see the # of Plays").setRequired(false)),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({embeds: [createEmb.createEmbed({ description: `<a:Discord_loading:1094515757074874428>`})]})
          } catch (error) {
            console.log(error, `error deferring reply`);
          }
          let userinfoget = interaction.user;
          let artist = interaction?.options?.getString("artist")

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
   
        if (!artist) {
            const uri1 = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1`
    
            const recenttracks = await axios.get(uri1)
            console.log(recenttracks.data)
            const dom2 = new jsdom.JSDOM(recenttracks.data, {
                contentType: "text/xml",
            });
            artist = dom2.window.document.querySelector('track artist').textContent;
            artist = artist.replace(" ", "+");
        }

        const uri = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&artist=${artist}`
    
        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });
        const artistUrl = `https://www.last.fm/music/${artist}`;

        const userplays = dom1.window.document.querySelector('stats userplaycount').textContent;
        const artistname = dom1.window.document.querySelector('name').textContent;
        const globalplays = dom1.window.document.querySelector('stats playcount').textContent;
        let globalplaycount;
        if (globalplays.length > 9) {
            globalplaycount = `${globalplays.slice(0, -9)}b`;
        } else if (globalplays.length > 6 && globalplays.length <= 9) {
            globalplaycount = `${globalplays.slice(0, -6)}m`;
        } else if (globalplays.length > 3 <= 6) {
            globalplaycount = `${globalplays.slice(0, -3)}k`;
        } else if (globalplays.length < 0 <= 3) {
            globalplaycount = globalplays;
        } else {
            const embed ={color: scripts.getErrorColor(),
            footer: {
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.avatarURL({ dynamic: true})
            }, description: `\`\`\`Artist not found | input: ${artist}\`\`\``, thumbnail: `https://media.discordapp.net/attachments/911699206744469534/911699500563832912/792538202324860990.png`
            }
              
            return await interaction.editReply({embeds: [createEmb.createEmbed(embed)]})
        }
        let userpercent = (userplays / globalplays) * 100;
        let userpercent = userpercent.toFixed(2)
        if (userpercent === '0.00') {
             userpercent = '0.01'
        }
       
            const embed ={color: interaction.user.hexAccentColor,
                title: `All-Time Plays for ${artistname}`,
                url: artistUrl,

                footer: { text: `Requested by ${interaction.user.username} | ${artistname} has a total of ${globalplaycount} (${userpercent}%)`,
                    iconURL: interaction.user.avatarURL({ dynamic: true})
                }, description: `[${interaction.user.username} [${LFuser.lastfmID}]](https://www.last.fm/user/${LFuser.lastfmID}) \n\`Total Plays\`\n\`\`\`${userplays}\`\`\``
                }
                await interaction.channel.send({embeds: [createEmb.createEmbed(embed)]})
                await interaction.editReply({embeds: [createEmb.createEmbed({color:scripts.getSuccessColor(), description: `<:check:1088834644381794365>`})]});
                await scripts.delay(3330);
                await interaction.deleteReply();
    }
}