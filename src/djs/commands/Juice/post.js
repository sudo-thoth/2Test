const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const createModal = require("../../functions/create/createModal.js");
const client = require(`../../index.js`);
module.exports = {
  data: new SlashCommandBuilder()
    .setName("post")
    .setDescription("Files must be 8mb or less or posted via Kraken Link")
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
    .addSubcommandGroup((group) =>
    group
      .setName("kraken-link")
      .setDescription("Choose the type of file you are posting")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("audio")
          .setDescription("Audio File Posted (via Kraken Link)")
          .addStringOption((option) =>
            option
              .setName("choose")
              .setDescription(
                "Yes if server doesn't attach files || No if server allows files attached"
              )
              .setRequired(true)
              .addChoices(
                { name: "NO - if your server [⛔] DOESN'T allow files to be posted", value: "no" },
                { name: "YES - if your server [✅] DOES allow files to be posted", value: "yes" },
              )
          )
          .addStringOption((option) =>
            option
              .setName("type")
              .setDescription(
                "What category does this audio file fall under?"
              )
              .setRequired(true)
              .addChoices(
                { name: "Leak", value: "leak" },
                { name: "OG File", value: "ogfile" },
                { name: "Studio Session", value: "studiosession" },
                { name: "Instrumental", value: "instrumental" },
                { name: "Accapella", value: "accapella" },
                { name: "Fully Mixed Session Edit", value: "mixedsession" },
                { name: "Snippet", value: "snippet" },
                { name: "Remaster", value: "remaster" },
                { name: "Stem Edit", value: "stemedit" },
                { name: "Magical Edit", value: "magicaledit" },
                { name: "Slowed & Reverb", value: "slowreverb" },
                { name: "Random", value: "rand" }
              )
          )
          .addRoleOption((opt) =>
            opt
              .setName("role1")
              .setDescription("Optional Additional roles to tag")
          )
          .addRoleOption((opt) =>
            opt
              .setName("role2")
              .setDescription("Optional Additional roles to tag")
          )
      )
  )
  .addSubcommandGroup((group) =>
      group
        .setName("attachment")
        .setDescription("Choose the type of file you are posting")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("audio")
            .setDescription("Audio File Posted (via attachment)")
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription(
                  "What category does this audio file fall under?"
                )
                .setRequired(true)
                .addChoices(
                  { name: "Leak", value: "leak" },
                  { name: "OG File", value: "ogfile" },
                  { name: "Studio Session", value: "studiosession" },
                  { name: "Instrumental", value: "instrumental" },
                  { name: "Accapella", value: "accapella" },
                  { name: "Fully Mixed Session Edit", value: "mixedsession" },
                  { name: "Snippet", value: "snippet" },
                  { name: "Remaster", value: "remaster" },
                  { name: "Stem Edit", value: "stemedit" },
                  { name: "Magical Edit", value: "magicaledit" },
                  { name: "Slowed & Reverb", value: "slowreverb" },
                  { name: "Random", value: "rand" }
                )
            )
            .addAttachmentOption((option) =>
              option.setName("attachment").setDescription("The file to post")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role1")
                .setDescription("Optional Additional roles to tag")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role2")
                .setDescription("Optional Additional roles to tag")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("video")
            .setDescription("Video File Posted (via attachment)")
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription("What type of Video are you sharing?")
                .setRequired(true)
                .addChoices(
                  { name: "Snippet", value: "snippet" },
                  { name: "Random", value: "rando" }
                )
            )
            .addAttachmentOption((option) =>
              option.setName("attachment").setDescription("The file to post")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role1")
                .setDescription("Optional Additional roles to tag")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role2")
                .setDescription("Optional Additional roles to tag")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("image")
            .setDescription("Image File Posted (via attachment)")
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription("What type of Image are you sharing?")
                .setRequired(true)
                .addChoices(
                  { name: "Cover Art", value: "coverart" },
                  { name: "Random", value: "rando" }
                )
            )
            .addAttachmentOption((option) =>
              option.setName("attachment").setDescription("The file to post")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role1")
                .setDescription("Optional Additional roles to tag")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role2")
                .setDescription("Optional Additional roles to tag")
            )
        )
    ),

  async execute(interaction) {
    // try {
    //   await interaction.deferReply({ ephemeral: true });
    // } catch (error) {
    //   scripts.logError(error, `error deferring reply`);
    // }
    const { options } = interaction;
    const format = options.getSubcommand();
    const file_type = options.getSubcommandGroup();
    //   const target = options.getChannel("target-channel");
    const type = options.getString("type");
    const file = options.getAttachment("attachment");
    const userId = interaction.user.id;
    const user = interaction.user;
    const choice = options.getString("choose");
    const role1 = options.getRole("role1");
    const role2 = options.getRole("role2");
    const roles = [role1 ? role1 : null, role2 ? role2 : null];
    let modalObj, modal;
    let randID = `#${Math.floor(Math.random() * 90000) + 10000}`;
    // extract the file info and also determine if the file is over or under 8mb, then place all that info into an obj to use moving forward
// let file, userId, user, type, format, file_type, interaction;
    const optionsObj = {
        file,
      userId,
      user,
      type, // leak, ogfile, studiosession, instrumental, accapella, mixedsession, snippet, remaster, stemedit, magicaledit, slowreverb, rand
      format,
      file_type, // kraken-link or attachment
      interaction,
      choice, // yes or no
      roles,
      randID,

    }
client.emit("PostCommand", optionsObj)

    switch (format) {
      case "image":
        if (type === "coverart") {
          // do cover art things
          // Modal Object that gets passed in below
          modalObj = {
            customID: `post_coverart_modal${randID}`,
            title: "Cover Art Post Survey",
            inputFields: [
              {
                customID: "name",
                label: "What song is this cover art for?",
                style: "TextInputStyle.Short",
                placeholder: "Song Name",
                required: true,
              },
              {
                customID: "artist",
                label: "Who is the artist?",
                style: "TextInputStyle.Short",
                placeholder: "Artist Name",
                required: false,
              },
              {
                customID: "artistsocial",
                label:
                  "Artist's Social Media Link",
                style: "TextInputStyle.Short",
                placeholder: "instagram.com/artistname",
                required: false,
              },
            ],
          };
          // Create the modal
          modal = await createModal.createModal(modalObj);
          // Show the modal
          await interaction.showModal(modal);
        }

        if (type === "rando") {
          // do random image things
          // Modal Object that gets passed in below
          modalObj = {
            customID: `post_rando_image_modal${randID}`,
            title: "Post Random Image Survey",
            inputFields: [
              {
                customID: "title",
                label: "Whats the title of this image?",
                style: "TextInputStyle.Short",
                placeholder: "Song Name",
                required: false,
              },
              {
                customID: "text",
                label: "Any additional text you want to add?",
                style: "TextInputStyle.Long",
                placeholder: "Extra Extra Read All About It!",
                required: false,
              },
            ],
          };
          // Create the modal
          modal = await createModal.createModal(modalObj);
          // Show the modal
          await interaction.showModal(modal);
        }
        // do image things

        break;
      case "video":
        if (type === "snippet") {
          // do video snippet things
          // Modal Object that gets passed in below
          modalObj = {
            customID: `post_snippet_modal_vid${randID}`,
            title: "Snippet Post Survey",
            inputFields: [
              {
                customID: "name",
                label: "What song is this snippet for?",
                style: "TextInputStyle.Short",
                placeholder: "Song Name",
                required: true,
              },
              {
                customID: "text",
                label: "Other info about the snippet?",
                style: "TextInputStyle.Long",
                placeholder: "Recently discovered snippet from 2017",
                required: false,
              },
            ],
          };
          // Create the modal
          modal = await createModal.createModal(modalObj);
          // Show the modal
          await interaction.showModal(modal);
        }

        if (type === "rando") {
          // do random video things
          // Modal Object that gets passed in below
          modalObj = {
            customID: `post_rando_video_modal${randID}`,
            title: "Random Video Post Survey",
            inputFields: [
              {
                customID: "title",
                label: "Title for the video",
                style: "TextInputStyle.Short",
                placeholder: "video title",
                required: false,
              },
              {
                customID: "text",
                label: "Other info about the video?",
                style: "TextInputStyle.Long",
                placeholder: "video of juice from his last concert in 2019",
                required: false,
              },
            ],
          };
          // Create the modal
          modal = await createModal.createModal(modalObj);
          // Show the modal
          await interaction.showModal(modal);
        }
        // do video things
        break;
      case "audio":

if (file_type === "attachment") {
          switch (type) {
            case "leak":
              // do leak things
                        // Modal Object that gets passed in below
            modalObj = {
              customID: `post_leak_modal_a${randID}`,
              title: "New Leak Survey",
              inputFields: [
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "era",
                  label:
                    "What is the era of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "DRFL",
                  required: false,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight\nAdore U",
                  required: false,
                },
                {
                  customID: "date",
                  label:
                    "What date was the song leaked?",
                  style: "TextInputStyle.Short",
                  placeholder: "Oct 25, 2021",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "ogfile":
              // do og file things
                              // Modal Object that gets passed in below
            modalObj = {
              customID: `post_ogfile_modal_a${randID}`,
              title: "New OG File Survey",
              inputFields: [
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "era",
                  label:
                    "What is the era of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "DRFL",
                  required: false,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight\nAdore U",
                  required: false,
                },
                {
                  customID: "date",
                  label:
                    "What date was the song leaked?",
                  style: "TextInputStyle.Short",
                  placeholder: "Oct 25, 2021",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "studiosession":
              // do studio session things
                              // Modal Object that gets passed in below
            modalObj = {
              customID: `post_studiosession_modal_a${randID}`,
              title: "New Studio Session Survey",
              inputFields: [
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "era",
                  label:
                    "What is the era of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "DRFL",
                  required: false,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight\nAdore U",
                  required: false,
                },
                {
                  customID: "date",
                  label:
                    "What date was the song leaked?",
                  style: "TextInputStyle.Short",
                  placeholder: "Oct 25, 2021",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "instrumental":
              // do instrumental things
                              // Modal Object that gets passed in below
            modalObj = {
              customID: `post_instrumental_modal_a${randID}`,
              title: "Instrumental Survey",
              inputFields: [
                {
                  customID: "producer",
                  label:
                    "Made By",
                  style: "TextInputStyle.Short",
                  placeholder: "@stevejobs",
                  required: false,
                },
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight",
                  required: false,
                },
                {
                  customID: "text",
                  label:
                    "Additional Information About The Instrumental",
                  style: "TextInputStyle.Long",
                  placeholder: "Special thanks to @lostleaks999 for the hi hats",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "acapella":
              // do acappella things
                                    // Modal Object that gets passed in below
            modalObj = {
              customID: `post_accapella_modal_a${randID}`,
              title: "Accapella Survey",
              inputFields: [
                {
                  customID: "kraken",
                  label:
                    "Provide 1 kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: true,
                },
                {
                  customID: "producer",
                  label:
                    "Made By",
                  style: "TextInputStyle.Short",
                  placeholder: "@stevejobs",
                  required: false,
                },
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight",
                  required: false,
                },
                {
                  customID: "text",
                  label:
                    "Additional Information About The Accapella",
                  style: "TextInputStyle.Long",
                  placeholder: "extra shit",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "mixedsession":
              // do mixed studio session things
                                    // Modal Object that gets passed in below
            modalObj = {
              customID: `post_mixedsession_modal_a${randID}`,
              title: "New Mixed Session Survey",
              inputFields: [
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "era",
                  label:
                    "What is the era of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "DRFL",
                  required: false,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight\nAdore U",
                  required: false,
                },
                {
                  customID: "date",
                  label:
                    "What date was the song leaked?",
                  style: "TextInputStyle.Short",
                  placeholder: "Oct 25, 2021",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "snippet":
              // do snippet things
                                    // Modal Object that gets passed in below
            modalObj = {
              customID: `post_snippet_modal_a${randID}`,
              title: "New Snippet Survey",
              inputFields: [
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "era",
                  label:
                    "What is the era of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "DRFL",
                  required: false,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight\nAdore U",
                  required: false,
                },
                {
                  customID: "date",
                  label:
                    "What date was the song leaked?",
                  style: "TextInputStyle.Short",
                  placeholder: "Oct 25, 2021",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "remaster":
              // do remaster things
                                          // Modal Object that gets passed in below
            modalObj = {
              customID: `post_remaster_modal_a${randID}`,
              title: "Remaster Survey",
              inputFields: [
                {
                  customID: "producer",
                  label:
                    "Made By",
                  style: "TextInputStyle.Short",
                  placeholder: "@stevejobs",
                  required: false,
                },
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight",
                  required: false,
                },
                {
                  customID: "text",
                  label:
                    "Additional Information About The Accapella",
                  style: "TextInputStyle.Long",
                  placeholder: "extra shit",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "stemedit":
              // do stem edit things
                                          // Modal Object that gets passed in below
            modalObj = {
              customID: `post_stemedit_modal_a${randID}`,
              title: "Stem Edit Survey",
              inputFields: [
                {
                  customID: "producer",
                  label:
                    "Made By",
                  style: "TextInputStyle.Short",
                  placeholder: "@stevejobs",
                  required: false,
                },
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight",
                  required: false,
                },
                {
                  customID: "text",
                  label:
                    "Additional Information About The Accapella",
                  style: "TextInputStyle.Long",
                  placeholder: "extra shit",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "magicaledit":
              // do magical edit things
                                          // Modal Object that gets passed in below
            modalObj = {
              customID: `post_magicaledit_modal_a${randID}`,
              title: "Magical Edit Survey",
              inputFields: [
                {
                  customID: "producer",
                  label:
                    "Made By",
                  style: "TextInputStyle.Short",
                  placeholder: "@stevejobs",
                  required: false,
                },
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight",
                  required: false,
                },
                {
                  customID: "text",
                  label:
                    "Additional Information About The Accapella",
                  style: "TextInputStyle.Long",
                  placeholder: "extra shit",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "slowreverb":
              // do slowed & reverb things
                                          // Modal Object that gets passed in below
            modalObj = {
              customID: `post_slowreverb_modal_a${randID}`,
              title: "Slowed & Reverb Survey",
              inputFields: [
                {
                  customID: "producer",
                  label:
                    "Made By",
                  style: "TextInputStyle.Short",
                  placeholder: "@stevejobs",
                  required: false,
                },
                {
                  customID: "name",
                  label: "What is the name of the song?",
                  style: "TextInputStyle.Short",
                  placeholder: "Adore You",
                  required: true,
                },
                {
                  customID: "altname",
                  label: "Any alternate names for the song?",
                  style: "TextInputStyle.Long",
                  placeholder: "Dark Knight",
                  required: false,
                },
                {
                  customID: "text",
                  label:
                    "Additional Information About The Accapella",
                  style: "TextInputStyle.Long",
                  placeholder: "extra shit",
                  required: false,
                },
                {
                  customID: "kraken",
                  label:
                    "Optional: If you want to add the kraken link",
                  style: "TextInputStyle.Short",
                  placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
            await interaction.showModal(modal);
              break;
            case "rando":
              // do random audio things
              // Modal Object that gets passed in below
              modalObj = {
                customID: `post_rando_audio_modal_a${randID}`,
                title: "Random Audio Post Survey",
                inputFields: [
                  {
                    customID: "title",
                    label: "Title for the audio",
                    style: "TextInputStyle.Short",
                    placeholder: "Song Name",
                    required: false,
                  },
                  {
                    customID: "text",
                    label: "Other info/text about the audio?",
                    style: "TextInputStyle.Long",
                    placeholder: "unreleased feature from Ally Lotti",
                    required: false,
                  },
                  {
                    customID: "kraken",
                    label:
                      "Optional: If you want to add the kraken link",
                    style: "TextInputStyle.Short",
                    placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
                    required: false,
                  },
                ],
              };
              // Create the modal
              modal = await createModal.createModal(modalObj);
              // Show the modal
              await interaction.showModal(modal);
              break;
            default:
              // do default things
              break;
          }
} else if (file_type === "kraken-link") {
  switch (type) {
    case "leak":
      // do leak things
                // Modal Object that gets passed in below
    modalObj = {
      customID: `post_leak_modal${randID}`,
      title: "New Leak Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "era",
          label:
            "What is the era of the song?",
          style: "TextInputStyle.Short",
          placeholder: "DRFL",
          required: false,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight\nAdore U",
          required: false,
        },
        {
          customID: "date",
          label:
            "What date was the song leaked?",
          style: "TextInputStyle.Short",
          placeholder: "Oct 25, 2021",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "ogfile":
      // do og file things
                      // Modal Object that gets passed in below
    modalObj = {
      customID: `post_ogfile_modal${randID}`,
      title: "New OG File Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "era",
          label:
            "What is the era of the song?",
          style: "TextInputStyle.Short",
          placeholder: "DRFL",
          required: false,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight\nAdore U",
          required: false,
        },
        {
          customID: "date",
          label:
            "What date was the song leaked?",
          style: "TextInputStyle.Short",
          placeholder: "Oct 25, 2021",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "studiosession":
      // do studio session things
                      // Modal Object that gets passed in below
    modalObj = {
      customID: `post_studiosession_modal${randID}`,
      title: "New Studio Session Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "era",
          label:
            "What is the era of the song?",
          style: "TextInputStyle.Short",
          placeholder: "DRFL",
          required: false,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight\nAdore U",
          required: false,
        },
        {
          customID: "date",
          label:
            "What date was the song leaked?",
          style: "TextInputStyle.Short",
          placeholder: "Oct 25, 2021",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "instrumental":
      // do instrumental things
                      // Modal Object that gets passed in below
    modalObj = {
      customID: `post_instrumental_modal${randID}`,
      title: "Instrumental Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "producer",
          label:
            "Made By",
          style: "TextInputStyle.Short",
          placeholder: "@stevejobs",
          required: false,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight",
          required: false,
        },
        {
          customID: "text",
          label:
            "Additional Information About The Instrumental",
          style: "TextInputStyle.Long",
          placeholder: "Special thanks to @lostleaks999 for the hi hats",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "acapella":
      // do acappella things
                            // Modal Object that gets passed in below
    modalObj = {
      customID: `post_accapella_modal${randID}`,
      title: "Accapella Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "producer",
          label:
            "Made By",
          style: "TextInputStyle.Short",
          placeholder: "@stevejobs",
          required: false,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight",
          required: false,
        },
        {
          customID: "text",
          label:
            "Additional Information About The Accapella",
          style: "TextInputStyle.Long",
          placeholder: "extra shit",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "mixedsession":
      // do mixed studio session things
                            // Modal Object that gets passed in below
    modalObj = {
      customID: `post_mixedsession_modal${randID}`,
      title: "New Mixed Session Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "era",
          label:
            "What is the era of the song?",
          style: "TextInputStyle.Short",
          placeholder: "DRFL",
          required: false,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight\nAdore U",
          required: false,
        },
        {
          customID: "date",
          label:
            "What date was the song leaked?",
          style: "TextInputStyle.Short",
          placeholder: "Oct 25, 2021",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "snippet":
      // do snippet things
                            // Modal Object that gets passed in below
    modalObj = {
      customID: `post_snippet_modal${randID}`,
      title: "New Snippet Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "era",
          label:
            "What is the era of the song?",
          style: "TextInputStyle.Short",
          placeholder: "DRFL",
          required: false,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight\nAdore U",
          required: false,
        },
        {
          customID: "date",
          label:
            "What date was the song leaked?",
          style: "TextInputStyle.Short",
          placeholder: "Oct 25, 2021",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "remaster":
      // do remaster things
                                  // Modal Object that gets passed in below
    modalObj = {
      customID: `post_remaster_modal${randID}`,
      title: "Remaster Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "producer",
          label:
            "Made By",
          style: "TextInputStyle.Short",
          placeholder: "@stevejobs",
          required: false,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight",
          required: false,
        },
        {
          customID: "text",
          label:
            "Additional Information About The Accapella",
          style: "TextInputStyle.Long",
          placeholder: "extra shit",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "stemedit":
      // do stem edit things
                                  // Modal Object that gets passed in below
    modalObj = {
      customID: `post_stemedit_modal${randID}`,
      title: "Stem Edit Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "producer",
          label:
            "Made By",
          style: "TextInputStyle.Short",
          placeholder: "@stevejobs",
          required: false,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight",
          required: false,
        },
        {
          customID: "text",
          label:
            "Additional Information About The Accapella",
          style: "TextInputStyle.Long",
          placeholder: "extra shit",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "magicaledit":
      // do magical edit things
                                  // Modal Object that gets passed in below
    modalObj = {
      customID: `post_magicaledit_modal${randID}`,
      title: "Magical Edit Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "producer",
          label:
            "Made By",
          style: "TextInputStyle.Short",
          placeholder: "@stevejobs",
          required: false,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight",
          required: false,
        },
        {
          customID: "text",
          label:
            "Additional Information About The Accapella",
          style: "TextInputStyle.Long",
          placeholder: "extra shit",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "slowreverb":
      // do slowed & reverb things
                                  // Modal Object that gets passed in below
    modalObj = {
      customID: `post_slowreverb_modal${randID}`,
      title: "Slowed & Reverb Survey",
      inputFields: [
        {
          customID: "kraken",
          label:
            "Provide 1 kraken link",
          style: "TextInputStyle.Short",
          placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
          required: true,
        },
        {
          customID: "producer",
          label:
            "Made By",
          style: "TextInputStyle.Short",
          placeholder: "@stevejobs",
          required: false,
        },
        {
          customID: "name",
          label: "What is the name of the song?",
          style: "TextInputStyle.Short",
          placeholder: "Adore You",
          required: true,
        },
        {
          customID: "altname",
          label: "Any alternate names for the song?",
          style: "TextInputStyle.Long",
          placeholder: "Dark Knight",
          required: false,
        },
        {
          customID: "text",
          label:
            "Additional Information About The Accapella",
          style: "TextInputStyle.Long",
          placeholder: "extra shit",
          required: false,
        },
      ],
    };
    // Create the modal
    modal = await createModal.createModal(modalObj);
    // Show the modal
    await interaction.showModal(modal);
      break;
    case "rando":
      // do random audio things
      // Modal Object that gets passed in below
      modalObj = {
        customID: `post_rando_audio_modal${randID}`,
        title: "Random Audio Post Survey",
        inputFields: [
          {
            customID: "kraken",
            label:
              "Provide 1 kraken link",
            style: "TextInputStyle.Short",
            placeholder: "https://krakenfiles.com/view/stevejobswashere.lol",
            required: true,
          },
          {
            customID: "title",
            label: "Title for the audio",
            style: "TextInputStyle.Short",
            placeholder: "Song Name",
            required: false,
          },
          {
            customID: "text",
            label: "Other info/text about the audio?",
            style: "TextInputStyle.Long",
            placeholder: "unreleased feature from Ally Lotti",
            required: false,
          },
        ],
      };
      // Create the modal
      modal = await createModal.createModal(modalObj);
      // Show the modal
      await interaction.showModal(modal);
      break;
    default:
      // do default things
      break;
  }
}
        break;
      default:
        // do default
        break;
    }
  },
};
