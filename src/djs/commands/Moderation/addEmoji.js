
const client = require("../../index.js");

const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const axios = require("axios");
const {
  SlashCommandBuilder,
  Permissions,
  PermissionFlagsBits,
  PermissionsBitField,
} = require('discord.js');

async function addEmoji(type, input, x){
let emoji, botMember, id, emojiLink, emojiObj;
  switch (type) {
    case "prefix":
      let args = input;
      let m = x;
      emoji = args[0];
      

guild = m.guild;
botMember;
try{
botMember = await guild.members.fetch(client.user.id)
} catch (error) {
console.log(error)
}
        // Check if bot has permission to manage emojis
        if (!botMember?.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return m.reply({ephemeral: true,  embeds:[createEmb.createEmbed({description: `<@${m.client.user.id}> does not have permission to manage emojis on this server. It must have permission to manage Emojis and Stickers`, color: scripts.getErrorColor()})]});
        }
// construct emoji object
// { attachment: 'https://i.imgur.com/w3duR07.png', name: 'rip', reason `Added by ${m.user.tag}` } 


// verify we found the correct emoji within the args array

if (!(emoji.startsWith("<") && emoji.endsWith(">"))){
  // go through args until there is a match and one of the args begins with < and ends with >, then set that as the emoji
  let newMoji;
  for (let i = 0; i < args.length; i++){
    if (args[i].startsWith("<") && args[i].endsWith(">")){
      newMoji = args[i];
      break;
    }
  }
  if (!newMoji){
    let reply = await m.reply({ephemeral: true,  embeds:[createEmb.createEmbed({description: `No emoji found in your message, try again`, color: scripts.getErrorColor()})]});
    await scripts.delay(6000)
    await reply.delete()
    return;
  } else {
    emoji = newMoji;
  }
}


id = emoji.match(/\d{15,}/g)[0];
        type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`).then(image => {
          if (image) return "gif"
          else return "png"
      }).catch(err => {
          return "png"
      })

      emojiLink = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
      emojiObj = {
          attachment: emojiLink,
          name: emoji.split(":")[1],
          reason: `Added by ${m.author.tag}`
      }

        try {
            // Create the emoji
            const createdEmoji = await guild.emojis.create(emojiObj);
            let reply = await m.reply({embeds:[createEmb.createEmbed({description: `Emoji added successfully: ${createdEmoji}`, color: scripts.getSuccessColor()})]});
            await scripts.delay(6000)
            return await reply.delete()
        } catch (error) {
            console.error(error);
            let reply = await m.reply({embeds:[createEmb.createEmbed({description: `There was an error adding the emoji.\n\n**Error:**\n${error}`, color: scripts.getErrorColor()})]});
            await scripts.delay(6000)
            return await reply.delete()
        }
        break;
        case "slash":
        emoji = input;
        let interaction = x;


guild = interaction.guild;
botMember;
try{
botMember = await guild.members.fetch(client.user.id)
} catch (error) {
console.log(error)
}
console.log(botMember.permissions)
        // Check if bot has permission to manage emojis
        if (!botMember?.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) {
            return interaction.editReply({embeds:[createEmb.createEmbed({description: `<@${interaction.client.user.id}> does not have permission to manage emojis on this server. It must have permission to manage Emojis and Stickers`, color: scripts.getErrorColor()})]});
        }
// construct emoji object
// { attachment: 'https://i.imgur.com/w3duR07.png', name: 'rip', reason `Added by ${interaction.user.tag}` } 

id = emoji.match(/\d{15,}/g)[0];
        type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`).then(image => {
          if (image) return "gif"
          else return "png"
      }).catch(err => {
          return "png"
      })

      emojiLink = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
      emojiObj = {
          attachment: emojiLink,
          name: emoji.split(":")[1],
          reason: `Added by ${interaction.user.tag}`
      }

        try {
            // Create the emoji
            const createdEmoji = await guild.emojis.create(emojiObj);
            await interaction.editReply({embeds:[createEmb.createEmbed({description: `Emoji added successfully: ${createdEmoji}`, color: scripts.getSuccessColor()})]});
            await scripts.delay(6000)
            await interaction.deleteReply()
        } catch (error) {
            console.error(error);
            await interaction.editReply({embeds:[createEmb.createEmbed({description: `There was an error adding the emoji.\n\n**Error:**\n${error}`, color: scripts.getErrorColor()})]});
            await scripts.delay(6000)
            return await interaction.deleteReply()
        }

        break;
        default:
        return;
      }

}




if (client) {
  client.on("messageCreate", async (m) => {

    // run checks to see if the feature is on in the database for the messages channel & server
    const channel = m.channel;
    const guild = m.guild;

      if (m.author.bot)  return;

        // the accepted prefixes for the bot are [`,`,`!`,`.`,`+`,`-`,`?`]
        // if the message starts with any of these prefixes, then the bot will continue to process the message
        if(m.content.startsWith(`,`) || m.content.startsWith(`?`) || m.content.startsWith(`.`) || m.content.startsWith(`-`) || m.content.startsWith(`+`) || m.content.startsWith(`!`)){
          let args = m.content.split(" ");
          let cmd = args[0];
          let calledcmd = cmd.substring(1)


          if ([`steal`,`addEmoji`, `stealEmoji`, `addemoji`, `stealemoji`, `se`, `emoji`].includes(calledcmd)) {
           
            await addEmoji("prefix", args, m);
          }
                }
});
}



module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-emoji')
    .setDescription('steal an emoji and add it to the server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('the emoji')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const emoji = options.getString('emoji');
    try{
    await interaction.deferReply({ephemeral: true});
  } catch (error) {
    return console.log(error)
  }
await addEmoji("slash", emoji, interaction)
  
  },
};
