const lastfmModel = require("../../../MongoDB/db/schemas/schema_lastfm.js") 
const { EmbedBuilder,SlashCommandBuilder } = require("discord.js")
const scripts = require("../../functions/scripts/scripts.js")
const createEmb = require("../../functions/create/createEmbed.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("set-lastfm")
    .setDescription("Sets your LastFM username")
    .addStringOption(option => option.setName("username").setDescription("Your LastFM username").setRequired(true)
    ),
    async execute(interaction) {
       
        try {
            await interaction.deferReply({ ephemeral: true });
          } catch (error) {
            console.log(error, `error deferring reply`);
          }
          let {options, user} = interaction;
          let lfmUsername = options.getString("username")
        let LFuser; // last fm user
        lastfmModel
  .findOneAndUpdate(
    { userID: user.id },
    {
      $set: {
        userID: user.id,
        lastfmID: lfmUsername,
        discordUserID: user.id,
        discordUsername: user.username,
      },
    },
    { upsert: true, new: true }
  )
  .then(async (LFuser) => {
    let embed = createEmb.createEmbed({
      title: 'Success!',
      description: `\n\n <:yes:1087550258764071004> \`LastFM username set to:\` \n\`\`\`${LFuser.lastfmID}\`\`\``,
      color: scripts.getSuccessColor(),
    //   fields: [
    //     {
    //         name: 'LastFM Username',
    //         value: `New Username\n\`\`\`${LFuser.lastfmID}\`\`\``
    //     }
    //   ],
      thumbnail: user.avatarURL({ dynamic: true }),
    });
    return await interaction.editReply({ embeds: [embed] });
  })
  .catch( async (err) => {
    if (err.message.includes(`Unknown interaction`)) {
        console.log(
          `An unknown Interaction was Logged\nInteraction User ${interaction?.user?.username}`
        ); 
        return;
      } else {
        try {
         return await interaction.editReply({embeds: [createEmb.createEmbed({title: 'Error!', description: `<a:Error:1005725142015549621> \`an error occured while setting your LastFM username\` <:ArrowDCL:1079572493318246451> \`${LFuser.lastfmID}\`\n\n**__Error:__**\n\`\`\`js\n${err}\n\`\`\``, color: scripts.getErrorColor(), 
         thumbnail: user.avatarURL({ dynamic: true})})    
        ]})
    } catch (error) {
        console.log(error)
      }
      }
    
  });
    }
}