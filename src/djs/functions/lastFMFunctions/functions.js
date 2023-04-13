const client = require(`../../index.js`);
const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm.js');
const { SlashCommandBuilder } = require("discord.js");
const jsdom = require("jsdom");

require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;
const scripts = require("../scripts/scripts.js")
const createEmb = require("../create/createEmbed.js")
function calculateTotalPlays(dom) {
    let albumNodes = dom.window.document.querySelectorAll('album');
    let totalPlays = 0;
    albumNodes.forEach((album) => {
      totalPlays += parseInt(album.querySelector('playcount').textContent);
    });
    return totalPlays;
  }

    // if prefix+[`ttt`,`toptentracks`]+[artist] is used
    async function toptentracks(message, args){
        let userinfoget = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.get(message.author.id)
        if (userinfoget.user.id === client.user.id) {
            try{
                userinfoget = message.guild.members.cache.get(args[1].replace("<@", "").replace(">", ""))
            } catch(err) {
                userinfoget = message.guild.members.cache.get(message.author.id)
            }
        }

    let LFuser;
    try{
        LFuser = await lastfmModel.findOne({ userID: userinfoget?.id });
        if(!LFuser){
            if (userinfoget.id === message.member.user.id){
            return await message.reply({embeds: [createEmb.createEmbed({color: scripts.getErrorColor(), description: "❌ Before you can check your account, set your LastFM username -> `/set-lastfm`"})]})
            } else {
                return await message.reply({embeds: [createEmb.createEmbed({color: scripts.getErrorColor(), description: `❌ Before you can check <@${userinfoget.id}>'s account, they need to set their LastFM username`})]})
            }
        }
    } catch(err) {
        console.log(err);
        if(err.message.includes(`buffering timed out`)){
            const embed = createEmb.createEmbed({content: `<@${message.member.user.id}>`,color: scripts.getErrorColor(), description: `❌ \`Unable to connect to the database\`\n\`Wait a minute or two and try again\``})
            return await message.reply({embeds: [embed]})
        }
    }

 
        let usersArtist = args[1]
        if (['jw','juice', 'jarad', 'jarad a higgins', 'j', 'legend', 'goat', '999', 'juicewrld','juice world'].includes(usersArtist.toLowerCase())) {
            usersArtist = 'Juice WRLD'
        }
      
        
        var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1000`

        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });
        let artist;
        if (!usersArtist) {
            let uri1 = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1`
            artist = dom1.window.document.querySelector("artist").textContent;
            console.log(`new artist is ${artist}`)
        } else {
            let thearg = args.slice(1).join(' ');
            if (['jw','juice', 'jarad', 'jarad a higgins', 'j', 'legend', 'the goat', '999', 'juicewrld','juice world'].includes(thearg.toLowerCase())) {
                thearg = 'Juice WRLD'
            }
            artist = thearg

        }

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
            return await message.reply({embeds: [embed]})
          };
          
          let playcount = trackplays.reduce((sum, current) => sum + parseFloat(current), 0);
          
          let trackList = tracknames.map((trackname, index) => `\`${index + 1}.\` **[${trackname}](${trackurls[index]}) (\`${trackplays[index]} ${trackplays[index] <= 1 ? `Play` : `Plays`}\`)**`).join('\n');
          
          const embed = createEmb.createEmbed({color: message.member.user.displayHexColor, title: `${LFuser.lastfmID} | Top Tracks | ${artists[0] === undefined ? usersArtist : artists[0] }`, url: `https://www.last.fm/user/${LFuser.lastfmID}`, footer: { text: `Requested by : ${message.member.user.username} | Total Plays: ${playcount}`, iconURL: message.member.user.avatarURL()}, description: trackList})
          
        await message.reply({embeds: [embed]})


}

  // if prefix+[tracks/ttr/tt/lf tracks/lf ttr/lf tt]+[@user]+[7d/1m/3m/6m/12m/1y] is used
  async function tracks(message, args){
        let userinfoget = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.get(message.author.id)
        if (userinfoget.user.id === client.user.id) {
            try{
                userinfoget = message.guild.members.cache.get(args[1].replace("<@", "").replace(">", ""))
            } catch(err) {
                userinfoget = message.guild.members.cache.get(message.author.id)
            }
        }

    let LFuser;
    try{
        LFuser = await lastfmModel.findOne({ userID: userinfoget?.id });
        if(!LFuser){
            if (userinfoget.id === message.member.user.id){
            return await message.reply({embeds: [createEmb.createEmbed({color: scripts.getErrorColor(), description: "❌ Before you can check your account, set your LastFM username -> `/set-lastfm`"})]})
            } else {
                return await message.reply({embeds: [createEmb.createEmbed({color: scripts.getErrorColor(), description: `❌ Before you can check <@${userinfoget.id}>'s account, they need to set their LastFM username`})]})
            }
        }
    } catch(err) {
        console.log(err);
        if(err.message.includes(`buffering timed out`)){
            const embed = createEmb.createEmbed({content: `<@${message.member.user.id}>`,color: scripts.getErrorColor(), description: `❌ \`Unable to connect to the database\`\n\`Wait a minute or two and try again\``})
            return await message.reply({embeds: [embed]})
        }
    }
    let timelength;
    if (args[1] && args[1].startsWith("<@")) {
        timelength = args[2];
    } else timelength = args[1]; 
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
            case '12m':
                uri += `&period=12month`;
                albumuri += `&period=12month`;
                break;
            case '1y':
                uri += `&period=12month`;
                albumuri += `&period=12month`;
                break;
            default:
            timelength = 'Overall'
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
            color: message.member.displayHexColor,
            title: `${LFuser?.lastfmID} | Top Tracks (${timelength})`,
            url: `https://www.last.fm/user/${LFuser?.lastfmID}`,
            footer: {
                text: `Requested by: ${message.member.user.username} | Total Plays: ${calculateTotalPlays(dom)}`,
                iconURL: message.member.user.avatarURL({dynamic: true})
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
            return await message.reply({embeds: [createEmb.createEmbed(embed)]})
        }
        
        await message.reply({embeds: [createEmb.createEmbed(embed)]})

  }




  module.exports = {
    tracks,
    toptentracks

  }