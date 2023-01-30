const createEmb = require("../create/createEmbed.js");
const scripts = require("../scripts/scripts.js");
const createBtn = require("../create/createButton.js");
const createActRow = require("../create/createActionRow.js");
const createSelMenu = require("../create/createSelectMenu.js");
const axios = require("axios").default;

function krakenWebScraper(url, type){
  let link = '';
  if (!url) {
    return;
  }
  axios.get(url).subscribe(
    (response) => {
      const html = response.data; // html
      switch (type) {
        case 'audio':
      link = html
        .split("\n")
        .filter((line) => line.includes("m4a:"))[0]
        .trim()
        .substring(6)
        .replace("'", "");
      link = "https:" + link;
      break;
      case 'video':
      link = html
        .split("\n")
        .filter((line) => line.includes("m4a:"))[0]
        .trim()
        .substring(6)
        .replace("'", "");
      link = "https:" + link;
      break;
      default:
        break;
      }
    },
    (error) => {
      console.log(error);
    }
  );
  return link;

}

/**
 * Returns an object with information about the member.
 *
 * @param {Object} member - The member object from which to get the information
 *
 * @returns {Object} An object with information about the member.
 *
 * @throws {Error} If there is an error getting the information or if the member is not an object
 */
function getMemberInfoObj(member){
  let obj;
  // check to make sure the member is an object
  if (typeof member !== "object") {
    try {
      throw new Error("The member is not an object");
    } catch (error) {
      scripts.logError(error);
    }
  } else {
    try {
    obj = {
      // get the user name of the user who triggered the interaction
      name: `${member.user.username}`,
      displayName: `${member.displayName}`,
      // get the user id of the user who triggered the interaction
      userId: `${member.user.id}`,
      // get the user avatar of the user who triggered the interaction
      avatar: `${member.user.avatarURL()}`,
      // get the user role of the user who triggered the interaction
      role: `${member.roles.highest.name}`,
      // get the date the user joined the server
      joined: `${member.joinedAt}`,
      // get the date the user joined discord
      created: `${member.user.createdAt}`,
      // get the number of times the user has been kicked
      kicks: `${member.user.kicks === undefined ? 0 : member.user.kicks}`,
      // get the number of times the user has been banned
      bans: `${member.user.bans === undefined ? 0 : member.user.bans}`,
      // get the number of times the user has been warned
      warns: `${member.user.warns === undefined ? 0 : member.user.warns}`,

    }
    return obj;
  } catch (error) {
    scripts.logError(error, "Error creating member object");
  }
    
  }
}

/**
 * Returns a string of a bulleted list of every command found.
 *
 * @param {Object} client - The client object from which to get the commands.
 * @param {string[]} exclude - An array of command names to exclude from the list.
 *
 * @returns {string} A string of a bulleted list of commands.
 *
 * @throws {Error} If there is an error getting the commands.
 *
 * @example
 * getCommands(client, ['command1', 'command2']); // returns a string of a bulleted list of commands except 'command1' and 'command2'
 */
function getCommands(client, exclude = []) {
  try {
    // Get the commands array from the client object.
    const commands = client.commands;
    // Initialize a variable to store the string of the bulleted list.
    let listString = '';
    // Iterate through the commands array and for each command, append a string to listString that consists of a bullet point and the command name.
    commands.forEach(command => {
      if (!exclude.includes(command.data.name)) {
      listString += '\n- \`/' + `${command.data.name}` + '\`';
      }
    });
    // Return the listString variable.
    return listString;
  } catch (error) {
    // Log the error message and a descriptive message using the logError function.
    scripts.logError(error, "Error getting commands");
  }
}

/**
 * Returns an object with information about the interaction
 *
 * @param {Object} interaction - The interaction object from which to get the information
 *
 * @returns {Object} An object with information about the interaction
 *
 * @throws {Error} If there is an error getting the information or if the interaction is not an object
 */
function getInteractionObj(interaction){
  // check to make sure the interaction is an object
  if (typeof interaction !== "object") {
    try {
      throw new Error("The interaction is not an object");
    } catch (error) {
      scripts.logError(error);
    }
  } else {
    try {
    let obj = {
      id: `${interaction.id}`,
      channel: `${interaction.channel}`,
      guild: `${interaction.guild}`,
      userInfo: {
        // get the user name of the user who triggered the interaction
      name: `${interaction.member.user.username}`,
        displayName: `${interaction.member.displayName}`,
      // get the user id of the user who triggered the interaction
      userId: `${interaction.member.user.id}`,
      // get the user avatar of the user who triggered the interaction
      avatar: `${interaction.member.user.avatarURL()}`,
      // get the user role of the user who triggered the interaction
      role: `${interaction.member.roles.highest.name}`,
      // get the user role id of the user who triggered the interaction
      roleID: `${interaction.member.roles.highest.id}`,
      // get the user role name of the user who triggered the interaction
      roleName: `${interaction.member.roles.highest.name}`
      }
    }
    return obj;
  } catch (error) {
    scripts.logError(error, "Error creating interaction object");
  }
  }
  }


// File Size Too Big Elements
const embed_FileSizeTooBig = (interaction) => {
return createEmb.createEmbed({
  title: `File Size TOO BIG`,

  description: `Choose a how you would like to proceed`,
  color: 'RANDOM_COLOR_PLACEHOLDER',
  footer: {
      // string: the text for the footer
      text: `After choosing Option 1 you must re-enter the slash command`,
      // Might need to pass the interaction object to this function
      iconURL: interaction.user.avatarURL()
  },
  thumbnail: 'https://media.giphy.com/media/VJY3zeoK87CLBKnqqm/giphy.gif',
  fields: [{
    name: "Option 1 : Compress",
    value: `***Most Popular***\n~Click the Compress button to compress and get a smaller sized version of the same file\n~Then once you have downloaded the compressed version, press the Start Over button\n~Enter a new \`/slash command\` with the compressed file`,
    inline: true,
  },
  // Add JumpShare in place of Onlyfiles
  { name: "Option 2: Get Shareable Link", value: `used for most audio files\nConvert your file to a link via Kraken Files, WeTranser, or JumpShare`, inline: true }
  ]
});
}

const row_FileSizeTooBig = createActRow.createActionRow({
  components: [
   createBtn.createButton({
      customID: "compress",
      label: "🗜️ Compress File",
      style: "primary",
      }),
     createBtn.createButton({
        customID: "sharelink",
        label: "📤 Get Shareable Link",
        style: "primary",
      }),
  ],
});

// Announcement Elements
const embed_Announcement_NoFile = (interaction) => {
return createEmb.createEmbed({
  title: `Send An Announcement`,
  description: `*You did not provide a file to send, __if you would like to send a file please redo__ the* \`/announce\` *slash command with the file attached*`,
  color: `${scripts.getColor()}`,
  footer: {
      text: `Choose a how you would like to proceed`,
      iconURL: interaction.user.avatarURL()
  },
  thumbnail: `${interaction.guild.iconURL() ? interaction.guild.iconURL() : null}`,
  fields: [
    {
      name: "Send a Type of Leak or Snippet",
      value: `select one of the leak options below`,
      inline: true,
    },
    { name: "Group Buy", value: `Go to the GroupBuy Menu to share information about a GB`, inline: true },
  { name: "Custom Announcement", value: `basically means just any type of announcement that isn't a leak`, inline: false },
  ]
});
}
const embed_Announcement_File = (interaction) => {
  return createEmb.createEmbed({
    title: `Send An Announcement`,
    description: `Choose a how you would like to proceed`,
    color: `${scripts.getColor()}`,
    footer: {
        iconURL: interaction.user.avatarURL()
    },
    thumbnail: `${interaction.guild.iconURL()}`,
    fields: [
      {
        name: "Send a Type of Leak or Snippet",
        value: `select one of the leak options below`,
        inline: true,
      },
      { name: "Group Buy", value: `Go to the GroupBuy Menu to share information about a GB`, inline: true },
    { name: "Custom Announcement", value: `basically means just any type of announcement that isn't a leak`, inline: false },
    ]
  });
}

const button_NewLeak = (id) => {
  return createBtn.createButton({
  customID: `newleak${id}`,
  label: `New Leak`,
  style: `danger`,
});
}
const button_NewOGFile = (id) => {
  return createBtn.createButton({
  customID: `ogfile${id}`,
  label: `New OG File Leak`,
  style: `danger`,
});
}
const button_NewStudioSession = (id) => {
  return createBtn.createButton({
  customID: `studiosession${id}`,
  label: `New Studio Sessions`,
  style: `danger`,
});
}
const button_NewSnippet = (id) => {
 return createBtn.createButton({
  customID: `snippet${id}`,
  label: `New Snippet`,
  style: `danger`,
});
}
const button_CustomAnnouncement = (id) => {
  return createBtn.createButton({
  customID: `custom${id}`,
  label: `Custom Announcement`,
  style: `primary`,
});
}
const button_GroupBuy = (id) => {
  return createBtn.createButton({
  customID: `groupbuybtn${id}`,
  label: `Group Buy`,
  style: `secondary`,
});
}

// Returns a promise ; So must await when calling this function
const row2_Announcement = (id) => {
  let row = createActRow.createActionRow({
  components: [
    button_NewLeak(id),
    button_NewOGFile(id),
    button_NewStudioSession(id),
    button_NewSnippet(id),
    button_GroupBuy(id),
  ],
});
return row; // a promise
}
const row_Announcement = (id) => {
  let row = createActRow.createActionRow({
  components: [
    button_CustomAnnouncement(id)
  ],
});
return row; // a promise
}





module.exports = {
  getInteractionObj,
  getMemberInfoObj,
  getCommands,
  krakenWebScraper,
  embed_FileSizeTooBig,
  row_FileSizeTooBig,
  embed_Announcement_NoFile,
  embed_Announcement_File,
  row_Announcement,
  row2_Announcement,
  button_NewLeak,
  button_NewOGFile,
  button_NewStudioSession,
  button_NewSnippet,
  button_CustomAnnouncement,
}