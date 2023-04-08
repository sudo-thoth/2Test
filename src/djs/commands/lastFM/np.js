const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm.js');
const { EmbedBuilder } = require("discord.js");
const jsdom = require("jsdom");
const client = require("../../index.js");
require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;

module.exports = {
    name: "np",
    aliases: ["fm"],
    cooldown: 3,
    permissions: [],
    description: "Checks a LastFM users most recent track.",
    syntax: `np [user]`,
    example: `np @steve jobs#0999`,
    async execute(message, args) {
        let userinfoget = message.mentions.members.first() || message.guild.members.cache.get(args[1])
        if (!userinfoget) {
            try {
                userinfoget = message.guild.members.cache.get(client.users.cache.find(user => user.username.toLowerCase() === args[1].toLowerCase()).id)
            } catch {
                userinfoget = message.guild.members.cache.get(message.author.id)
            }
        }
        if (userinfoget.user.id === client.user.id) {
            try {
                userinfoget = message.guild.members.cache.get(args[1].replace("<@", "").replace(">", ""))
            } catch(err) {
                userinfoget = message.guild.members.cache.get(message.author.id)
            }  
        }
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

        let uri = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1`
        
        
        const recenttrack = await axios.get(uri)
        //console.log(recenttrack.data)
        
        const dom1 = new jsdom.JSDOM(recenttrack.data, {
            contentType: "text/xml",
        });
        let trackname = dom1.window.document.querySelector("name").textContent;
        let artistname = dom1.window.document.querySelector("artist").textContent;
        let album = dom1.window.document.querySelector("album").textContent;
        let trackurl = dom1.window.document.querySelector("url").textContent;
        let artisturlTEMP1 = trackurl.slice(0, -trackname.length);
        let artisturlTEMP2 = artisturlTEMP1.replace(`/_/`, "");
        let artisturl = artisturlTEMP2.replace(" ", "+");
        let albumimage = dom1.window.document.querySelector('image[size="extralarge"]').textContent;

        let tracknameXML = trackname.replace(` `, "+");
        let artistnameXML = artistname.replace(` `, "+");

        let uri1 = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${lastFM_API_ID}&artist=${artistnameXML}&track=${tracknameXML}&user=${LFuser.lastfmID}`

        const trackinfo = await axios.get(uri1)

        //console.log(alltracks.data)

        const dom2 = new jsdom.JSDOM(trackinfo.data)
        try {
            var playcount = dom2.window.document.querySelector("userplaycount").textContent;
        } catch {
            var playcount = "? `bot having trouble getting count`"
        }
        
        let totalscrobbles = dom1.window.document.querySelector("recenttracks").getAttribute('total');
        let avatar = userinfoget.displayAvatarURL({dynamic: true})
        if (albumimage == '') {
            albumimage = 'https://lastfm.freetls.fastly.net/i/u/128s/4128a6eb29f94943c9d206c08e625904.jpg';
        }
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setAuthor({name: `LastFM User: ${LFuser.lastfmID}`, iconURL: `${avatar}`, url: `https://www.last.fm/user/${LFuser.lastfmID}`})
            .setFooter({ text: `Playcount: ${playcount} | Total Scrobbles: ${totalscrobbles} | Album: ${album}`})
            .addFields([
                {name: 'Track', value: `> [${trackname}](${trackurl})`},
                {name: 'Artist', value: `> [${artistname}](${artisturl})`}])
            .setThumbnail(albumimage);

        try {
            await message.reply({embeds: [embed]}).then(sentEmbed => {
                sentEmbed.react("<a:WW:1086616104245411850>")
                sentEmbed.react("<a:LL:1086616103364591707>")
            })
        } catch (error) {
            console.log(error)  
            try {
                await message.channel.send({embeds: [embed]}).then(sentEmbed => {
                    sentEmbed.react("<a:WW:1086616104245411850>")
                    sentEmbed.react("<a:LL:1086616103364591707>")
                })
            } catch (error) {
                console.log(error)
            }
        }
        
    }
}