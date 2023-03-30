const axios = require("axios")
const customCommandModel = require('../../models/customCommandSchema.js');
const { EmbedBuilder } = require("discord.js");
const jsdom = require("jsdom");

module.exports = {
    name: "customcommand",
    aliases: ["cc", "customnp", "customfm"],
    cooldown: 3,
    permissions: [],
    description: "Create your own custom np command.",
    syntax: `lf cc <your custom np command>`,
    example: `lf cc bingadingalingchingchingwingtingping`,
    reqargs: 2,
    async execute(message, args) {
       
        if (args[2].length > 40) {
            const embed = new EmbedBuilder()
                .setColor("Ff0048")
                .setDescription(`❌ Your custom command may not exceed 40 characters.`)
            return await message.channel.send({content: `${message.author}`,embeds: [embed]}) 
        }
        let commandOwner;
        try{
            commandOwner = await customCommandModel.findOne({ userID: message.author.id, guildID: message.guild.id });
            if(!commandOwner){
                let commandOwner = await customCommandModel.create({
                    userID: message.author.id,
                    customCommand: args[2],
                    guildID: message.guild.id
                });
                commandOwner.save();
                const embed = new EmbedBuilder()
                    .setColor("00ff76")
                    .setDescription(`✅ Set your custom **Now Playing** command to \`${args[2]}\``)
                return await message.channel.send({content: `${message.author}`, embeds: [embed]})
            } else {
                await customCommandModel.deleteOne({ userID: message.author.id, guildID: message.guild.id });
                let commandOwner = await customCommandModel.create({
                    userID: message.author.id,
                    customCommand: args[2],
                    guildID: message.guild.id
                });
                commandOwner.save();
                const embed = new EmbedBuilder()
                    .setColor("00ff76")
                    .setDescription(`✅ Updated your custom **Now Playing** command to \`${args[2]}\``)
                return await message.channel.send({content: `${message.author}`, embeds: [embed]})
            }
        } catch(err) {
            console.log(err);
        }
    }
}