const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm.js');
const { EmbedBuilder } = require("discord.js");
const jsdom = require("jsdom");
require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;

module.exports = {
    name: "playst",
    permissions: [],
    aliases: [],
    cooldown: 3,
    description: "Checks your plays on a given track using LastFM.",
    syntax: `lf playst [artist - song name]`,
    example: `lf playst Trippie Redd - Love Me More`,
    async execute(message, args) {
       
        if (args[2]) {
            var info = args.slice(2).join(' ');
            var info = info.split("-")
            var track = info[1]
            var track = track.replaceAll(" ", "+");
            if (track.startsWith("+")) {
                var track = track.substring(1);
            }
            var artist = info[0]
            var artist = artist.replaceAll(" ", "+");
            var artist = artist.slice(0, -1);
        }
        let userinfoget = message.guild.members.cache.get(message.author.id)
        let LFuser;
        try{
            LFuser = await lastfmModel.findOne({ userID: userinfoget });
            if(!LFuser) {
                const embed = new EmbedBuilder()
                    .setColor("Ff0048")
                    .setDescription(`❌ Invalid LastFM.`)
                return await message.channel.send({content: `${message.author}`,embeds: [embed]}) 
            }
        } catch(err) {
            console.log(err);
        }

        if (!info) {
            const uri1 = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1`

            const recenttracks = await axios.get(uri1)
            
            const dom2 = new jsdom.JSDOM(recenttracks.data, {
                contentType: "text/xml",
            });
            var artist = dom2.window.document.querySelector('track artist').textContent;
            var track = dom2.window.document.querySelector('track name').textContent;
            var artist = artist.replaceAll(" ", "+");
            var track = track.replaceAll(" ", "+");
            if (track.startsWith("+")) {
                var track = track.substring(1)
            }
        }

        const uri = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&artist=${artist}&track=${track}`
    
        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });
        const userplays = dom1.window.document.querySelector('userplaycount').textContent;
        const trackname = dom1.window.document.querySelector('name').textContent;
        const artistname = dom1.window.document.querySelector('artist name').textContent;
        const globalplays = dom1.window.document.querySelector('playcount').textContent;
        const artisturl = dom1.window.document.querySelector('artist url').textContent;
        const trackurl = dom1.window.document.querySelector('url').textContent;
        
        if (globalplays.length > 9) {
            var globalplaycount = `${globalplays.slice(0, -9)}b`;
        } else if (globalplays.length > 6 && globalplays.length <= 9) {
            var globalplaycount = `${globalplays.slice(0, -6)}m`;
        } else if (globalplays.length > 3 && globalplays.length <= 6) {
            var globalplaycount = `${globalplays.slice(0, -3)}k`;
        } else if (globalplays.length > 0 && globalplays.length <= 3) {
            var globalplaycount = globalplays;
        } else {
            const embed = new EmbedBuilder()
                .setColor("Ff0048")
                .setAuthor({name: `Track not found.`, iconURL: `https://media.discordapp.net/attachments/911699206744469534/911699500563832912/792538202324860990.png`})
            return await message.channel.send({embeds: [embed]})
        }
        var userpercent = (userplays / globalplays) * 100;
        var userpercent = userpercent.toFixed(2)
        if (userpercent === '0.00') {
            var userpercent = '0.01'
        }

        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setTitle(`${LFuser.lastfmID} | Plays | ${trackname}`)
            .setURL(`https://www.last.fm/user/${LFuser.lastfmID}`)
            .setFooter({ text: `${trackname} has a total of ${globalplaycount} plays. (${userpercent}%)`})
            .setTimestamp()
            .setDescription(`${message.author.username} has \`${userplays}\` plays on **[${trackname}](${trackurl})** by **[${artistname}](${artisturl})**`)

        await message.channel.send({embeds: [embed]})
    }
}