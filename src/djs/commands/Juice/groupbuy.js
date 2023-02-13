const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const createModal = require("../../functions/create/createModal.js");
const client = require(`../../index.js`);
const saveInteraction = require("../../functions/groupbuy/saveInteraction.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("groupbuy")
    .setDescription("Open the Group Buy Hub")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((opt) =>
      opt.setName("role1").setDescription("Optional Additional roles to tag")
    )
    .addRoleOption((opt) =>
      opt.setName("role2").setDescription("Optional Additional roles to tag")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    // save the interaction to the database
    try {
      await saveInteraction(interaction);
    } catch (error) {
      console.log(`error saving interaction: ${error}`);
    }

 
    // upon execution of the command, the user obj, interaction obj and message obj is sent to the database
    // then a message is sent with an embed that welcomes the user to the Group Buy Hub, it lays out how the hub works and what the user can do.

    // It includes an action row that has 4 buttons, each button has a custom id that is used to determine what action to take when the button is pressed.
    // The buttons are:
    // Create a Group Buy (allows user to create a group buy),

    // Edit a Group Buy (allows user to add to the money total, subtract from the money total, and change elements of the group buy embed),

    // View Group Buys (allows user to see all active group buys in the current server and all active group buys in the database that was created by their user id),

    // End Group Buy (if the user is the creator of the group buy, they can end the group buy and it will be removed from the database. There will then be a message sent to the group buy channel that the group buy has ended and a summary of the group buy is shared in the message. If the user is not the creator of the group buy, the user will be sent an ephemeral message that tells them that they do not have permission to end the group buy).

    // In order to be able to click the `Create a Group Buy`, `Edit a Group Buy`, and `End Group Buy` buttons, the user must have the `Administrator` permission. The `View Group Buys` button can be clicked by anyone.

    // the `Create a Group Buy` button will open a modal that allows the user to create a group buy. The modal will have a text input for the group buy name, a text input for the group buy description, a text input for the group buy total, and a text input for the group buy channel. The user will be able to click the `Create Group Buy` button to create the group buy.

    // INTERACTION INPUT
    const { options } = interaction;
    const target = options.getChannel("target-channel");
    const userId = interaction.user.id;
    const user = interaction.user;

    const role1 = options.getRole("role1");
    const role2 = options.getRole("role2");
    const roles = [role1 ? role1 : null, role2 ? role2 : null];

    // create an obj that includes all possible interaction and message information that will be uploaded to the database and saved for later use
    // need the user who created the interaction, the channel the interaction was created in, the message, time stamp, user data, interaction data, and message data
    const optionsObj = {
      userId: userId,
      user: user,
      target: target,
      roles: roles,
      interaction: interaction,
      message: interaction.message,
      timeStamp: interaction.createdTimestamp,
      userData: interaction.user.toJSON(),
      interactionData: interaction.toJSON(),
      messageData: interaction.message.toJSON(),
    };
    // deconstruct the message data from interaction.message

    client.emit("save-initial-interaction-information", optionsObj);
  },
};
