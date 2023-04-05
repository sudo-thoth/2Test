const axios = require("axios")
const lastfmModel = require('../../../MongoDB/db/schemas/schema_lastfm.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType } = require("discord.js");
const jsdom = require("jsdom");

module.exports = {
    name: "whoknowstrack",
    permissions: [],
    aliases: ["wkt"],
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
        const members = await message.guild.members.cache.map(member => member.id);
        const topCollect = [];

        if (!info) {
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
            const uri1 = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&limit=1`

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

        let trackname;
        let userplays;
        let artistname;
        const fetching = new EmbedBuilder()
            .setColor("00ff76")
            .setDescription(`✅ Fetching info for this command.`)
        const topMessage = await message.channel.send({embeds: [fetching]})
        for (const member of members) {
            try{
                LFuser = await lastfmModel.findOne({ userID: message.guild.members.cache.get(member) });
                if (LFuser) {
                    const uri = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&user=${LFuser.lastfmID}&api_key=2fdf8c5b06054003142716d7a970cada&artist=${artist}&track=${track}`
    
                    const toptracks = await axios.get(uri)
                    
                    const dom1 = new jsdom.JSDOM(toptracks.data, {
                        contentType: "text/xml",
                    });
                    userplays = dom1.window.document.querySelector('userplaycount').textContent;
                    trackname = dom1.window.document.querySelector('name').textContent;
                    artistname = dom1.window.document.querySelector('artist name').textContent;

                    topCollect.push({ username: message.guild.members.cache.get(member).user.tag, playcount: userplays, LFname: LFuser.lastfmID })

                }
            } catch(err) {
                console.log(err);
            }
        }

        const top = topCollect.sort((a, b) => b.playcount - a.playcount)
        function findUser(top) {
            return top.username === message.author.tag;
        }
        let userPosition = top.findIndex(findUser);

        let toStart = new ButtonBuilder().setCustomId("toStart").setEmoji("⏪").setStyle(ButtonStyle.Primary)
        let backPage = new ButtonBuilder().setCustomId("backPage").setEmoji("◀️").setStyle(ButtonStyle.Primary)
        let abort = new ButtonBuilder().setCustomId("cancel").setEmoji("<:x_:1083638562513236049>").setStyle(ButtonStyle.Danger)
        let nextPage = new ButtonBuilder().setCustomId("nextPage").setEmoji("▶️").setStyle(ButtonStyle.Primary)
        let toEnd = new ButtonBuilder().setCustomId("toEnd").setEmoji("⏩").setStyle(ButtonStyle.Primary)

        let buttons = new ActionRowBuilder().setComponents(toStart, backPage, abort, nextPage, toEnd)

        const awaitPageChange = async (page) => {
            const filter = i => {
                i.deferUpdate()
                return i.user.id == message.author.id
            }

            topEmbed.awaitMessageComponent({ filter, componentType: ComponentType.Button, max: 1, time: 30000, errors: ["time"]}).then(async (interaction) => {
                switch(interaction.customId) {
                    case 'toStart':
                        goTo = 1
                        pageSelect(goTo)
                        break;

                    case 'backPage':
                        if (page === 1) {
                            goTo = page
                        } else goTo = page - 1
                        pageSelect(goTo)
                        break;

                    case 'cancel':
                        await topEmbed.delete()
                        await message.delete()

                        break;
                    case 'nextPage':
                        if (page === pages) {
                            goTo = page
                        } else goTo = page + 1
                        pageSelect(goTo)
                        break;

                    case 'toEnd':
                        goTo = pages
                        pageSelect(goTo)
                        break;
                    
                    default:
                        console.log("i broke")
                }
            }).catch(err => {
                
            })
        }

        const pageSelect = async (page) => {
            i = (page - 1) * 10
            if (i === 0) {
                rankingsPerPage = ""
            } else rankingsPerPage = i / 10
            if (rankingsPerPage === "") {
                newNumber = 10
            } else newNumber = (rankingsPerPage + 1) * 10

            const embed1 = new EmbedBuilder()
                .setColor(message.member.displayHexColor)
                .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
                .setURL("https://www.last.fm/")
                .setTitle(`Top Listeners | ${artistname} - ${trackname}`)
                .setDescription(`\`${rankingsPerPage}1\` **[${top[i + 0].username}](https://www.last.fm/user/${top[i + 0].LFname})** has **${parseInt(top[i + 0].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}2\` **[${top[i + 1].username}](https://www.last.fm/user/${top[i + 1].LFname})** has **${parseInt(top[i + 1].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}3\` **[${top[i + 2].username}](https://www.last.fm/user/${top[i + 2].LFname})** has **${parseInt(top[i + 2].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}4\` **[${top[i + 3].username}](https://www.last.fm/user/${top[i + 3].LFname})** has **${parseInt(top[i + 3].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}5\` **[${top[i + 4].username}](https://www.last.fm/user/${top[i + 4].LFname})** has **${parseInt(top[i + 4].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}6\` **[${top[i + 5].username}](https://www.last.fm/user/${top[i + 5].LFname})** has **${parseInt(top[i + 5].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}7\` **[${top[i + 6].username}](https://www.last.fm/user/${top[i + 6].LFname})** has **${parseInt(top[i + 6].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}8\` **[${top[i + 7].username}](https://www.last.fm/user/${top[i + 7].LFname})** has **${parseInt(top[i + 7].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}9\` **[${top[i + 8].username}](https://www.last.fm/user/${top[i + 8].LFname})** has **${parseInt(top[i + 8].playcount).toLocaleString("en-US")}** plays\n\`${newNumber}\` **[${top[i + 9].username}](https://www.last.fm/user/${top[i + 9].LFname})** has **${parseInt(top[i + 9].playcount).toLocaleString("en-US")}** plays\nYour plays: **${parseInt(top[userPosition].playcount).toLocaleString("en-US")}** - Rank: \`${userPosition + 1}\``)
                .setFooter({ text: `Page ${page} of ${pages}`})
            await topEmbed.edit({embeds: [embed1], components: [buttons]})
            awaitPageChange(page)
        }

        let i;
        let pages = Math.floor(topCollect.length/10)
        pages = Math.ceil(pages)
        i = 0
        let newNumber;
        let rankingsPerPage = ``
        const embed = new EmbedBuilder()
            .setColor(message.member.displayHexColor)
            .setAuthor({name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({dynamic: true})})
            .setURL("https://www.last.fm/")
            .setTitle(`Top Listeners | ${artistname} - ${trackname}`)
            .setDescription(`\`${rankingsPerPage}1\` **[${top[i + 0].username}](https://www.last.fm/user/${top[i + 0].LFname})** has **${parseInt(top[i + 0].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}2\` **[${top[i + 1].username}](https://www.last.fm/user/${top[i + 1].LFname})** has **${parseInt(top[i + 1].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}3\` **[${top[i + 2].username}](https://www.last.fm/user/${top[i + 2].LFname})** has **${parseInt(top[i + 2].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}4\` **[${top[i + 3].username}](https://www.last.fm/user/${top[i + 3].LFname})** has **${parseInt(top[i + 3].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}5\` **[${top[i + 4].username}](https://www.last.fm/user/${top[i + 4].LFname})** has **${parseInt(top[i + 4].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}6\` **[${top[i + 5].username}](https://www.last.fm/user/${top[i + 5].LFname})** has **${parseInt(top[i + 5].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}7\` **[${top[i + 6].username}](https://www.last.fm/user/${top[i + 6].LFname})** has **${parseInt(top[i + 6].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}8\` **[${top[i + 7].username}](https://www.last.fm/user/${top[i + 7].LFname})** has **${parseInt(top[i + 7].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}9\` **[${top[i + 8].username}](https://www.last.fm/user/${top[i + 8].LFname})** has **${parseInt(top[i + 8].playcount).toLocaleString("en-US")}** plays\n\`${rankingsPerPage}10\` **[${top[i + 9].username}](https://www.last.fm/user/${top[i + 9].LFname})** has **${parseInt(top[i + 9].playcount).toLocaleString("en-US")}** plays\nYour plays: **${parseInt(top[userPosition].playcount).toLocaleString("en-US")}** - Rank: \`${userPosition + 1}\``)
            .setFooter({ text: `Page 1 of ${pages}`})
        const topEmbed = await message.channel.send({embeds: [embed], components: [buttons]})
        await topMessage.delete()
        awaitPageChange(1)
    }
}