const lastfmModel = require("../../../MongoDB/db/schemas/schema_lastfm.js") 
const { EmbedBuilder } = require("discord.js")

module.exports = {
    name: "set",
    description: "Sets your LastFM username.",
    aliases: ["s"],
    syntax: `lf set <LastFM Username>`,
    example: `lf set stevejobs`,
    reqargs: 2,
    cooldown: 10,
    async execute(message, args) {
       
        if (args[2] === undefined) return message.reply("You must include your LastFM username. `,lf set <username>`");
        let LFuser;
            try{
                LFuser = await lastfmModel.findOne({ userID: message.guild.members.cache.get(message.author.id) });
                if(!LFuser){
                    let LFuser = await lastfmModel.create({
                        userID: message.guild.members.cache.get(message.author.id),
                        lastfmID: args[2],
                    });
                    LFuser.save();
                    const embed = new EmbedBuilder()
                        .setColor("00ff76")
                        .setDescription(`✅ Successfully set your LastFM username to ${LFuser.lastfmID}.`)
                    return await message.channel.send({content: `${message.author}`, embeds: [embed]})
                } else {
                    await lastfmModel.deleteOne({ userID: message.guild.members.cache.get(message.author.id) });
                    let LFuser = await lastfmModel.create({
                        userID: message.guild.members.cache.get(message.author.id),
                        lastfmID: args[2],
                    });
                    LFuser.save();
                    const embed = new EmbedBuilder()
                        .setColor("00ff76")
                        .setDescription(`✅ Successfully changed your LastFM username to ${LFuser.lastfmID}.`)
                    return await message.channel.send({content: `${message.author}`, embeds: [embed]})
                }
            } catch(err) {
                console.log(err);
            }
        
    }
}