const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const get = require("../../functions/Handling Files/functions.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("download")
    .setDescription(
      "Send to your Dms or a Channel; Use a unique batch ID to download all files from a previous save."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("download-to-dms")
        .setDescription("Download files to your Dms.")
        .addStringOption((option) =>
    option
      .setName("batch-id")
      .setDescription("Enter the batch ID of the files you want to download.")
      .setRequired(true)
    )
    
  )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("download-to-channel")
        .setDescription("Download files to a channel of your choice.")
        .addChannelOption((option) =>
          option
            .setName("target-channel")
            .setDescription("Select a channel to download the files to.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("batch-id")
            .setDescription("Enter the batch ID of the files you want to download.")
            .setRequired(true)
        )
        
    ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
   try {
     await interaction.editReply({embeds:[createEmb.createEmbed({title:`Downloading Now`})]})
   } catch (error) {
    scripts.logError(error, `error editing reply`);
   }
    const { options } = interaction;
    const type = options.getSubcommand();
    const target = options.getChannel("target-channel");
    const batchID = options.getString("batch-id");
    const user = interaction.user;
    // this the first listener, that calls function
let startTime = performance.now();
function formatElapsedTime(startTime) {
  const elapsedTime = performance.now() - startTime;
  const msPerSecond = 1000;
  const msPerMinute = msPerSecond * 60;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const days = Math.floor(elapsedTime / msPerDay);
  const hours = Math.floor((elapsedTime % msPerDay) / msPerHour);
  const minutes = Math.floor((elapsedTime % msPerHour) / msPerMinute);
  const seconds = Math.floor((elapsedTime % msPerMinute) / msPerSecond);

  let timeString = "";
  if (days > 0) {
    timeString += `${days} Day${days > 1 ? "s" : ""} : `;
  }
  if (hours > 0 || days > 0) {
    timeString += `${hours} Hour${hours > 1 ? "s" : ""} : `;
  }
  if (minutes > 0 || hours > 0 || days > 0) {
    timeString += `${minutes} Minute${minutes > 1 ? "s" : ""} : `;
  }
  timeString += `${seconds} Second${seconds > 1 ? "s" : ""}`;

  return timeString;
}
try {
  const promises = [];

  if (type === "download-to-dms") {
    promises.push(get.downloadMessageBatch(batchID, user, interaction));
  }
  if (type === "download-to-channel") {
    promises.push(get.downloadMessageBatch(batchID, target, interaction));
  }

  await Promise.all(promises);

} catch (error) {
  try {
    // send error embed
    await interaction.user.send({embeds:[createEmb.createEmbed({title:`**__L__** | Error Downloading Files`,description:`\`\`\`js\n${error}\n\`\`\``})]})
  } catch (errr) {
    console.log(`Original Error getting downloads`)
    console.log(error)
    console.log(`Error sending download error to user`)
    console.log(errr)
  }
} finally {
  try {
    await interaction.user.send({embeds:[createEmb.createEmbed({title:`**__W__** | Downloaded in ${formatElapsedTime(startTime)}`})]})
  } catch (error) {
    console.log(`Error sending download time to user`)
    console.log(error)
  }
}
  },
};
