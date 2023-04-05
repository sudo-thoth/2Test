const axios = require("axios")
const lastfmModel = require('../../models/lastfmSchema');
const { EmbedBuilder } = require("discord.js");
const jsdom = require("jsdom");
const client = require("../../bot.js")

module.exports = {
    name: "artists",
    aliases: ["tar","ta"],
    cooldown: 3,
    description: "Checks a LastFM users top artists.",
    syntax: `lf artists [user] [time period]`,
    example: `lf artists tyler#0001 1y`,
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
        
        if (args[2] && args[2].startsWith("<@")) {
            var timelength = args[3];
        } else var timelength = args[2];
        if (timelength === "7d") {
            var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=10&period=7day`
            var timeperiod = "7 Days"
        } else if (timelength === "1m") {
            var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=10&period=1month`
            var timeperiod = "1 Month"
        } else if (timelength === "3m") {
            var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=10&period=3month`
            var timeperiod = "3 Months"
        } else if (timelength === "6m") {
            var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=10&period=6month`
            var timeperiod = "6 Months"
        } else if (timelength === "12m" || timelength === "1y") {
            var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=10&period=12month`
            var timeperiod = "1 Year"
        } else {
            var uri = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=10`
            var timeperiod = "Overall"
        }
    
        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });
        let artistrank1 = dom1.window.document.querySelector('artist[rank="1"] name').textContent;
        let artistrank2 = dom1.window.document.querySelector('artist[rank="2"] name').textContent;
        let artistrank3 = dom1.window.document.querySelector('artist[rank="3"] name').textContent;
        let artistrank4 = dom1.window.document.querySelector('artist[rank="4"] name').textContent;
        let artistrank5 = dom1.window.document.querySelector('artist[rank="5"] name').textContent;
        let artistrank6 = dom1.window.document.querySelector('artist[rank="6"] name').textContent;
        let artistrank7 = dom1.window.document.querySelector('artist[rank="7"] name').textContent;
        let artistrank8 = dom1.window.document.querySelector('artist[rank="8"] name').textContent;
        let artistrank9 = dom1.window.document.querySelector('artist[rank="9"] name').textContent;
        let artistrank10 = dom1.window.document.querySelector('artist[rank="10"] name').textContent;
        let artistrankurl1 = dom1.window.document.querySelector('artist[rank="1"] url').textContent;
        let artistrankurl2 = dom1.window.document.querySelector('artist[rank="2"] url').textContent;
        let artistrankurl3 = dom1.window.document.querySelector('artist[rank="3"] url').textContent;
        let artistrankurl4 = dom1.window.document.querySelector('artist[rank="4"] url').textContent;
        let artistrankurl5 = dom1.window.document.querySelector('artist[rank="5"] url').textContent;
        let artistrankurl6 = dom1.window.document.querySelector('artist[rank="6"] url').textContent;
        let artistrankurl7 = dom1.window.document.querySelector('artist[rank="7"] url').textContent;
        let artistrankurl8 = dom1.window.document.querySelector('artist[rank="8"] url').textContent;
        let artistrankurl9 = dom1.window.document.querySelector('artist[rank="9"] url').textContent;
        let artistrankurl10 = dom1.window.document.querySelector('artist[rank="10"] url').textContent;
        let trackrankplays1 = dom1.window.document.querySelector('artist[rank="1"] playcount').textContent;
        let trackrankplays2 = dom1.window.document.querySelector('artist[rank="2"] playcount').textContent;
        let trackrankplays3 = dom1.window.document.querySelector('artist[rank="3"] playcount').textContent;
        let trackrankplays4 = dom1.window.document.querySelector('artist[rank="4"] playcount').textContent;
        let trackrankplays5 = dom1.window.document.querySelector('artist[rank="5"] playcount').textContent;
        let trackrankplays6 = dom1.window.document.querySelector('artist[rank="6"] playcount').textContent;
        let trackrankplays7 = dom1.window.document.querySelector('artist[rank="7"] playcount').textContent;
        let trackrankplays8 = dom1.window.document.querySelector('artist[rank="8"] playcount').textContent;
        let trackrankplays9 = dom1.window.document.querySelector('artist[rank="9"] playcount').textContent;
        let trackrankplays10 = dom1.window.document.querySelector('artist[rank="10"] playcount').textContent;
        let playcount = (parseFloat(trackrankplays1) + parseFloat(trackrankplays2) + parseFloat(trackrankplays3) + parseFloat(trackrankplays4) + parseFloat(trackrankplays5) + parseFloat(trackrankplays6) + parseFloat(trackrankplays7) + parseFloat(trackrankplays8) + parseFloat(trackrankplays9) + parseFloat(trackrankplays10));
        
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setTitle(`${LFuser.lastfmID} | Top Artists (${timeperiod})`)
            .setURL(`https://www.last.fm/user/${LFuser.lastfmID}`)
            .setFooter({ text: `Total Plays: ${playcount}`})
            .setDescription(`\`1.\` **[${artistrank1}](${artistrankurl1})** (\`${trackrankplays1}\`)\n\`2.\` **[${artistrank2}](${artistrankurl2})** (\`${trackrankplays2}\`)\n\`3.\` **[${artistrank3}](${artistrankurl3})** (\`${trackrankplays3}\`)\n\`4.\` **[${artistrank4}](${artistrankurl4})** (\`${trackrankplays4}\`)\n\`5.\` **[${artistrank5}](${artistrankurl5})** (\`${trackrankplays5}\`)\n\`6.\` **[${artistrank6}](${artistrankurl6})** (\`${trackrankplays6}\`)\n\`7.\` **[${artistrank7}](${artistrankurl7})** (\`${trackrankplays7}\`)\n\`8.\` **[${artistrank8}](${artistrankurl8})** (\`${trackrankplays8}\`)\n\`9.\` **[${artistrank9}](${artistrankurl9})** (\`${trackrankplays9}\`)\n\`10.\` **[${artistrank10}](${artistrankurl10})** (\`${trackrankplays10}\`)`)
        await message.channel.send({embeds: [embed]})
    }
}