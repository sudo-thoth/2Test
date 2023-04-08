const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm.js');
const { EmbedBuilder } = require("discord.js");
const jsdom = require("jsdom");
require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;

module.exports = {
    name: "plays",
    permissions: [],
    aliases: [],
    cooldown: 3,
    description: "Checks your plays on a given artist using LastFM.",
    syntax: `lf plays [artist]`,
    example: `lf plays Lil Uzi Vert`,
    async execute(message, args) {
       
        var artist = args.slice(2).join(' ');
        var artist = artist.replace(" ", "+");
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

        if (!artist) {
            const uri1 = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1`
    
            const recenttracks = await axios.get(uri1)
            
            const dom2 = new jsdom.JSDOM(recenttracks.data, {
                contentType: "text/xml",
            });
            var artist = dom2.window.document.querySelector('track artist').textContent;
            var artist = artist.replace(" ", "+");
        }

        const uri = `https://ws.audioscrobbler.com/2.0/?method=artist.getInfo&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&artist=${artist}`
    
        const toptracks = await axios.get(uri)
        
        const dom1 = new jsdom.JSDOM(toptracks.data, {
            contentType: "text/xml",
        });
        const userplays = dom1.window.document.querySelector('stats userplaycount').textContent;
        const artistname = dom1.window.document.querySelector('name').textContent;
        const globalplays = dom1.window.document.querySelector('stats playcount').textContent;
        
        if (globalplays.length > 9) {
            var globalplaycount = `${globalplays.slice(0, -9)}b`;
        } else if (globalplays.length > 6 <= 9) {
            var globalplaycount = `${globalplays.slice(0, -6)}m`;
        } else if (globalplays.length > 3 <= 6) {
            var globalplaycount = `${globalplays.slice(0, -3)}k`;
        } else if (globalplays.length < 0 <= 3) {
            var globalplaycount = globalplays;
        } else {
            const embed = new EmbedBuilder()
                .setColor("Ff0048")
                .setAuthor({name: `Artist not found.`, iconURL: `https://media.discordapp.net/attachments/911699206744469534/911699500563832912/792538202324860990.png`})
            return await message.channel.send({embeds: [embed]})
        }
        var userpercent = (userplays / globalplays) * 100;
        var userpercent = userpercent.toFixed(2)
        if (userpercent === '0.00') {
            var userpercent = '0.01'
        }

        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setTitle(`${LFuser.lastfmID} | Plays | ${artistname}`)
            .setURL(`https://www.last.fm/user/${LFuser.lastfmID}`)
            .setFooter({ text: `${artistname} has a total of ${globalplaycount} (${userpercent}%)`})
            .setTimestamp()
            .setDescription(`${message.author.username} has \`${userplays}\` plays on \`${artistname}\``)

        await message.channel.send({embeds: [embed]})
    }
}