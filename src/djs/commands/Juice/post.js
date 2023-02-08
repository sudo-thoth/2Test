const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require("discord.js");
  const scripts_djs = require("../../functions/scripts/scripts_djs.js");
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("post")
      .setDescription(
        "post a file w some info about it"
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
      .addAttachmentOption((option) =>
      option
        .setName("attachment")
        .setDescription("The file to post")
    )
    .addRoleOption((opt) =>
      opt
        .setName("role1")
        .setDescription("Optional Additional roles to tag")
    )
    .addRoleOption((opt) =>
      opt.setName("role2").setDescription("Optional Additional roles to tag")
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName("audio")
      .setDescription("File type is Audio")
      .addStringOption(option =>
        option.setName('type')
          .setDescription('What kind of File Batch did you save? Message Attachments or Kraken Links? ')
          .setRequired(true)
          .addChoices(
            { name: 'Leak', value: 'leak' },
            { name: 'OG File', value: 'ogfile' },
            { name: 'Studio Session', value: 'studiosession'},
            { name: 'Instrumental', value: 'instrumental' },
            { name: 'Accapella', value: 'accapella' },
            { name: 'Full Mixed Session Edit', value: 'mixedsession'},
            { name: 'Snippet', value: 'snippet' },
            { name: 'Remaster', value: 'remaster' },
            { name: 'Stem Edit', value: 'stemedit'},
            { name: 'Magical Edit', value: 'magicaledit'},
            { name: 'Slowed & Reverb', value: 'slowreverb'},
          )))
          .addSubcommand((subcommand) =>
    subcommand
      .setName("video")
      .setDescription("File type is Video")
      .addStringOption(option =>
        option.setName('type')
          .setDescription('What type of Video are you sharing?')
          .setRequired(true)
          .addChoices(
            { name: 'Snippet', value: 'snippet' },
            { name: 'Random', value: 'rando'}
          )))
          .addSubcommand((subcommand) =>
    subcommand
      .setName("image")
      .setDescription("File type is Image")
    .addStringOption(option =>
        option.setName('type')
          .setDescription('What type of Image are you sharing?')
          .setRequired(true)
          .addChoices(
            { name: 'Cover Art', value: 'coverart'},
            { name: 'Random', value: 'rando'}
          ))
      ),
  
    async execute(interaction) {
      try {
        await interaction.deferReply({ ephemeral: true });
      } catch (error) {
        scripts.logError(error, `error deferring reply`);
      }
      const { options } = interaction;
      const format = options.getSubcommand();
    //   const target = options.getChannel("target-channel");
      const type = options.getString("type");
      const file = options.getAttachment("attachment");
      const userId = interaction.user.id;;
      const user = interaction.user;
      // extract the file info and also determine if the file is over or under 8mb, then place all that info into an obj to use moving forward


      switch (format) {
        case 'image':
            if ( type === 'coverart' ){
                // do cover art things
            }

            if ( type === 'rando' ) {
                // do random image things
            }
            // do image things
            
            break;
        case 'video':
            if ( type === 'snippet' ){
                // do video snippet things
            }

            if ( type === 'rando' ) {
                // do random video things
            }
            // do video things
            break;
        case 'audio':
            switch (type) {
                case 'leak':
                    // do leak things
                    break;
                case 'ogfile':
                    // do og file things
                    break;
                case 'studiosession':
                    // do studio session things
                    break;
                case 'intrumental':
                    // do instrumental things
                    break;
                case 'acapella':
                    // do acappella things
                    break;
                case 'mixedsession':
                    // do mixed studio session things
                    break;
                case 'snippet':
                    // do snippet things
                    break;
                case 'remaster':
                    // do remaster things
                    break;
                case 'stemedit':
                    // do stem edit things
                    break;
                case 'magicaledit':
                    // do magical edit things
                    break;
                case 'slowreverb':
                    // do slowed & reverb things
                    break;
                default:
                    // do default things
                    break;
            }
            break;
        default:
            // do default
            break;
      }
  
      if (type === "download-to-dms") {
        if (cat === "files_only") {
          await scripts_djs.downloadFileBatch(batchID, interaction.user, interaction)
        } else if (cat === "kraken_only") {
          await scripts_djs.downloadKrakenBatch(batchID, interaction.user, interaction)
        }
      }
      if (type === "download-to-channel") {
        if (cat === "files_only") {
          await scripts_djs.downloadFileBatch(batchID, target, interaction)
        } else if (cat === "kraken_only") {
          await scripts_djs.downloadKrakenBatch(batchID, target, interaction)
        }
      }
    },
  };
  