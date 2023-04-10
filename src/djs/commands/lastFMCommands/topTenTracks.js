const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm.js');
const { SlashCommandBuilder } = require("discord.js");
const jsdom = require("jsdom");
require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;
const scripts = require("../../functions/scripts/scripts.js")
const createEmb = require("../../functions/create/createEmbed.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ttt-lastfm")
    .setDescription("Your LastFM top 10 tracks from an Artist")
    .addStringOption(option => option.setName("artist").setDescription("Artist Name").setRequired(true)
    ),
    async execute(interaction) {
        try {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply({embeds: [createEmb.createEmbed({ description: `<a:Discord_loading:1094515757074874428>`})]})
          } catch (error) {
            console.log(error, `error deferring reply`);
          }
          
        let artist;
        let userinfoget = interaction.user;
        let usersArtist = interaction?.options?.getString("artist");
        if (['jw','juice', 'jarad', 'jarad a higgins', 'j', 'legend', 'the goat', '999', 'juicewrld','juice world'].includes(usersArtist.toLowerCase())) {
            usersArtist = 'Juice WRLD'
        }
        let LFuser;
        try{
            LFuser = await lastfmModel.findOne({ userID: userinfoget.id });
            if(!LFuser){
                const embed = createEmb.createEmbed({color: scripts.getErrorColor(), description: `❌ \`Invalid LastFM\`\nMakeSure Your LastFM is Set-up Properly with \`/set-lastfm\``})
                return await interaction.editReply({embeds: [embed]}) 
            } else {
                
            }
        } catch(err) {
            console.log(err);
        }
        
        var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1000`

        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });

        if (!usersArtist) {
            let uri1 = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1`
        
        
            // const recenttrack = await axios.get(uri1)
            // //console.log(recenttrack.data)
            
            // const dom2 = new jsdom.JSDOM(recenttrack.data, {
            //     contentType: "text/xml",
            // });
            artist = dom1.window.document.querySelector("artist").textContent;
            console.log(`new artist is ${artist}`)
        } else artist = usersArtist;

        const tracknames = [];
        const trackurls = [];
        const trackplays = [];
        const artists = [];
        var j = 1;
        while (tracknames.length < 10 && j <= 1000) {
            try {
              var artistcheck = dom1.window.document.querySelector(`track[rank="${[j]}"] artist name`).textContent;
              if (artistcheck.toLowerCase() === artist.toLowerCase()) {
                var trackname = dom1.window.document.querySelector(`track[rank="${[j]}"] name`).textContent;
                var trackurl = dom1.window.document.querySelector(`track[rank="${[j]}"] url`).textContent;
                var trackplaycount = dom1.window.document.querySelector(`track[rank="${[j]}"] playcount`).textContent;
                var artistname = dom1.window.document.querySelector(`track[rank="${[j]}"] artist name`).textContent;
                tracknames.push(trackname)
                trackurls.push(trackurl)
                trackplays.push(trackplaycount)
                artists.push(artistname)
              }
              j++;
            } catch (error) {
              break;
            }
          }
          
          if (j > 1000) {
            console.log(j, `j ended`)
            const embed = createEmb.createEmbed({color: scripts.getErrorColor(), title: `Error`, description: `❌ \`Invalid Artist\``})
            return await interaction.editReply({embeds: [embed]})
          };
          
          let playcount = trackplays.reduce((sum, current) => sum + parseFloat(current), 0);
          
          let trackList = tracknames.map((trackname, index) => `\`${index + 1}.\` **[${trackname}](${trackurls[index]}) (\`${trackplays[index]} ${trackplays[index] <= 1 ? `Play` : `Plays`}\`)**`).join('\n');
          
          const embed = createEmb.createEmbed({color: userinfoget.hexAccentColor, title: `${LFuser.lastfmID} | Top Tracks | ${artists[0] === undefined ? usersArtist : artists[0] }`, url: `https://www.last.fm/user/${LFuser.lastfmID}`, footer: { text: `Total Plays: ${playcount}`}, description: trackList})
          
        await interaction.channel.send({embeds: [embed]})
        await interaction.editReply({embeds: [createEmb.createEmbed({color:scripts.getSuccessColor(), description: `<:check:1088834644381794365>`})]})
        await scripts.delay(3330)
        await interaction.deleteReply()
    }
}