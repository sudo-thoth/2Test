const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Message,
} = require("discord.js");

const createEmb = require("../../functions/create/createEmbed.js");

const scripts = require("../../functions/scripts/scripts.js");

const client = require(`../../index.js`);

const fetchMessages = async (channel, num, messageType, interaction) => {
  const fetchedMessages = [];
  let continueFetching = true;
  let currentLoop = 0;
  let startTime, endTime, avgTimePerLoop;
  let lastMessageId;

  const validMessageTypes = ["bot", "non-bot", "all", "link", "file", "audio", "video", "image"];

  if (!messageType || !validMessageTypes.includes(messageType)) {
    try {
      await interaction.editReply("Invalid or no message type provided. Please specify a valid message type: bot, non-bot, all, link, file, audio, video, image.");
    } catch (error) {
      console.error("Failed to send reply", error);
    }
    throw new Error("Invalid or no message type provided.");
  }

  try {
    while (continueFetching && (num ? fetchedMessages.length < num : true)) {
      currentLoop++;
      startTime = startTime || Date.now();

      const limit = num ? Math.min(100, num - fetchedMessages.length) : 100;
      const messages = await channel.messages.fetch({ limit, before: lastMessageId });

      if (messages.size === 0) {
        continueFetching = false;
      } else {
        let filteredMessages = messages.filter(message => {
          switch (messageType) {
            case "bot":
              return message.author.bot;
            case "non-bot":
              return !message.author.bot;
            case "all":
              return true;
            case "link":
              return message.content.includes("http");
            case "file":
              return message.attachments && message.attachments.size > 0;
            case "audio":
            case "video":
            case "image":

              return (message.author.id !== interaction.client.user.id) && message.attachments.some(attachment => attachment.contentType.startsWith(messageType));
            default:
              return false;
          }
        });

        fetchedMessages.push(...filteredMessages.values());

        if (num && fetchedMessages.length >= num) {
          continueFetching = false;
        }
      }

      lastMessageId = messages.last()?.id;

      if (currentLoop % 3 === 0) {
        endTime = Date.now();
        avgTimePerLoop = (endTime - startTime) / currentLoop;
        const loopsLeft = num ? Math.ceil((num - fetchedMessages.length) / 100) : "unknown";
        // variable for seconds per 100 batch fetch
        const loopsRate = avgTimePerLoop / 1000;
        const estimatedSecondsLeft = loopsLeft * avgTimePerLoop / 1000;

        console.log(`Estimated time left: ${estimatedSecondsLeft.toFixed(2)} seconds`);

        // You can use the interaction to edit the reply and inform the user about the estimated time left:
        // await interaction.editReply(`Estimated time left: ${estimatedSecondsLeft.toFixed(2)} seconds`);
      }
    }

    console.log("Fetching completed. Total messages fetched:", fetchedMessages.length);
    const result = fetchedMessages.slice(0, num || fetchedMessages.length);

    if (result.length === 0) {
      try {
        await interaction.editReply("No messages found in the channel that match the specified criteria.");
      } catch (error) {
        if(error.message.toLowerCase().includes("unknown interaction")) {
          console.log("No interaction to edit");
          return [];
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Failed Fetch Attempt", error);
  }
};

const deleteMessages = async (channel, messages, interaction) => {
  // Check if the bot has necessary permissions
  let me = await interaction?.guild?.members?.fetchMe();
  const botPermissions = me?.permissions?.has("ManageMessages");

  if (!botPermissions) {
    try {
      await interaction.editReply(
        "The bot lacks the required permissions to delete messages. Please grant the 'Manage Messages' permission."
      );
    } catch (error) {
      console.error("Failed to send reply", error);
    }
    return false;
  }

  // Split messages into two arrays: under 14 days old and over 14 days old
  const now = Date.now();
  const bulkDeleteMessages = messages.filter(
    (message) => now - message.createdTimestamp < 14 * 24 * 60 * 60 * 1000
  );
  const singleDeleteMessages = messages.filter(
    (message) => now - message.createdTimestamp >= 14 * 24 * 60 * 60 * 1000
  );

  const bulkDeleteIds = bulkDeleteMessages.map((message) => message.id);
  const singleDeleteIds = singleDeleteMessages.map((message) => message.id);

  let currentLoop = 0;
  let startTime, endTime, avgTimePerLoop;
  startTime = Date.now();

  try {
    // Inform user about the start of the deletion process
    await interaction.editReply(
      `Starting deletion process. Bulk deletion first, then single deletion.`
    );

    // Bulk delete messages under 14 days old
    while (bulkDeleteIds.length > 0) {
      currentLoop++;
      const batch = bulkDeleteIds.splice(0, 100);
      try {
        await channel.bulkDelete(batch);
      } catch (error) {
        console.error("Failed to bulk delete messages", error);
        return false;
      }

      endTime = Date.now();
      avgTimePerLoop = (endTime - startTime) / currentLoop;
      const batchesLeft = Math.ceil(bulkDeleteIds.length / 100);
      const estimatedSecondsLeft = batchesLeft * avgTimePerLoop / 1000;

      // Inform the user about the progress of the bulk deletion
      await interaction.editReply(
        `Bulk deletion in progress. Deleted ${currentLoop * 100} messages so far. Estimated time left: ${estimatedSecondsLeft.toFixed(
          2
        )} seconds.`
      );
    }

    // Inform user that bulk deletion is complete and single deletion will start
    await interaction.editReply(
      `Bulk deletion complete. Starting single message deletion.`
    );

    // Reset currentLoop and startTime for single deletion
    currentLoop = 0;
    startTime = Date.now();

    // Delete messages over 14 days old one by one
    for (const id of singleDeleteIds) {
      currentLoop++;
      try {
        const message = await channel.messages.fetch(id);
        if (message) {
          await message.delete();
        }
      } catch (error) {
        console.error("Failed to delete single message", error);
      }

      endTime = Date.now();
      avgTimePerLoop = (endTime - startTime) / currentLoop;
      const messagesLeft = singleDeleteIds.length;
      const estimatedSecondsLeft = messagesLeft * avgTimePerLoop / 1000;

      // Inform the user about the progress of the single deletion
      await interaction.editReply(
        `Single deletion in progress. Deleted ${currentLoop} messages so far. Estimated time left: ${estimatedSecondsLeft.toFixed(
          2
        )} seconds.`
      );
        }

    // Inform user that the deletion process is complete
    await interaction.editReply(
      `Deletion process complete. Deleted a total of ${bulkDeleteIds.length * 100 + currentLoop} messages.`
    );

    console.log("Deletion completed. All messages deleted successfully.");
    return true;
  } catch (error) {
    console.error("Failed Deletion Attempt", error);
    return false;
  }
};

      


module.exports = {
  data: new SlashCommandBuilder()
    .setName("wipe")
    .setDescription(
      "Wipe Messages from a channel"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
    option
      .setName("choice")
      .setDescription("Wipe Based on a Specific Criteria")
      .setRequired(true)
      .addChoices(
        {name: "Bot Messages", value: "bot"},
        {name: "Non-Bot Messages", value: "non-bot"},
        {name: "All Messages", value: "all"},
        {name: "Messages with Links", value: "link"},
        {name: "Messages with Any Files", value: "file"},
        {name: "Messages with Audio", value: "audio"},
        {name: "Messages with Video(s)", value: "video"},
        {name: "Messages with Image(s)", value: "image"},
        )
  )
  .addIntegerOption((option) =>
        option
          .setName("num")
          .setDescription("The number of messages to wipe")
          .setRequired(false)

      )
          
    ,
    fetchMessages,

  async execute(interaction) {
    const { channel, options } = interaction;
    const type = options.getString("choice");
    const amount = options?.getInteger("num");

try{
  await interaction.deferReply({ephemeral:true})
} catch(error){
console.log(`Failed to defer reply:`, error);
// try{
// await interaction.reply({content: `Failed to defer reply: ${error}`, ephemeral: true})
// } catch(error){
// console.log(`Failed to send error reply:`, error);
// }
return;
}
    // if (amount > 100) {
    //   const errEmbed = new EmbedBuilder()
    //     .setDescription(`You can only wipe up to 100 messages at a time.`)
    //     .setColor(0xc72c3b);
    //   console.log(`wipe Command Failed to Execute: ❌`);
    //   return interaction.editReply({ embeds: [errEmbed] });
    // }

    // let messages;

    // try {
    //   messages = await channel.messages.fetch({
    //     limit: amount + 1,
    //   });
    // } catch (error) {
    //   console.error(`Failed Fetch Attempt`, error);
    // }

    // fetch the messages

    let msgsToWipe = await fetchMessages(channel, amount, type, interaction);

    if (!msgsToWipe) {
      const errEmbed = new EmbedBuilder()

        .setDescription(`Failed to fetch messages.`)
        .setColor(0xc72c3b);
      console.log(`wipe Command Failed to Execute: ❌`);
      return interaction.editReply({ embeds: [errEmbed] });
    }

    // delete the messages

    const success = await deleteMessages(channel, msgsToWipe, interaction);

    if (!success) {
      const errEmbed = new EmbedBuilder()
        .setDescription(`Failed to delete messages.`)
        .setColor(0xc72c3b);
      console.log(`wipe Command Failed to Execute: ❌`);
      return interaction.editReply({ embeds: [errEmbed] });
    }

    const successEmbed = new EmbedBuilder()
      .setDescription(`Successfully deleted ${msgsToWipe.length} ${type} messages.`)
      .setColor(0x00ff00);

      // send success message

    try {
      await interaction.editReply({ content: `<@${interaction.user.id}>`,embeds: [successEmbed] });
    } catch (error) {
      console.error(`Failed to send reply`, error);
    }


    console.log(`wipe Command Complete: ✅`);
  }
};
