const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const commandName = "nick";
const commandDescription = "create a new nickname";
const scripts = require("../../functions/scripts/scripts.js");
const createEmbed = require("../../functions/create/createEmbed.js");

// This command gives you the opportunity to create a completely new nickname with just two simple steps.
module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`)
    .addStringOption((option) =>
      option
        .setName("nickname")
        .setDescription("enter your new nickname")
        .setRequired(true)
    ),
  execute,
};

async function execute(interaction) {
  // All you have to is access this command, type in your new nickname, and you are done!
  const nickname = interaction.options.getString("nickname");
  const interactionObj = scripts.getInteractionObj(interaction);
  const successEmbed = {
    title: `Nickname Changed`,
    description: `Your nickname has been changed to **${nickname}**`,
    color: `${scripts.getSuccessColor()}`,
    footer: {
      text: `Changed by: ${interactionObj.userInfo.name}`,
      iconURL: `${interactionObj.userInfo.avatar}`,
    },
    author: {
      name: `${interactionObj.userInfo.displayName}`,
      id: `${interactionObj.userInfo.userId}`,
      iconURL: `${interactionObj.userInfo.avatar}`,
      url: `https://discord.com/users/${interactionObj.userInfo.userId}`,
    },
  };
  const errEmbed = new EmbedBuilder()
    .setColor(scripts.getErrorColor())
    .setTitle("❗️ Error")
    .setDescription("The nickname you entered is invalid. Please try again.");
    const errEmbed2 = new EmbedBuilder()
    .setColor(scripts.getErrorColor())
    .setTitle("❗️ Error")
    .setDescription("The bot does not have the permissions to change your nickname. Please contact an admin to fix this issue.");

  try {
    // If the input nickname contains any curse words, throw an error
    if (scripts.checkForCurseWords(nickname)) {
      throw new Error("Curse Word Detected");
    }
    // Set the user's nickname to the input
    await interaction.member.setNickname(nickname);

  try {
    // Send the successEmbed to the user to confirm the nickname change
    await interaction.reply({ embeds: [createEmbed(successEmbed)] });
  } catch (error) {
    // If there is an error, send the errEmbed to the user and log the error
    //   await interaction.reply({ embeds: [errEmbed], ephemeral: true });
    scripts.logError(
      error,
      `Failed while sending results embed: ${interaction.commandName}`
    );
  }
  
  } catch (error) {
    // If there is an error, send the errEmbed to the user and log the error
    console.log(error.message)
    if (error.message === "Missing Permissions") {
        await interaction.reply({
      embeds: [errEmbed2],
      ephemeral: true,
    });
      scripts.logError(
        error,
        `Failed while setting nickname: due to bot not having permissions to change the users nickname. Make sure bot is above the user in the role hierarchy & has the "Manage Nicknames" permission enabled`
      );
    } else {
        await interaction.reply({
            embeds: [errEmbed],
            ephemeral: true,
          });
      scripts.logError(
        error,
        `Failed while setting nickname: ${interaction.commandName}`
      );
    }
  }
  console.log(`${commandName} Complete: ✅`);
}
