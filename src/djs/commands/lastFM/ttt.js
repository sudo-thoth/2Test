const axios = require("axios")
const lastfmModel = require('../../models/lastfmSchema');
const { EmbedBuilder } = require("discord.js");
const jsdom = require("jsdom");

module.exports = {
    name: "ttt",
    aliases: [],
    cooldown: 3,
    description: "Checks your top tracks from a specific artist.",
    syntax: `lf ttt <artist>`,
    example: `lf ttt Juice WRLD`,
    async execute(message, args) {
        let artist;
        let userinfoget = message.guild.members.cache.get(message.author.id)
        let LFuser;
        try{
            LFuser = await lastfmModel.findOne({ userID: userinfoget });
            if(!LFuser){
                const embed = new EmbedBuilder()
                    .setColor("Ff0048")
                    .setDescription(`❌ Invalid LastFM.`)
                return await message.channel.send({content: `${message.author}`,embeds: [embed]}) 
            } else {
                
            }
        } catch(err) {
            console.log(err);
        }
        
        var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=1000`

        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });

        if (!args[2]) {
            let uri1 = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=1`
        
        
            const recenttrack = await axios.get(uri1)
            //console.log(recenttrack.data)
            
            const dom2 = new jsdom.JSDOM(recenttrack.data, {
                contentType: "text/xml",
            });
            artist = dom2.window.document.querySelector("artist").textContent;
        } else artist = args.slice(2).join(' ');

        const tracknames = [];
        const trackurls = [];
        const trackplays = [];
        const artists = [];
        var j = 1;
        while (tracknames.length < 10) {
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
            if (j > 1000) {
                const embed = new EmbedBuilder()
                    .setColor("Ff0048")
                    .setAuthor({name: 'Invalid Artist', iconURL: 'https://media.discordapp.net/attachments/911699206744469534/911699500563832912/792538202324860990.png'})
                return message.channel.send({embeds: [embed]})
            };
        }
        let playcount = (parseFloat(trackplays[0]) + parseFloat(trackplays[1]) + parseFloat(trackplays[2]) + parseFloat(trackplays[3]) + parseFloat(trackplays[4]) + parseFloat(trackplays[5]) + parseFloat(trackplays[6]) + parseFloat(trackplays[7]) + parseFloat(trackplays[8]) + parseFloat(trackplays[9]));
        
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setTitle(`${LFuser.lastfmID} | Top Tracks | ${artists[0]}`)
            .setURL(`https://www.last.fm/user/${LFuser.lastfmID}`)
            .setFooter({ text: `Total Plays: ${playcount}`})
            .setDescription(`\`1.\` **[${tracknames[0]}](${trackurls[0]})** (\`${trackplays[0]}\`)\n\`2.\` **[${tracknames[1]}](${trackurls[1]})** (\`${trackplays[1]}\`)\n\`3.\` **[${tracknames[2]}](${trackurls[2]})** (\`${trackplays[2]}\`)\n\`4.\` **[${tracknames[3]}](${trackurls[3]})** (\`${trackplays[3]}\`)\n\`5.\` **[${tracknames[4]}](${trackurls[4]})** (\`${trackplays[4]}\`)\n\`6.\` **[${tracknames[5]}](${trackurls[5]})** (\`${trackplays[5]}\`)\n\`7.\` **[${tracknames[6]}](${trackurls[6]})** (\`${trackplays[6]}\`)\n\`8.\` **[${tracknames[7]}](${trackurls[7]})** (\`${trackplays[7]}\`)\n\`9.\` **[${tracknames[8]}](${trackurls[8]})** (\`${trackplays[8]}\`)\n\`10.\` **[${tracknames[9]}](${trackurls[9]})** (\`${trackplays[9]}\`)`)
        await message.channel.send({embeds: [embed]})
    }
}