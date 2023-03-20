const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
module.exports = {
  // object: a slash command that gets info about a user
  data: new SlashCommandBuilder()
    // string: the name of the command
    .setName("whois")
    // string: the description of the command
    .setDescription("get info about a user.")
    // object: an option that allows the user to specify the target user
    .addUserOption((option) =>
      option
        // string: the name of the option
        .setName("target")
        // string: the description of the option
        .setDescription("User to get to know more about.")
        // boolean: whether the option is required to use the command
        .setRequired(true)
    ),

  // async function: the function to execute when the command is used
  async execute(interaction) {
    // destructured object: the options passed to the command
    const { options } = interaction;

    // object: the member object for the target user
    const member = options.getMember("target");
    // object: an object containing information about the member
    const memberInfoObj = scripts_djs.getMemberInfoObj(member);
    // destructured object: variables representing various information about the member
    const {
      name,
      displayName,
      userId,
      avatar,
      role,
      joined,
      created,
      messages,
      kicks,
      bans,
      warns,
    } = memberInfoObj;

    // function call: logs the messages variable to the console
    scripts.cLog(messages);
    // object: the embed object to be sent as a message

    function getSuffix(day) {
      const suffixes = ["st", "nd", "rd", "th"];
      const lastDigit = day % 10;
      if (lastDigit === 1) {
        return suffixes[0];
      } else if (lastDigit === 2) {
        return suffixes[1];
      } else if (lastDigit === 3) {
        return suffixes[2];
      } else {
        return suffixes[3];
      }
    }

    function formatDate(str) {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];    
      const date = new Date(str);
      const month = months[date.getMonth()];
      const day = date.getDate();
      const suffix = getSuffix(day);
      const year = date.getFullYear();
      const dateStr = `${month} ${day}${suffix} ${year}`;
    
      const now = new Date();
      const timeDiff = now - date;
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      const timeSpent = `${days !== 1 ? `${days} Days` : `${days} Day` } ${hours !== 1 ? `${hours} Hours` : `${hours} Hour`} ${minutes !== 1 ? `${minutes} minutes` : `${minutes} minute`} & ${seconds !== 1 ? `${seconds} seconds` : `${seconds} second` }`;
    
      return { date: dateStr, timeSpent };
    }

    let createObj = formatDate(created);
    let joinObj = formatDate(joined);
    let createdDate = createObj.date;
    let createdTime = createObj.timeSpent;
    let joinedDate = joinObj.date;
    let joinedTime = joinObj.timeSpent;

    let createStr = `\`${createdDate}\`\n\n\`${createdTime} ago\``;
    let joinStr = `\`${joinedDate}\`\n\n\`${joinedTime} ago\``;
    const embedObj = {
      // string: the title of the embed
      title: `${displayName} User Info`,
      // string: the description of the embed
      description: `**Name:** ${name}\n**Role:** ${role}`,
      // string: the color of the embed
      color: `${scripts.getColor()}`,
      // array: the field objects for the embed
      fields: [
        {
          // string: the name of the field
          name: `Joined the Server`,
          // string: the value of the field
          value: joinStr,
          // boolean: whether the field should be displayed inline with other fields (true) or on a new line (false)
          inline: true,
        },
        {
          // string: the name of the field
          name: `Joined Discord`,
          // string: the value of the field
          value: createStr,
          // boolean: whether the field should be displayed inline with other fields (true) or on a new line (false)
          inline: true,
        },
        {
          // string: the name of the field
          name: `Total Number of Bans ${displayName} has Received in the Server`,
          // string: the value of the field
          value: bans === undefined ? 0 : bans,
          // boolean: whether the field should be displayed inline with other fields (true) or on a new line (false)
          inline: true,
        },
        {
          // string: the name of the field
          name: `Total Number of Kicks ${displayName} has Received in the Server`,
          // string: the value of the field
          value: kicks === undefined ? 0 : kicks,
          // boolean: whether the field should be displayed inline with other fields (true) or on a new line (false)
          inline: true,
        },
        {
          // string: the name of the field
          name: `Total Number of Warnings ${displayName} has Received in the Server`,
          // string: the value of the field
          value: warns === undefined ? 0 : warns,
          // boolean: whether the field should be displayed inline with other fields (true) or on a new line (false)
          inline: true,
        },
      ],
      // string: the URL of the thumbnail image to display in the embed
      thumbnail: avatar,
      // object: the footer object for the embed
      footer: {
        // string: the text for the footer
        text: `User Info Request by: ${interaction.user.username}`,
        // string: the URL for the icon to display in the footer
        icon_url: interaction.user.avatarURL(),
      },
    };
    // object: an embed object for an error message
    const errEmbed = new EmbedBuilder()
      // string: the description of the error message
      .setDescription(
        `An Error Occurred while retrieving information about : ${name}`
      )
      // number: the color of the error message embed
      .setColor(0xc72c3b);
    // object: the embed object to be sent as a message, created using the `createEmbed` function and the `embedObj` object
    const memberInfoEmbed = createEmb.createEmbed(embedObj);

    try {
      // function call: sends the member info embed to the channel
      await interaction.reply({ embeds: [memberInfoEmbed], ephemeral: true  });
      // console log: indicates that the request was accepted
      console.log(`whois Request Accepted: ✅`);
    } catch (error) {
      // console log: indicates that the request was denied
      console.log(`whois Request Denied: ❌`);
      try {
        // function call: sends the error embed to the user (ephemeral message)
        await interaction.reply({ embeds: [errEmbed], ephemeral: true });
      } catch (error) {
        // function call: logs the error message and a custom string
        scripts.logError(error, `Failed sending error embed to the user`);
      }
      // function call: logs the error message and a custom string
      scripts.logError(error, `Failed Member Info Embed Attempt`);
    }
    // console log: indicates that the command execution is complete
    console.log(`whois Command Complete: ✅`);
  },
};
