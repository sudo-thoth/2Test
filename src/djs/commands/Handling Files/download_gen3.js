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
    .setName("clean-download")
    .setDescription(
      "Send to a Channel; Use a unique batch ID to download all files from a previous save."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
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
        ),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
   try {
     await interaction.editReply({embeds:[createEmb.createEmbed({title:`Downloading Now`, description: `<a:T_Google_AI:932060562668544000>`})]})
   } catch (error) {
    scripts.logError(error, `error editing reply`);
   }
    const { options } = interaction;
    // const type = options?.getSubcommand();
    const target = options?.getChannel("target-channel");
    const batchID = options?.getString("batch-id");
    const user = interaction?.user;
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


    promises.push(get.downloadMessageBatchv3(batchID, target, interaction, startTime));


  await Promise.all(promises);

} catch (error) {
  try {
    // send error embed
    await interaction.user.send({embeds:[createEmb.createEmbed({title:`**__L__** | Error Downloading Files`,description:`\`\`\`js\n${error}\n\`\`\``})]})
    console.log(error)
  } catch (errr) {
    console.log(`Original Error getting downloads`)
    console.log(error)
    console.log(`Error sending download error to user`)
    console.log(errr)
  }
} 
// finally {
//   try {
//     await interaction.user.send({embeds:[createEmb.createEmbed({title:`**FINAL __W__** | Downloaded in ${formatElapsedTime(startTime)}`})]})
//   } catch (error) {
//     console.log(`Error sending download time to user`)
//     console.log(error)
//   }
// }
  },
};
