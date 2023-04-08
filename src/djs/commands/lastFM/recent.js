const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm');
const { EmbedBuilder } = require("discord.js");
const jsdom = require("jsdom");
const client = require("../../index.js")
require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;

module.exports = {
    name: "recent",
    permissions: [],
    aliases: [],
    description: "Checks a LastFM users recent tracks.",
    cooldown: 3,
    syntax: `lf albums [user]`,
    example: `lf albums tyler#0001`,
    async execute(message, args) {
        let userinfoget = message.mentions.members.first() || message.guild.members.cache.get(args[2]) || message.guild.members.cache.get(message.author.id)
        if (userinfoget.user.id === client.user.id) {
            try{
                userinfoget = message.guild.members.cache.get(args[2].replace("<@", "").replace(">", ""))
            } catch(err) {
                userinfoget = message.guild.members.cache.get(message.author.id)
            }
        }
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

        const uri = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=10`
    
        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });
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
        
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setTitle(`${LFuser.lastfmID} | Recent Tracks`)
            .setURL(`https://www.last.fm/user/${LFuser.lastfmID}`)
            .setDescription(`\`1.\` **[${trackname[0]}](${trackurl[0]})** by **[${artistname[0]}](${artisturl[0]})**\n\`2.\` **[${trackname[1]}](${trackurl[1]})** by **[${artistname[1]}](${artisturl[1]})**\n\`3.\` **[${trackname[2]}](${trackurl[2]})** by **[${artistname[2]}](${artisturl[2]})**\n\`4.\` **[${trackname[3]}](${trackurl[3]})** by **[${artistname[3]}](${artisturl[3]})**\n\`5.\` **[${trackname[4]}](${trackurl[4]})** by **[${artistname[4]}](${artisturl[4]})**\n\`6.\` **[${trackname[5]}](${trackurl[5]})** by **[${artistname[5]}](${artisturl[5]})**\n\`7.\` **[${trackname[6]}](${trackurl[6]})** by **[${artistname[6]}](${artisturl[6]})**\n\`8.\` **[${trackname[7]}](${trackurl[7]})** by **[${artistname[7]}](${artisturl[7]})**\n\`9.\` **[${trackname[8]}](${trackurl[8]})** by **[${artistname[8]}](${artisturl[8]})**\n\`10.\` **[${trackname[9]}](${trackurl[9]})** by **[${artistname[9]}](${artisturl[9]})**`)

        await message.channel.send({embeds: [embed]})
    }
}