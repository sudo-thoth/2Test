const createEmb = require("../create/createEmbed.js");
const scripts = require("../scripts/scripts.js");
const createBtn = require("../create/createButton.js");
const createActRow = require("../create/createActionRow.js");
const createMdl = require("../create/createModal.js");
const createSelMenu = require("../create/createSelectMenu.js");
const axios = require("axios").default;
const scripts_mongoDB = require("../scripts/scripts_mongoDB.js");
const announcementData = require("../../../MongoDB/db/schemas/schema_announcement.js");
const {
  EmbedBuilder,
  PermissionsBitField,
  Collection,
  AttachmentBuilder,
} = require("discord.js");
const fetchedFiles = require("../../../MongoDB/db/schemas/schema_fetchedFiles.js");
const mongoose = require("mongoose");
const fileNames = new Collection();

function extractM4Aurl(str) {
  let res = str.match(/m4a:(.*)/);

  return res && res[1];
}

async function krakenFileSizeFinder(url, interaction){
  if (typeof url !== 'string') return;

  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    await throwNewError(`there is no data to scrape at this url: ${url}`, interaction, error)
    return;
  }
  const regex = /<div class="sub-text">File size<\/div>\n\s*<div class="lead-text">(.+)<\/div>/;
const match = data.match(regex);
let fileSize = 0;
if (match) {
fileSize = match[1];
console.log(fileSize);
} else {
try {
throw new Error('Could not find kraken file size');
} catch (error) {
await throwNewError("", interaction, error)

}
}
  return fileSize;
};

async function krakenFileTypeFinder(url, interaction){
  if (typeof url !== 'string') return;

  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    await throwNewError(`there is no data to scrape at this url: ${url}`, interaction, error)
    return;
  }
  const regex = /<div class="sub-text">Type<\/div>\n\s*<div class="lead-text">(.+)<\/div>/;
const match = data.match(regex);
let type;
if (match) {
  type = match[1];
console.log(type);
} else {
try {
throw new Error('Could not find kraken file type');
} catch (error) {
await throwNewError("file type retrieval", interaction, error)

}
}
  return type;
};

async function krakenTitleFinder(url, interaction){
  if (typeof url !== 'string') return;

  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    console.log(`there is no data to scrape at this url: ${url}`)
    console.log(`error`, error)
    return;
  }

try {
    const titleLine = data.split("\n").filter((line) => line.includes(`<meta property="og:title" content=`))[0];
    const matches = titleLine.match(/content="(.*)"/);
    const fileName = matches[1];
  
    return fileName;
} catch (error) {
  await throwNewError(`there is no data to scrape at this url: ${url}`, interaction, error)
  
}

};

async function krakenWebScraper(url, batch_id, interaction){
  if (typeof url !== 'string') return;

  let data;
  try {
    data = await (await fetch(url)).text();
  } catch (error) {
    console.log(`there is no data to scrape at this url: ${url}`)
    console.log(`error`, error)
    return;
  }
  let fileName;
  let type = await krakenFileTypeFinder(url, interaction);

  if (type === 'mp3') {
    
    const tempLine = data.split("\n").filter((line) => line.includes("m4a:"))[0];
    const titleLine = data.split("\n").filter((line) => line.includes(`<meta property="og:title" content=`))[0];
    const matches = titleLine.match(/content="(.*)"/);
    fileName = matches[1];
  console.log(`the url line`, tempLine);
  let x = extractM4Aurl(tempLine);
  x = x.replace(/'/g, '').replace('//', '');
  // replace all spaces inthe string
  x = x.replace(/ /g, '');
  x= `https://` + x;
  } else if (type === 'zip') {
    fileName = await krakenTitleFinder(url, interaction);
    x= url;
  }
saveKrakenBatch(x, fileName, url, batch_id, interaction)

  return x;
};



let getAlertEmoji = () => {
  let alertEmojis = [
    `🫵🏿`,
    `🛎️`,
    `📬`,
    `💌`,
    `🆕`,
    `🔔`,
    `📣`,
    `📢`,
    `📳`,
    `🪬`,
  ];
  let random = Math.floor(Math.random() * alertEmojis.length);
  return alertEmojis[random];
};

/**
 * Returns an object with information about the member.
 *
 * @param {Object} member - The member object from which to get the information
 *
 * @returns {Object} An object with information about the member.
 *
 * @throws {Error} If there is an error getting the information or if the member is not an object
 */
function getMemberInfoObj(member) {
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
      };
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
    let listString = "";
    // Iterate through the commands array and for each command, append a string to listString that consists of a bullet point and the command name.
    commands.forEach((command) => {
      if (!exclude.includes(command.data.name)) {
        listString += "\n- `/" + `${command.data.name}` + "`";
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
function getInteractionObj(interaction) {
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
        customID: `${interaction.customId}`,
        channel: `${interaction.channel}`,
        guild: `${interaction.guild}`,
        member: `${interaction.member}`, // ex: <@975944168373370940> (user id) not an object
        memberPerms: `${interaction.member.permissions}`, // ex:
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
          // get the array of roles the user who triggered the interaction has
          roles: interaction.member.roles,
        },
      };
      return obj;
    } catch (error) {
      scripts.logError(error, "Error creating interaction object");
    }
  }
}

function extractID(str) {
  if (str === undefined) return;
  console.log(`THE STRING:`, str);
  if (str.includes("#")) {
    let id = `#${str.split("#")[1]}`;
    return id;
  } else {
    try {
      throw new Error("The string does not contain a #");
    } catch (error) {
      scripts.logError(error, str);
    }
  }
}

// File Size Too Big Elements
const embed_FileSizeTooBig = (interaction) => {
  return createEmb.createEmbed({
    title: `File Size TOO BIG`,

    description: `Choose a how you would like to proceed`,
    color: "RANDOM_COLOR_PLACEHOLDER",
    footer: {
      // string: the text for the footer
      text: `After choosing Option 1 you must re-enter the slash command`,
      // Might need to pass the interaction object to this function
      iconURL: interaction.user.avatarURL(),
    },
    thumbnail: "https://media.giphy.com/media/VJY3zeoK87CLBKnqqm/giphy.gif",
    fields: [
      {
        name: "Option 1 : Compress",
        value: `***Most Popular***\n~Click the Compress button to compress and get a smaller sized version of the same file\n~Then once you have downloaded the compressed version, press the Start Over button\n~Enter a new \`/slash command\` with the compressed file`,
        inline: true,
      },
      // Add JumpShare in place of Onlyfiles
      {
        name: "Option 2: Get Shareable Link",
        value: `used for most audio files\nConvert your file to a link via Kraken Files, WeTranser, or JumpShare`,
        inline: true,
      },
    ],
  });
};

const row_FileSizeTooBig = async () =>
  await createActRow.createActionRow({
    components: [
      await createBtn.createButton({
        customID: "compress",
        label: "🗜️ Compress File",
        style: "primary",
      }),
      await createBtn.createButton({
        customID: "sharelink",
        label: "📤 Get Shareable Link",
        style: "primary",
      }),
    ],
  });

// Announcement Elements
// // Embeds
const embed_NoPermission = (interaction) => {
  if (!interaction) return;
  if (interaction.isCommand()) {
    let commandName = interaction.commandName;
    // let command = client.commands.get(commandName);
    // if (command.permissions) {
    //   let userPerms = interaction.member.permissions;
    //   let commandPerms = command.permissions;
    //   if (!userPerms.has(commandPerms)) {

    return createEmb.createEmbed({
      title: `You do not have permission to use the ${commandName} command`,
      thumbnail: ``,
      color: scripts.getColor(), // random color
    });
  } else {
    return createEmb.createEmbed({
      title: `You do not have permission to use this`,
      thumbnail: ``,
      color: scripts.getColor(), // random color
    });
  }
};

const embed_Announcement_NoFile = (interaction, randID) => {
  let embed = createEmb.createEmbed({
    title: `Send An Announcement`,
    description: `*You did not provide a file to send, __if you would like to send a file please redo__ the* \`/announce\` *slash command with the file attached*`,
    color: `${scripts.getColor()}`,
    footer: {
      text: `Choose a how you would like to proceed`,
      iconURL: interaction.user.avatarURL(),
    },
    thumbnail: `${
      interaction.guild.iconURL() ? interaction.guild.iconURL() : null
    }`,
    fields: [
      {
        name: "Send a Type of Leak or Snippet",
        value: `select one of the leak options below`,
        inline: true,
      },
      {
        name: "Group Buy",
        value: `Go to the GroupBuy Menu to share information about a GB`,
        inline: true,
      },
      {
        name: "Custom Announcement",
        value: `basically means just any type of announcement that isn't a leak`,
        inline: false,
      },
    ],
  });
  return embed;
};
const embed_Announcement_File = (interaction, randID) => {
  let embed = createEmb.createEmbed({
    title: `Send An Announcement`,
    description: `Choose a how you would like to proceed`,
    color: `${scripts.getColor()}`,
    footer: {
      iconURL: interaction.user.avatarURL(),
    },
    thumbnail: `${interaction.guild.iconURL()}`,
    fields: [
      {
        name: "Send a Type of Leak or Snippet",
        value: `select one of the leak options below`,
        inline: true,
      },
      {
        name: "Group Buy",
        value: `Go to the GroupBuy Menu to share information about a GB`,
        inline: true,
      },
      {
        name: "Custom Announcement",
        value: `basically means just any type of announcement that isn't a leak`,
        inline: false,
      },
    ],
  });
  return embed;
};
// // Buttons

const linkButton = (label, url) => {
  let button = createBtn.createButton({
    link: url,
    label: label,
    style: "link",
  });
  return button;
};
const button_NewLeak = (randID) => {
  let button = createBtn.createButton({
    customID: `newleak${randID}`,
    label: `New Leak`,
    style: `danger`,
  });
  return button;
};
const button_NewOGFile = (randID) => {
  let button = createBtn.createButton({
    customID: `ogfile${randID}`,
    label: `New OG File Leak`,
    style: `danger`,
  });
  return button;
};
const button_NewStudioSession = (randID) => {
  let button = createBtn.createButton({
    customID: `studiosession${randID}`,
    label: `New Studio Sessions`,
    style: `danger`,
  });
  return button;
};
const button_NewSnippet = (randID) => {
  let button = createBtn.createButton({
    customID: `snippet${randID}`,
    label: `New Snippet`,
    style: `danger`,
  });
  return button;
};
const button_CustomAnnouncement = (randID) => {
  let button = createBtn.createButton({
    customID: `custom${randID}`,
    label: `Custom Announcement`,
    style: `primary`,
  });
  return button;
};
const button_GroupBuy = (randID) => {
  let button = createBtn.createButton({
    customID: `groupbuybtn${randID}`,
    label: `Group Buy`,
    style: `secondary`,
  });
  return button;
}; // TODO: Make an embed w actionrows w buttons for the group buy button

// on button confirm interaction, call a function that sends the final message to the target channel and pings the roles
// send attachment as buttons
// let one button be a download button for the attachment and the other button cause the attachment to be sent into the channel as an ephemeral message replying to the user and a third button that sends the attachment as a file to the users direct messages
const button_Confirm = (randID) => {
  let button = createBtn.createButton({
    customID: `confirm${randID}`,
    label: `Confirm`,
    style: `success`,
  });
  return button;
};
// on button cancel interaction, disable all buttons
const button_Cancel = (randID) => {
  let button = createBtn.createButton({
    customID: `cancel${randID}`,
    label: `Cancel`,
    style: `danger`,
  });
  return button;
};

async function fileCheck(link) {
  console.log("🚀 ~ Initiating fileCheck.js ~ line 5");

  if (typeof link !== "string") {
    console.log(
      "Link is not a string, returning empty handed, therefor undefined"
    );
    return null;
  } else {
    // need to check last four char to be either .jpg .png .mp3 .mp4 .m4a or .jpeg to be defined as a file, then check size of only the files
    console.log(
      `Checking Link File Size  : ${link} . . . line 12 fileCheck.js`
    );
    const response = await fetch(link, { method: "HEAD" });
    const size = response.headers.get("content-length");
    // console.log(`Size : ${size} Vs. ${8 * 1024 * 1024}`);

    if (
      link.includes(".mov") ||
      size >= 8 * 1024 * 1024 ||
      size === null ||
      size === undefined
    ) {
      console.log("Invalid File Size, will send as message instead");
      console.log(`The link used : ${link}\nThe Size of Link : ${size}`);
      return false;
    } else {
      console.log("Valid File Size, sending as file");
      console.log(`COMPLETE : fileCheck()`);
      return true;
    }
  }
}
const button_Download = async (randID, mute) => {
  let doc = await scripts_mongoDB.getData(randID);
  let attachmentURL;
  if (doc) {
    attachmentURL = doc.attachmentURL;
  } else {
    attachmentURL = "https://google.com/";
  }
  console.log(`attachmentURL : ${attachmentURL}`);
  let button = createBtn.createButton(
    {
      link: attachmentURL,
      label: `Download`,
      style: `link`,
      disabled: mute,
    },
    randID
  );
  return button;
};

const button_View = (randID, mute) => {
  let button = createBtn.createButton({
    customID: `view__${randID}`,
    label: `View`,
    style: `primary`,
    disabled: mute,
  });
  return button;
};

const button_DirectMessage = (randID, mute) => {
  let button = createBtn.createButton({
    customID: `directmessage${randID}`,
    label: `Direct Message`,
    style: `secondary`,
    disabled: mute,
  });
  return button;
};

// // Action Rows
// Returns a promise ; So must await when calling this function
const row2_Announcement = async (randID) => {
  let row = createActRow.createActionRow({
    components: [
      await button_NewLeak(randID),
      await button_NewOGFile(randID),
      await button_NewStudioSession(randID),
      await button_NewSnippet(randID),
      await button_GroupBuy(randID),
    ],
  });
  console.log(`row2_Announcement()`);
  return row; // a promise
};

const row_Announcement = async (randID) => {
  let row = createActRow.createActionRow({
    components: [await button_CustomAnnouncement(randID)],
  });
  console.log(`row_Announcement()`);
  return row; // a promise
};

const row_Attachment = async (randID, mute) => {
  // check to make sure the attachment is a file if it is a file type then send download button, view button, and dm button. But if the attachment is a link then just send the download button and the dm button
  let row = createActRow.createActionRow({
    components: [
      await button_Download(randID, mute), // link button
      await button_View(randID, mute),
      await button_DirectMessage(randID, mute),
    ],
  });
  console.log(`row_Attachment()`);
  return row; // a promise
};

const row_Draft = async (randID) => {
  let row = createActRow.createActionRow({
    components: [await button_Confirm(randID), await button_Cancel(randID)],
  });
  return row; // a promise
};

// // Modals
const modal_NewLeak = (randID) => {
  let modalObj = {
    customID: `newleakmodal${randID}`,
    title: `Create New Leak Announcement`,
    inputFields: [
      {
        customID: "leakName",
        label: "What's the new leak name?",
        style: "short",
        placeholder: "Adore You",
        required: true,
      },
      {
        customID: "altLeakNames",
        label: "If there are alternate titles, separate (,)",
        style: "short",
        placeholder: "Dark Knight,Seen A Soul Like Yours,Hold U",
        required: false,
      },
      {
        customID: `dateOfLeak`,
        label: `Input the date the leak occurred`,
        style: `short`,
        placeholder: `October 25th 2021`,
        required: true,
      },
      {
        customID: `era`,
        label: `Era`,
        style: `short`,
        placeholder: `DRFL`,
        required: false,
      },
      {
        customID: `notes`,
        label: `Any more info to send in announcement?`,
        style: `long`,
        placeholder: `Adore You was group bought in a bundle along with PITR and one other song`,
        required: false,
      },
    ],
  };
  let modal = createMdl.createModal(modalObj);
  return modal;
};
const modal_NewOGFile = (randID) => {
  let modalObj = {
    customID: `newogfilemodal${randID}`,
    title: `Create OG File Leak Announcement`,
    inputFields: [
      {
        customID: "leakName",
        label: "What's the song name?",
        style: "short",
        placeholder: "Adore You",
        required: true,
      },
      {
        customID: "altLeakNames",
        label: "If there are alternate titles, separate (,)",
        style: "short",
        placeholder: "Dark Knight,Seen A Soul Like Yours,Hold U",
        required: false,
      },
      {
        customID: `dateOfLeak`,
        label: `Input the date the leak occurred`,
        style: `short`,
        placeholder: `October 25th 2021`,
        required: true,
      },
      {
        customID: `price`,
        label: `Enter the price if bought or skip`,
        style: `short`,
        placeholder: `$25,000`,
        required: false,
      },
      {
        customID: `notes`,
        label: `Any more info to send in announcement?`,
        style: `long`,
        placeholder: `Adore You was group bought in a bundle along with PITR and one other song`,
        required: false,
      },
    ],
  };
  let modal = createMdl.createModal(modalObj);
  return modal;
};
const modal_NewStudioSession = (randID) => {
  let modalObj = {
    customID: `newstudiosessionmodal${randID}`,
    title: `Create Studio Session Announcement`,
    inputFields: [
      {
        customID: "leakName",
        label: "What's the session name?",
        style: "short",
        placeholder: "Adore You",
        required: true,
      },
      {
        customID: "altLeakNames",
        label: "If there are alternate titles, separate (,)",
        style: "short",
        placeholder: "Dark Knight,Seen A Soul Like Yours,Hold U",
        required: false,
      },
      {
        customID: `dateOfLeak`,
        label: `Input the date the leak occurred`,
        style: `short`,
        placeholder: `October 25th 2024`,
        required: true,
      },
      {
        customID: `price`,
        label: `Enter the price if bought or skip`,
        style: `short`,
        placeholder: `$25,000`,
        required: false,
      },
      {
        customID: `notes`,
        label: `Any more info to send in announcement?`,
        style: `long`,
        placeholder: `Before the Sessions, Adore You was group bought for $25,000 in a bundle along with PITR among others`,
        required: false,
      },
    ],
  };
  let modal = createMdl.createModal(modalObj);
  return modal;
};
const modal_NewSnippet = (randID) => {
  let modalObj = {
    customID: `newsnippetmodal${randID}`,
    title: `Create New Snippet Announcement`,
    inputFields: [
      {
        customID: "leakName",
        label: "What's name of the song in the snippet?",
        style: "short",
        placeholder: "Adore You",
        required: true,
      },
      {
        customID: "altLeakNames",
        label: "If there are alternate titles, separate (,)",
        style: "short",
        placeholder: "Dark Knight,Seen A Soul Like Yours,Hold U",
        required: false,
      },
      {
        customID: `era`,
        label: `era of the leak`,
        style: `short`,
        placeholder: `DRFL`,
        required: true,
      },
      {
        customID: `notes`,
        label: `Any additional notes to send in announcement?`,
        style: `long`,
        placeholder: `Adore You was group bought in a bundle along with PITR and one other song`,
        required: false,
      },
    ],
  };
  let modal = createMdl.createModal(modalObj);
  return modal;
};
const modal_NewCustomAnnouncement = (randID) => {
  let modalObj = {
    customID: `newcustomannouncementmodal${randID}`,
    title: `Create An Announcement`,
    inputFields: [
      {
        customID: "title",
        label: "What is the title of the announcement?",
        style: "short",
        placeholder: "New Nitro Giveaway!",
        required: true,
      },
      {
        customID: "description",
        label: "What is the announcement description?",
        style: "short",
        placeholder: "1 Year Free Nitro Giveaway",
        required: false,
      },
      {
        customID: `content`,
        label: `Add content for the announcement`,
        style: `long`,
        placeholder: `(if you have content, you must have a sub-header)`,
        required: false,
      },
      {
        customID: `contentHeader`,
        label: `Add a sub-header for the content`,
        style: `short`,
        placeholder: `(if you have a sub-header, you must enter content)`,
        required: false,
      },
      {
        customID: `additionalDetails`,
        label: `Any additional details? (optional)`,
        style: `long`,
        placeholder: `Next Year on J's Birthday we will give away more Nitro!, 999`,
        required: false,
      },
    ],
  };
  let modal = createMdl.createModal(modalObj);
  return modal;
};
// Get Modal Input
const getModalInput_A = (randID, interaction) => {
  let leakName, altLeakNames, dateOfLeak, era, notes;
  let modalObj = {};
  if (interaction.fields.getTextInputValue("leakName")) {
    leakName = interaction.fields.getTextInputValue("leakName");
    if (scripts.isDefined(leakName)) {
      modalObj.leakName = leakName;
    }
  }
  if (interaction.fields.getTextInputValue("altLeakNames")) {
    altLeakNames = interaction.fields.getTextInputValue("altLeakNames");
    if (scripts.isDefined(altLeakNames)) {
      modalObj.altLeakNames = altLeakNames;
    }
  }
  if (interaction.fields.getTextInputValue("dateOfLeak")) {
    dateOfLeak = interaction.fields.getTextInputValue("dateOfLeak");
    if (scripts.isDefined(dateOfLeak)) {
      modalObj.dateOfLeak = dateOfLeak;
    }
  }
  console.log(`modalObj 1`, modalObj);
  if (interaction.fields.getTextInputValue("era")) {
    era = interaction.fields.getTextInputValue("era");
    if (scripts.isDefined(era)) {
      modalObj.era = era;
    }
  }
  console.log(`modalObj 2`, modalObj);
  if (interaction.fields.getTextInputValue("notes")) {
    notes = interaction.fields.getTextInputValue("notes");
    if (scripts.isDefined(notes)) {
      modalObj.notes = notes;
    }
  }

  console.log(modalObj);

  return modalObj;
};
const getModalInput_B = (randID, interaction) => {
  let leakName, altLeakNames, dateOfLeak, era, notes;
  let modalObj = {};
  if (interaction.fields.getTextInputValue("leakName")) {
    leakName = interaction.fields.getTextInputValue("leakName");
    if (scripts.isDefined(leakName)) {
      modalObj.leakName = leakName;
    }
  }
  if (interaction.fields.getTextInputValue("altLeakNames")) {
    altLeakNames = interaction.fields.getTextInputValue("altLeakNames");
    if (scripts.isDefined(altLeakNames)) {
      modalObj.altLeakNames = altLeakNames;
    }
  }
  if (interaction.fields.getTextInputValue("era")) {
    era = interaction.fields.getTextInputValue("era");
    if (scripts.isDefined(era)) {
      modalObj.era = era;
    }
  }
  if (interaction.fields.getTextInputValue("notes")) {
    notes = interaction.fields.getTextInputValue("notes");
    if (scripts.isDefined(notes)) {
      modalObj.notes = notes;
    }
  }

  return modalObj;
};
// HERES
const getModalInput_C = (randID, interaction) => {
  let title, description, content, contentHeader, additionalDetails;
  let modalObj = {};
  if (interaction.fields.getTextInputValue("title")) {
    title = interaction.fields.getTextInputValue("title");
    if (scripts.isDefined(title)) {
      modalObj.title = title;
    }
  }
  if (interaction.fields.getTextInputValue("description")) {
    description = interaction.fields.getTextInputValue("description");
    if (scripts.isDefined(description)) {
      modalObj.description = description;
    }
  }
  if (interaction.fields.getTextInputValue("content")) {
    content = interaction.fields.getTextInputValue("content");
    if (scripts.isDefined(content)) {
      modalObj.content = content;
    }
  }
  if (interaction.fields.getTextInputValue("contentHeader")) {
    contentHeader = interaction.fields.getTextInputValue("contentHeader");
    if (scripts.isDefined(contentHeader)) {
      modalObj.contentHeader = contentHeader;
    }
  }
  if (interaction.fields.getTextInputValue("additionalDetails")) {
    additionalDetails =
      interaction.fields.getTextInputValue("additionalDetails");
    if (scripts.isDefined(additionalDetails)) {
      modalObj.additionalDetails = additionalDetails;
    }
  }

  return modalObj;
};

function createAnnounceEmbed(randID, modalInput, num, interaction) {
  if (!num) return; // maybe throw error in the future TODO
  let embed;
  const intObj = getInteractionObj(interaction);
  const { userInfo } = intObj;
  const { name, avatar, userId } = userInfo;
  let {
    leakName,
    altLeakNames,
    dateOfLeak,
    price,
    notes,
    era,
    title,
    description,
    content,
    contentHeader,
    additionalDetails,
  } = modalInput;

  switch (num) {
    case 1:
      if (!scripts.isDefined(era)) {
        era = "";
      }
      if (!scripts.isDefined(notes)) {
        notes = "";
      }
      if (!scripts.isDefined(altLeakNames)) {
        altLeakNames = "";
      }
      embed = createEmb.createEmbed({
        title: `${leakName}`,
        description: `<a:LFGGG:1029914284492333157> & https://cdn.discordapp.com/emojis/867536090961281034.gif?size=44&quality=lossless`,
        color: `${scripts.getColor()}`,
        thumbnail: interaction.guild.iconURL
          ? interaction.guild.iconURL({ dynamic: true })
          : "https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg",
        footer: { text: interaction.member.user.displayName, iconURL: avatar },
        author: {
          name: `New Leak`,
          iconURL: `https://cdn.discordapp.com/emojis/867536090961281034.gif?size=44&quality=lossless`,
        },
        fields: [
          {
            name: "Date Leaked : ",
            value: `${dateOfLeak}`,
            inline: true,
          },
          // {
          //   name: "Price of Leak : ",
          //   value: `${price}`,
          //   inline: true,
          // },
          {
            name: "Era :",
            value: `${era}`,
            inline: true,
          },
          {
            name: "Other Names : ",
            value: `${altLeakNames}`,
            inline: true,
          },
          {
            name: "Additional Notes : ",
            value: `${notes}`,
            inline: true,
          },
        ],
      });
      break;

    case 2:
      if (!scripts.isDefined(era)) {
        era = "";
      }
      if (!scripts.isDefined(notes)) {
        notes = "";
      }
      if (!scripts.isDefined(altLeakNames)) {
        altLeakNames = "";
      }
      embed = createEmb.createEmbed({
        title: `${leakName}`,
        description: `New Snippet`,
        color: `${scripts.getColor()}`,
        thumbnail: interaction.guild.iconURL()
          ? interaction.guild.iconURL({ dynamic: true })
          : "https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg",
        footer: { text: interaction.member.user.displayName, iconURL: avatar },
        fields: [
          {
            name: "Date Leaked : ",
            value: `${dateOfLeak}`,
            inline: true,
          },
          {
            name: "Era of Leak : ",
            value: `${era}`,
            inline: true,
          },
          // {
          //   name: "From ✍🏿",
          //   value: `<@${userId}>`,
          // inline: true,
          // },
          {
            name: "Other Names : ",
            value: `${altLeakNames}`,
            inline: true,
          },
          {
            name: "Additional Notes : ",
            value: `${notes}`,
            inline: true,
          },
        ],
      });
      break;

    case 3:
      if (!scripts.isDefined(content) || !scripts.isDefined(contentHeader)) {
        content = "";
      }
      if (!scripts.isDefined(notes)) {
        notes = "";
      }
      if (!scripts.isDefined(additionalDetails)) {
        additionalDetails = "";
      }
      embed = createEmb.createEmbed({
        title: `*${title}*`,
        description: `${description}`,
        color: `${scripts.getColor()}`,
        thumbnail: interaction.guild.iconURL
          ? interaction.guild.iconURL({ dynamic: true })
          : "https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg",
        footer: { text: interaction.member.user.displayName, iconURL: avatar },
        fields: [
          {
            name: `${contentHeader}`,
            value: `${content}`,
            inline: true,
          },
          {
            name: "Additional Details : ",
            value: `${additionalDetails}`,
            inline: true,
          },
        ],
      });
      break;

    case 4:
      if (!scripts.isDefined(price)) {
        price = "";
      }
      if (!scripts.isDefined(notes)) {
        notes = "";
      }
      if (!scripts.isDefined(altLeakNames)) {
        altLeakNames = "";
      }
      embed = createEmb.createEmbed({
        title: `${leakName}`,
        description: `New OG File`,
        color: `${scripts.getColor()}`,
        thumbnail: interaction.guild.iconURL
          ? interaction.guild.iconURL({ dynamic: true })
          : "https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg",
        footer: { text: interaction.member.user.displayName, iconURL: avatar },
        fields: [
          {
            name: "Date Leaked : ",
            value: `${dateOfLeak}`,
            inline: true,
          },
          {
            name: "Price of Leak : ",
            value: `${price}`,
            inline: true,
          },
          // {
          //   name: "From ✍🏿",
          //   value: `<@${userId}>`,
          // inline: true,
          // },
          {
            name: "Other Names : ",
            value: `${altLeakNames}`,
            inline: true,
          },
          {
            name: "Additional Notes : ",
            value: `${notes}`,
            inline: true,
          },
        ],
      });
      break;

    case 5:
      if (!scripts.isDefined(price)) {
        price = "";
      }
      if (!scripts.isDefined(notes)) {
        notes = "";
      }
      if (!scripts.isDefined(altLeakNames)) {
        altLeakNames = "";
      }
      embed = createEmb.createEmbed({
        title: `${leakName}`,
        description: `New Session Leak`,
        color: `${scripts.getColor()}`,
        thumbnail: interaction.guild.iconURL
          ? interaction.guild.iconURL({ dynamic: true })
          : "https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg",
        footer: { text: interaction.member.user.displayName, iconURL: avatar },
        fields: [
          {
            name: "Date Leaked : ",
            value: `${dateOfLeak}`,
            inline: true,
          },
          {
            name: "Price of Leak : ",
            value: `${price}`,
            inline: true,
          },
          // {
          //   name: "From ✍🏿",
          //   value: `<@${userId}>`,
          // inline: true,
          // },
          {
            name: "Other Names : ",
            value: `${altLeakNames}`,
            inline: true,
          },
          {
            name: "Additional Notes : ",
            value: `${notes}`,
            inline: true,
          },
        ],
      });
      break;

    default:
      // throw error
      break;
  }
  return embed;
}

let rolesString = (roles) => {
  let str = `${getAlertEmoji()} :`;
  roles.forEach((role) => {
    str += ` ${role} `;
  });
  return str;
};
async function announce(interaction) {
  if (!interaction) return;
  let interactionObj = getInteractionObj(interaction);
  let { memberPerms, userInfo } = interactionObj;
  let { name, displayName, roles, role } = userInfo;
  if (
    interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
  ) {
    console.log(
      `${
        displayName === name
          ? `${displayName}`
          : `${displayName} aka { ${name} }`
      } has permission to use this command`
    );
    await interaction.deferReply({ ephemeral: true });
    console.log(`🦾 ~ <<Announce>> Command Entered`);
    let randID = `#${Math.floor(Math.random() * 90000) + 10000}`;

    // The attachment if the user to includes an attachment
    let attachment = null,
      role1 = null,
      role2 = null,
      role3 = null,
      targetChannel;
    attachment = interaction.options.getAttachment("attachment")
      ? interaction.options.getAttachment("attachment")
      : null;

    role1 = interaction.options.getRole("role1")
      ? interaction.options.getRole("role1")
      : null;

    role2 = interaction.options.getRole("role2")
      ? interaction.options.getRole("role2")
      : null;

    role3 = interaction.options.getRole("role3")
      ? interaction.options.getRole("role3")
      : null;

    targetChannel = interaction.options.getChannel("sendto");

    let roles = [role1, role2, role3];
    if (roles.length <= 0) {
      roles = [];
    } else {
      roles = roles.filter((role) => role != null);
    }

    let attachmentURL = attachment ? attachment.url : null;
    let userId = interaction.user.id ? interaction.user.id : null;
    let channelId = interaction.channel.id ? interaction.channel.id : null;

    console.log(`🦾 ~ <<Announce>> Command Entered`);

    // Save the data to the database
    let data = {
      userId: userId,
      channelId: channelId,
      randID: randID,
      attachmentURL: attachmentURL,
      roles: roles,
      targetChannel: targetChannel,
    };

    scripts_mongoDB.saveSlashCommandData(data);

    // take this attachment, check if its file size is less than 8 mb, then return true or false whether in order to determine to send as a file or prompt the user to get an external link for the file

    let validFile = (attachment) => {
      if (attachment) {
        const size = attachment.size;
        console.log(`Actual Size : ${size} Vs. Max Size : ${8 * 1024 * 1024}`);
        // Checking if file is larger than max file send size | 8mb
        if (size >= 8 * 1024 * 1024) {
          console.log("File Size TOO BIG per Discord Api Rules");

          return -1;
        } else {
          console.log("Attachment Size Valid ~ Sending as file attachment");
          return 0;
        }
      } else {
        // No Attachment present
        console.log(`User did not input an attachment`);
        return 1;
      }
    };

    // Variable containing whether the attachment is valid or not
    let validStatus = validFile(attachment);
    console.log(`Is attachment valid?`, validStatus);

    // SWITCH TO CHECK THE OUTCOME OF VALID SIZE AND GO FORWARD ACCORDINGLY
    let message_ValidFile, message_fileSizeTooBig, message_NoAttachment;
    let row, row2, rowAttachment;

    switch (validStatus) {
      // : VALID FILE PRESENT
      case 0:
        console.log(
          `Sending Q: \'What kind of Announcement would you like to make? \'`
        );
        row = await row_Announcement(randID); // the row with the custom announcement option
        row2 = await row2_Announcement(randID); // the row with leak type announcements and gb button
        rowAttachment = await row_Attachment(randID, true); // the attachment buttons : disabled until final announcement is made

        message_ValidFile = {
          ephemeral: true,
          embeds: [embed_Announcement_File(interaction, randID)],
          components: [rowAttachment, row, row2],
        };

        // interaction.reply();

        break;

      // : INVALID FILE PRESENT
      case -1:
        console.log(`Sending -1 interaction`);
        let embed = embed_FileSizeTooBig(interaction, randID);
        let choiceRow = row_FileSizeTooBig(randID);

        message_fileSizeTooBig = {
          content: `Select One of the 2 Options`,
          embeds: [embed],
          ephemeral: true,
          components: [choiceRow],
        };
        // await interaction.editReply(message_fileSizeTooBig);
        break;

      // : NO FILE PRESENT
      case 1:
        console.log(
          `Sending Q: \'What kind of Announcement would you like to make? \'`
        );
        row = await row_Announcement(randID); // the row with the custom announcement option
        row2 = await row2_Announcement(randID); // the row with leak type announcements and gb button

        message_NoAttachment = {
          ephemeral: true,
          embeds: [embed_Announcement_NoFile(interaction, randID)],
          components: [row, row2],
        };
        // edit reply
        break;

      default:
        break;
    }
    // take in 3 variables and spit out the one thats not undefined
    let getDefined = (x, y, z) => {
      if (x) {
        console.log(`x is defined`);
        return x;
      }
      if (y) {
        console.log(`y is defined`);
        return y;
      }
      if (z) {
        console.log(`z is defined`);
        return z;
      }
    };
    let message = getDefined(
      message_ValidFile,
      message_fileSizeTooBig,
      message_NoAttachment
    );
    console.log(`Message is`, message);
    try {
      console.log(`interaction reply 15`);
      await interaction.editReply(message);
      // interaction.reply(message);
    } catch (error) {
      scripts.logError(error, "unable to send reply message");
    }
  } else {
    // don't run command
    console.log(
      `${
        displayName === name
          ? `${displayName}`
          : `${displayName} aka { ${name} }`
      } does not have permission to use this command`
    );
    console.log(
      `${
        displayName === name
          ? `${displayName}`
          : `${displayName} aka { ${name} }`
      }  highest role is ${role}`
    );
    try {
      console.log(`interaction reply 6`);
      await interaction.reply({
        ephemeral: true,
        embeds: [embed_NoPermission(interaction)],
      });
    } catch (error) {
      scripts.logError(
        error,
        "Was not able to complete the `NO PERMISSIONS` reply"
      );
    }
  }
}

async function sendDraft(randID, interaction) {
  // Make a function that gets the data from the database by the ID
  // get data from db
  // get targetChannel
  // get roles
  // get attachmentURL
  // get embed
  // get

  // STEPS
  // 1. Get data from db
  // 2. Get ActionRows created {row_Draft(randID), row_Attachment(randID)} : only if attachmentURL is defined : if not, then just row_Draft(randID)

  let doc = await scripts_mongoDB.getData(randID); // get data from db
  // console.log(`The data`, doc)
  let targetChannel = doc.targetChannel; // channel ID
  let roles = doc.roles; // array of roles
  let attachmentURL = doc.attachmentURL; // attachment URL
  let { title, description, color, author, fields, thumbnail } = doc.embed; // embedBuilder
  let icon_url_;
  if (author) {
    let { name, icon_url, url } = author;
    icon_url_ = icon_url;
  }
  console.log(`the fields`, fields);

  let avatar = icon_url_;
  let row_Top = null;
  console.log(`attachmentURL :`, attachmentURL);
  if (attachmentURL === null) {
    //  console.log(`PATH A`)
    row_Top = null;
  } else {
    //  console.log(`PATH B`)
    row_Top = await row_Attachment(randID, true); // row_Top
  }
  let row_Bottom = await row_Draft(randID); // row_Bottom

  let array = [];
  if (row_Top === null) {
    //  console.log(`PATH C`)
    array = [row_Bottom];
  } else {
    //  console.log(`PATH D`)
    array = [row_Top, row_Bottom];
  }

  let text =
    roles !== []
      ? `Are you sure you want to send to channel: ${targetChannel} ?\n${rolesString(
          roles
        )}`
      : `Are you sure you want to send to channel: ${targetChannel} ?`;
  console.log(`interaction reply 17`);
  interaction.editReply({
    content: text,
    embeds: [
      createEmb.createEmbed({
        title: title,
        description: description,
        color: color,
        fields: fields,
        thumbnail: thumbnail
          ? thumbnail.url
          : interaction.guild.icon
          ? interaction.guild.iconURL({ dynamic: true })
          : "https://media.discordapp.net/attachments/969397226373804082/1070662471683149844/ezgif.com-gif-maker.jpg",
        footer: avatar
          ? { text: interaction.member.user.displayName, iconURL: avatar }
          : {},
      }),
    ],
    ephemeral: true,
    components: array,
  });

  console.log("DONE W sending DRAFT");
}

let errEmbed = () => {
  return new EmbedBuilder()
    .setColor("#FF0000")
    .setTitle("❗️ Error")
    .setDescription("Invalid properties were given to create the embed");
};

let errMessage = () => {
  return { embeds: [errEmbed()] };
};

async function createFinalAnnouncement(doc, randID, interaction) {
  // make it return a promise

  try {
    let { embed, targetChannel, roles } = doc;
    let {
      title,
      description,
      color,
      thumbnail,
      image,
      footer,
      author,
      fields,
    } = embed;
    console.log(`Final Embed Info:`, embed);
    title = `${title}`;
    console.log(`The Title:`, title);

    console.log(`The Description:`, description);
    console.log(`The Color:`, color);
    console.log(`The Thumbnail:`, thumbnail);
    console.log(`The Image:`, image);
    console.log(`The Footer:`, footer);
    console.log(`The Author:`, author);
    console.log(`The Fields:`, fields);

    let text = roles !== [] ? rolesString(roles) : null;
    let attachmentURL = doc.attachmentURL; // attachment URL
    let row_Top;
    if (attachmentURL === null) {
      // console.log(`PATH A`);
      row_Top = undefined;
    } else {
      // console.log(`PATH B`);
      row_Top = await row_Attachment(randID, false); // row_Top // PROMISE - may cause issues
    }
    let componentArray = [row_Top];
    if (footer.text === null) {
      footer.text = `\u0020`;
    }

    let finalEmbed = createEmb.createEmbed({
      title: title ? title : null,
      description: description ? description : null,
      color: color ? color : null,
      thumbnail: thumbnail
        ? thumbnail.url
        : interaction.guild.icon
        ? interaction.guild.iconURL({ dynamic: true })
        : "https://media.discordapp.net/attachments/969397226373804082/1070662471683149844/ezgif.com-gif-maker.jpg",
      image: image ? image : null,
      footer: footer ? footer : [],
      author: author ? author : [],
      fields: fields ? fields : [],
    });

    componentArray = [row_Top];

    let finalAnnouncementMessage = {
      content: text,
      embeds: [finalEmbed],
      components:
        componentArray === [undefined] || componentArray === []
          ? []
          : componentArray,
    };
    let filter = (obj) => {
      for (let key in obj) {
        if (obj[key] === null) {
          delete obj[key];
        }
      }
      return obj;
    };
    finalAnnouncementMessage = filter(finalAnnouncementMessage);

    return finalAnnouncementMessage;
  } catch (error) {
    scripts.logError(error);

    return errMessage();
  }
}

let getOnlineCount = async (interaction) => {
  let onlineCount = 0;

  const cache = await interaction.guild.members.fetch();
  let fetchedMembers = cache.filter(ctx.presence?.status === "online");
  onlineCount = fetchedMembers.size;
  return onlineCount;
};

let getOfflineCount = (interaction) => {
  let offlineCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOffline = fetchedMembers.filter(
        (member) => member.presence?.status === "offline"
      );
      offlineCount = totalOffline.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return offlineCount;
};

let getIdleCount = (interaction) => {
  let idleCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalIdle = fetchedMembers.filter(
        (member) => member.presence?.status === "idle"
      );
      idleCount = totalIdle.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return idleCount;
};

let getDndCount = (interaction) => {
  let dndCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalDnd = fetchedMembers.filter(
        (member) => member.presence?.status === "dnd"
      );
      dndCount = totalDnd.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return dndCount;
};

let getBotCount = (interaction) => {
  let botCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalBots = fetchedMembers.filter((member) => member.user.bot);
      botCount = totalBots.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return botCount;
};

let getHumanCount = (interaction) => {
  let humanCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalHumans = fetchedMembers.filter((member) => !member.user.bot);
      humanCount = totalHumans.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return humanCount;
};

let getOnlineHumans = (interaction) => {
  let onlineHumans = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOnlineHumans = fetchedMembers.filter(
        (member) => member.presence?.status === "online" && !member.user.bot
      );
      onlineHumans = totalOnlineHumans.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return onlineHumans;
};

let getOnlineBots = (interaction) => {
  let onlineBots = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOnlineBots = fetchedMembers.filter(
        (member) => member.presence?.status === "online" && member.user.bot
      );
      onlineBots = totalOnlineBots.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return onlineBots;
};

let getOfflineHumans = (interaction) => {
  let offlineHumans = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOfflineHumans = fetchedMembers.filter(
        (member) => member.presence?.status === "offline" && !member.user.bot
      );
      offlineHumans = totalOfflineHumans.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return offlineHumans;
};

let getOfflineBots = (interaction) => {
  let offlineBots = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalOfflineBots = fetchedMembers.filter(
        (member) => member.presence?.status === "offline" && member.user.bot
      );
      offlineBots = totalOfflineBots.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return offlineBots;
};

let getMemberCount = (interaction) => {
  let memberCount = 0;
  interaction.guild.members
    .fetch({ withPresences: true })
    .then((fetchedMembers) => {
      const totalMembers = fetchedMembers.filter((member) => !member.user.bot);
      memberCount = totalMembers.size;
      // Now you have a collection with all online member objects in the totalOnline variable
    });
  return memberCount;
};

let getServerInfoObj = (interaction) => {
  let serverInfoObj = {
    onlineCount: getOnlineCount(interaction),
    offlineCount: getOfflineCount(interaction),
    idleCount: getIdleCount(interaction),
    dndCount: getDndCount(interaction),
    botCount: getBotCount(interaction),
    humanCount: getHumanCount(interaction),
    onlineHumans: getOnlineHumans(interaction),
    onlineBots: getOnlineBots(interaction),
    offlineHumans: getOfflineHumans(interaction),
    offlineBots: getOfflineBots(interaction),
    memberCount: getMemberCount(interaction),
  };

  return serverInfoObj;
};

const beforeIds = new Collection();
let b4 = (interaction) => {
  return beforeIds.get(`${interaction.id}`);
};
let setBefore = (id, interaction) => {
  beforeIds.set(`${interaction.id}`, id);
};

const afterIds = new Collection();
let afterCollection = (interaction) => {
  return afterIds.get(`${interaction.id}`);
};
let setAfter = (id, interaction) => {
  afterIds.set(`${interaction.id}`, id);
};

let fileNameArray = (interaction) => {
  return fileNames.get(`${interaction.id}`)
    ? fileNames.get(`${interaction.id}`)
    : [];
};
let setFileNameArray = (array, interaction) => {
  fileNames.set(`${interaction.id}`, array);
};

async function saveChannelAttachments(message, interaction, batch_id) {
  // if any variables are not valid, return
  if (!message || !interaction || !batch_id) return;
  // create the attachments array and metadata object
  console.log(`the message is`, message);
  console.log(`the message.attachments`, message.attachments);
  console.log(`the message attachments`, message.attachments.name);
  let attachments = [];
  let metadata = {};
  console.log(`RUNNING SAVE CHANNEL ATTACHMENTS`);
  console.log(`the message attachments`, message.attachments.name);
  // for every attachment create an attachment object and push it to the attachments array
  let attachment_array = [...message.attachments.values()];
  for (let attachment_ of attachment_array) {
    console.log(`the attachment_`, attachment_);
    let attachment = {
      file_name: attachment_.name,
      file_size: `${attachment_.size / 1000000} Mb`,
      file_url: attachment_.url,
      file_type: attachment_.contentType,
      file_extension: attachment_.name.split(".").pop(),
      file_id: attachment_.id,
      file_batch_id: batch_id,
    };
    attachments.push(attachment);
  }
  // create the metadata object
  metadata = {
    from_user_name: message.author.username,
    from_user_id: message.author.id,
    from_channel_name: message.channel.name,
    from_channel_id: message.channel.id,
    from_guild_name: message.guild.name,
    from_guild_id: message.guild.id,
    from_guild_icon: message.guild.iconURL(),
    posted_at: message.createdAt,
    message_id: message.id,
    message_content: message.content,
    message_batch_id: batch_id,
    who_ran_command: interaction.user.username,
    who_ran_command_id: interaction.user.id,
    who_ran_command_avatar: interaction.user.avatarURL(),
  };
  // save the attachments to the database
  console.log(`the attachments:`, attachments);
  // await scripts.delay(30000)
  let obj = {
    _id: `${new mongoose.Types.ObjectId()}`,
    attachments: attachments,
    metadata: metadata,
  };
  console.log(`The obj:`, obj);
  await fetchedFiles.create(obj);
  console.log(`--------------------------`);
  for (i = 0; i < message.attachments.length; i++) {
    console.log(message.attachments[i].name);
  }
  console.log(`^saved to the database^`);
}

async function fetching(interaction, targetChannel, count, batch_id) {
  console.log(`RUNNING FETCHing`);
  console.log(`The batch_id: ${batch_id}`);
  let before = b4(interaction);
  console.log(`The before: ${before}`);

  let targetChannelMessages = await targetChannel.messages.fetch({
    before: before ? before : null,
  }); // A COLLECTION of messages <50 max>

  // while there are still messages in the channel to fetch
  console.log(
    `The Size of the message fetch response: ${targetChannelMessages.size}`
  );

  if (targetChannelMessages.size > 0) {
    count++;
    console.log(`targetChannelMessages.size > 0`);
    let content = `Fetching files....`;
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
      ephemeral: true,
    });
    await scripts.delay(1000);
    content = `Fetching files`;
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
      ephemeral: true,
    });
    await scripts.delay(1000);
    content = `Fetching files.`;
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
      ephemeral: true,
    });
    await scripts.delay(1000);
    content = `Fetching files..`;
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
      ephemeral: true,
    });
    await scripts.delay(1000);
    content = `Fetching files...`;
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
      ephemeral: true,
    });

    targetChannelMessages = targetChannelMessages.map((message) => message); // A COLLECTION of messages <50 max>

    // console.log(`the targetChannelMessages:`, targetChannelMessages);
    // convert the collection to an array
    let theArray = targetChannelMessages;
    // console.log(`the array`,theArray)
    // for every message check if it has an attachment
    for (let message of targetChannelMessages.values()) {
      // console.log(`the array`,theArray)
      // convert message from a collection to an array
      // message = message[1];
      // console.log(`The Message Attachments`, message.first().attachments)

      // if it does, check if it's a file
      if (message.attachments.size > 0) {
        console.log(`Message with attachments:`, message);
        console.log(`Its attachments:`, message.attachments);
        // if it is, check if it's a file we want
        // change to the came for loop kind of way as above HERE TODO:
        for (let attachment of message.attachments.values()) {
          console.log(`MADE IT!`);
          console.log(`The attachment:`, attachment);

          if (
            attachment.name.endsWith(".mp3") ||
            attachment.name.endsWith(".wav") ||
            attachment.name.endsWith(".ogg") ||
            attachment.name.endsWith(".m4a") ||
            attachment.name.endsWith(".flac")
          ) {
            console.log(`The attachment F:`, attachment);
            // if attachment size under 8mb then send as a file if not send as link with the name about the link an dhow big it is
            if (attachment.size < 8000000) {
              try {
                interaction.user.send({ files: [attachment.url] });
              } catch (error) {
                console.log(`Error sending the file:`, error);
                interaction.user.send({
                  content: `The File Name: ${attachment.name}\n\nFile Link: ${attachment.url}`,
                  embeds: [
                    createEmb.createEmbed({
                      color: scripts.getErrorColor(),
                      title: `Error sending the file:`,
                      description: `${error}`,
                    }),
                  ],
                });
              }
              // interaction.user.send({ files: [attachment.url] });
            } else {
              // convert attachment.size to Mb
              attachment.size = attachment.size / 1000000;
              let buttonRow = await createActRow.createActionRow({
                components: [
                  await linkButton(
                    `Download ${attachment.name}`,
                    attachment.url
                  ),
                ],
              });

              // use createButtonRow to create a button row with a button that has a link to the file
              try {
                interaction.user.send({
                  embeds: [
                    createEmb.createEmbed({
                      title: `The file is too big to send as a file.`,
                      fields: [
                        { name: `File Name`, value: `${attachment.name}` },
                      ],
                      description: `It is ${attachment.size} Mb. There is a Download Button Below\n\nHere is also a link to the file: ${attachment.url}`,
                    }),
                  ],
                  components: [buttonRow],
                });
              } catch (error) {
                console.log(`Error sending the file:`, error);
                interaction.user.send(
                  `The file ${attachment.name} is too big to send as a file. It is ${attachment.size} Mb. Here is a link to the file: ${attachment.url}`
                );
              }
            }
            // add the attachment name to the fileNames array and update the fileNames collection
            let fileNamesArray = fileNameArray(interaction);
            console.log(`The fileNamesArray:`, fileNamesArray);
            fileNamesArray.push(attachment.name);
            setFileNameArray(fileNamesArray, interaction);
            console.log(`fileNamesArray:`, fileNameArray(interaction));
            console.log(`--------------------------`);

            console.log(`run save [ ${attachment.name} ]`);
            saveChannelAttachments(message, interaction, batch_id);
          }
        }
      } else {
        console.log(`No attachments`);
      }
      // set the before variable to the id of the last message in the channel
      // get last message in targetChannelMessages array
      console.log(`the before variable:`, b4(interaction));
      console.log(`the array:`, theArray);
      let b = b4(interaction);
      if (theArray.length > 0) {
        console.log(
          `The last message in the array:`,
          theArray[theArray.length - 1]
        );

        console.log(
          `The before variable is set to ${theArray[theArray.length - 1].id}`
        );
        setBefore(theArray[theArray.length - 1].id, interaction);
      }
      if (b === b4(interaction)) {
        console.log(`The before variable is the same as before`);
        break;
      } else {
        // set a time out to prevent rate limiting and wait 2 minutes before fetching the next 100 messages
        console.log(`Again before new array`);
        theArray = await targetChannel.messages.fetch({
          before: b4(interaction),
        });
        console.log(`the array EEEE:`, theArray);

        if (theArray.size > 0) {
          content = `Fetch Cooldown In Progress...`;
          await interaction.editReply({
            embeds: [createEmb.createEmbed({ title: content })],
            ephemeral: true,
          });
          console.log(`Waiting 30 sec before fetching the next messages`);

          await scripts.delay(3000);
          if (b !== b4(interaction)) {
            fetching(interaction, targetChannel, count, batch_id);
          }
        } else {
          // AFTER ALL FETCHING DONE
          // send an embed to the user in dms
          // with all the file names in a bulleted list single string
          //ex: - file1.mp3
          //    - file2.mp3
          await interaction.editReply({
            embeds: [
              createEmb.createEmbed({ title: `Still working on it...` }),
            ],
          });
        }
      }
    }
  } else {
    // AFTER ALL FETCHING DONE
    // editReply to user saying unfortunately no files were found and a sad emoji
    // log crying emoji
    let content = `😭Unfortunately no files were found`;
    let description = `We searched through the last 100 messages in the channel and found no files`;
    let embed = createEmb.createEmbed({
      title: content,
      description: description,
      color: scripts.getErrorColor(),
    });
    await interaction.editReply({ embeds: [embed] });
  }
}

async function beginFileFetch(interaction) {
  let end, minutes, seconds;
  // batch_id will be a unique id compiled from the current date and time
  let getBatchId = () => {
    let batch_id = "";
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let millisecond = date.getMilliseconds();
    batch_id = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
    return batch_id;
  };

  let batch_id = getBatchId();

  let content = `File Archiving Initiating`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1500);
  let count = 0;
  // start a stopwatch that tracks how long it takes to fetch all the files
  const start = Date.now();
  // get this last reply message id
  // create a collection for the before message id

  content = `File Archiving Initiating.`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `File Archiving Initiating..`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(500);
  content = `File Archiving Initiating...`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(500);
  content = `File Downloading In Progress...`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(100);

  const fromChannelID = interaction.channel.id;
  const targetChannel = await interaction.guild.channels.fetch(fromChannelID);
  const targetChannelID = targetChannel.id;
  const lastMessages = await targetChannel.messages.fetch({ limit: 1 });
  // get last message
  let lastMessage = lastMessages.first();

  const lastReplyID = lastMessage.id;

  // beforeIds.set(`${interaction.id}`, lastReplyID);
  console.log(`before set to ${b4(interaction)}`);

  fetching(interaction, targetChannel, count, batch_id).then(async () => {
    let query = { batch_id: batch_id };
    let newUploadsArray = await fetchedFiles.find(query).exec();
    console.log(`The newUploadsArray is`, newUploadsArray);
    let newUploadsArrayLength = newUploadsArray.length;
    let fileNamesArray = fileNameArray(interaction);
    let fileList = "";
    console.log(`The fileNamesArray:`, fileNamesArray);
    for (let name of fileNamesArray) {
      fileList += "- " + name + "\n";
    }
    // edit the reply to the user in the channel to be a success embed message
    let content = `✅ File Archive Complete`;
    let description = `Saved \`${fileNamesArray.length}\` ${
      fileNamesArray.length === 1 ? `File` : `Files`
    } from the ${targetChannel.name} channel in the ${
      interaction.guild.name
    } Server\n\nAll the files that we found have been sent to you in dms :wink:`;
    embed = createEmb.createEmbed({
      title: content,
      description: description,
      color: scripts.getSuccessColor(),
    });
    // TODO: Change to almost there message

    await interaction.editReply({ embeds: [embed] });

    let fileNames = [];
    let files = [];
    console.log("Before the forEach loop");
    console.log(`The new Uploads Length is ${fileNamesArray.length}`);

    if (newUploadsArrayLength > 0) {
      newUploadsArray.forEach(async (obj) => {
        let { metadata, attachments } = obj._doc;
        console.log(`the metadata`, metadata);

        let { file_name, from_guild_id, from_channel_id, message_id } =
          metadata;
        attachments.forEach((attachment) => {
          files.push(attachment.file_url);
          fileNames.push(attachment.file_name);
          let temp = fileNameArray(interaction);
          // for every item in fileNames, check if it is already in the array temp, if not, push it to temp
          for (let name of fileNames) {
            if (!temp.includes(name)) {
              temp.push(name);
              setFileNameArray(temp, interaction);
            }
          }
        });
      });
      // check to make sure there are only 10 files in the array
      // if there are more than 10, split the array into multiple arrays of 10
      if (files.length > 10) {
        let filesArray = [];
        let filesArrayLength = Math.ceil(files.length / 10);
        for (let i = 0; i < filesArrayLength; i++) {
          let filesArraySlice = files.slice(i * 10, (i + 1) * 10);
          filesArray.push(filesArraySlice);
        }
        filesArray.forEach(async (files) => {
          // check if any of the files are over 8mb
          // if any are too big remove them from the array and push to a new array
          // then send the new array to the user in a dm
          let tooBig = [];
          files.forEach((file) => {
            if (file.size > 8388608) {
              tooBig.push(file);
            }
          });
          // remove the files that are too big from the files array
          files = files.filter((file) => !tooBig.includes(file));

          // use createButtonRow to create a button row with a button that has a link to the file
          // for every link in the tooBig array, send a message to the user in a dm with the link
          tooBig.forEach(async (attachment) => {
            // convert attachment.size to Mb
            attachment.size = attachment.size / 1000000;
            let buttonRow = await createActRow.createActionRow({
              components: [
                await linkButton(`Download ${attachment.name}`, attachment.url),
              ],
            });
            try {
              await interaction.user.send({
                embeds: [
                  createEmb.createEmbed({
                    title: `The file is too big to send as a file.`,
                    fields: [
                      { name: `File Name`, value: `${attachment.name}` },
                    ],
                    description: `It is ${attachment.size} Mb. There is a Download Button Below\n\nHere is also a link to the file: ${attachment.url}`,
                  }),
                ],
                components: [buttonRow],
              });
            } catch (error) {
              console.log(`Error sending the file:`, error);
              await interaction.user.send(
                `The file ${attachment.name} is too big to send as a file. It is ${attachment.size} Mb. Here is a link to the file: ${attachment.url}`
              );
            }
          });
          // if there are more than 10 files in the array, send the files in batches of 10
          // if there are less than 10 files in the array, send the files in one message
          console.log(`FIRE FILES:`, files);
          files.forEach(async (file) => {
            try {
              await interaction.user.send({
                files: [file],
              });
            } catch (error) {
              console.log(`Error sending the file:`, error);
              await interaction.user.send({
                content: `File Link: ${file}`,
                embeds: [
                  createEmb.createEmbed({
                    color: scripts.getErrorColor(),
                    title: `Error sending the file:`,
                    description: `${error}`,
                  }),
                ],
              });
            }
          });
        });
        // for every file, take teh file name and add it to a string
        // then send the string to the user in a dm

        // get bot user id
        let bot = interaction.client.user;

        // get bot user avatar
        let botAvatar = bot.avatarURL();
        // create a new embed with createEmbed

        let content = `All the files that we found:`;
        let description = fileList;
        let embed = createEmb.createEmbed({
          title: content,
          description: description,
          author: {
            name: bot.username,
            icon_url: botAvatar,
          },
        });
        console.log(`sending DM [ B ]`);
        try {
          await interaction.user.send({ embeds: [embed] });
        } catch (error) {
          console.log(`Error sending the file:`, error);
          interaction.user.send({
            content: `The Files Found\n\n\`${fileList}\``,
          });
        }
      } else {
        let tooBig = [];
        files.forEach((file) => {
          if (file.size > 8388608) {
            tooBig.push(file);
          }
        });
        // remove the files that are too big from the files array
        files = files.filter((file) => !tooBig.includes(file));

        // use createButtonRow to create a button row with a button that has a link to the file
        // for every link in the tooBig array, send a message to the user in a dm with the link
        tooBig.forEach(async (attachment) => {
          // convert attachment.size to Mb
          attachment.size = attachment.size / 1000000;
          let buttonRow = await createActRow.createActionRow({
            components: [
              await linkButton(`Download ${attachment.name}`, attachment.url),
            ],
          });
          try {
            interaction.user.send({
              embeds: [
                createEmb.createEmbed({
                  title: `The file is too big to send as a file.`,
                  fields: [{ name: `File Name`, value: `${attachment.name}` }],
                  description: `It is ${attachment.size} Mb. There is a Download Button Below\n\nHere is also a link to the file: ${attachment.url}`,
                }),
              ],
              components: [buttonRow],
            });
          } catch (error) {
            console.log(`Error sending the file:`, error);
            interaction.user.send(
              `The file ${attachment.name} is too big to send as a file. It is ${attachment.size} Mb. Here is a link to the file: ${attachment.url}`
            );
          }
        });

        try {
          interaction.user.send({
            files: files,
          });
        } catch (error) {
          console.log(`Error sending the file:`, error);
          interaction.user.send({
            content: `File Link: ${attachment.url}`,
            embeds: [
              createEmb.createEmbed({
                color: scripts.getErrorColor(),
                title: `Error sending the file:`,
                description: `${error}`,
              }),
            ],
          });
        }

        let fileNamesArray = fileNameArray(interaction);
        let fileList = "";
        console.log(`The fileNamesArray:`, fileNamesArray);
        for (let name of fileNamesArray) {
          fileList += "- " + name + "\n";
        }
        // get bot user id
        let bot = interaction.client.user;

        // get bot user avatar
        let botAvatar = bot.avatarURL();
        // create a new embed with createEmbed

        let content = `All the files that we found:`;
        let description = fileList;
        let embed = createEmb.createEmbed({
          title: content,
          description: description,
          author: {
            name: bot.username,
            icon_url: botAvatar,
          },
        });
        console.log(`sending DM [ A ]`);
        try {
          interaction.user.send({ embeds: [embed] });
        } catch (error) {
          console.log(`Error sending the file:`, error);
          interaction.user.send({
            content: `The Files Found\n\n\`${fileList}\``,
          });
        }
      }
    }
    console.log(`done`);
  });
}

// async function saveFetchedFile(message, interaction, batch_id) {
//   // get all the info in order to create an obj replicating the database schema
//   let attachments = [];
//   let metadata = {};
//   let from_user_name = message.author.username;
//   let from_user_id = message.author.id;
//   let from_channel_name = message.channel.name;
//   let from_channel_id = message.channel.id;
//   let from_guild_name = message.guild.name;
//   let from_guild_id = message.guild.id;
//   let from_guild_icon = message.guild.iconURL();
//   let posted_at = message.createdAt;
//   let message_id = message.id;
//   let message_content = message.content;
//   let who_ran_command = interaction.user.username;
//   let who_ran_command_id = interaction.user.id;
//   let who_ran_command_avatar = interaction.user.avatarURL();

//   let file_name = message.attachments.first().name;
//   let file_url = message.attachments.first().url;
//   let file_size = message.attachments.first().size;
//   let file_size_MB = (file_size / 1000000).toFixed(2);
//   console.log(`File name: ${file_name}`);
//   console.log(`File url: ${file_url}`); // logged here in the past, all defined
//   // console.log(`File size: ${file_size_MB} MB`);

//   // for each attachment in the message add it the attachments array
//   message.attachments.forEach((attachment) => {
//     attachments.push(attachment.url);
//   });
//   console.log(`attachments.length`, attachments.length);
//   // add all the metadata to the metadata object
//   metadata = {
//     from_user_name: from_user_name,
//     from_user_id: from_user_id,
//     from_channel_name: from_channel_name,
//     from_channel_id: from_channel_id,
//     from_guild_name: from_guild_name,
//     from_guild_id: from_guild_id,
//     from_guild_icon: from_guild_icon,
//     posted_at: posted_at,
//     file_name: file_name,
//     file_size: `${file_size_MB} MB`,
//     message_id: message_id,
//     message_content: message_content,
//     who_ran_command: who_ran_command,
//     who_ran_command_id: who_ran_command_id,
//     who_ran_command_avatar: who_ran_command_avatar,
//     batch_id: batch_id,
//   };
//   // create the obj to be saved to the database
//   const obj = {
//     attachments: attachments,
//     metadata: metadata,
//   };

//   await scripts_mongoDB.saveFetchFile(obj);

//   console.log(`Post Save`);
// }

async function selectRoleMenu(interaction) {
  if (!interaction) return;
  let interactionObj = getInteractionObj(interaction);
  let { memberPerms, userInfo } = interactionObj;
  let { name, displayName, roles, role } = userInfo;
  if (
    interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)
  ) {
    console.log(
      `${
        displayName === name
          ? `${displayName}`
          : `${displayName} aka { ${name} }`
      } has permission to use this command`
    );
    await interaction.deferReply({ ephemeral: true });
    console.log(`🦾 ~ <<Announce>> Command Entered`);
    let randID = `#${Math.floor(Math.random() * 90000) + 10000}`;

    let targetChannel = interaction.options.getChannel("sendto");
    // for every role option define it as the interaction role option unless there was no role inputted, if so set it to null, every role 1 - 24
    let role1 = interaction.options.getRole("role1")
      ? interaction.options.getRole("role1")
      : null;
    let role2 = interaction.options.getRole("role2")
      ? interaction.options.getRole("role2")
      : null;
    let role3 = interaction.options.getRole("role3")
      ? interaction.options.getRole("role3")
      : null;
    let role4 = interaction.options.getRole("role4")
      ? interaction.options.getRole("role4")
      : null;
    let role5 = interaction.options.getRole("role5")
      ? interaction.options.getRole("role5")
      : null;
    let role6 = interaction.options.getRole("role6")
      ? interaction.options.getRole("role6")
      : null;
    let role7 = interaction.options.getRole("role7")
      ? interaction.options.getRole("role7")
      : null;
    let role8 = interaction.options.getRole("role8")
      ? interaction.options.getRole("role8")
      : null;
    let role9 = interaction.options.getRole("role9")
      ? interaction.options.getRole("role9")
      : null;
    let role10 = interaction.options.getRole("role10")
      ? interaction.options.getRole("role10")
      : null;
    let role11 = interaction.options.getRole("role11")
      ? interaction.options.getRole("role11")
      : null;
    let role12 = interaction.options.getRole("role12")
      ? interaction.options.getRole("role12")
      : null;
    let role13 = interaction.options.getRole("role13")
      ? interaction.options.getRole("role13")
      : null;
    let role14 = interaction.options.getRole("role14")
      ? interaction.options.getRole("role14")
      : null;
    let role15 = interaction.options.getRole("role15")
      ? interaction.options.getRole("role15")
      : null;
    let role16 = interaction.options.getRole("role16")
      ? interaction.options.getRole("role16")
      : null;
    let role17 = interaction.options.getRole("role17")
      ? interaction.options.getRole("role17")
      : null;
    let role18 = interaction.options.getRole("role18")
      ? interaction.options.getRole("role18")
      : null;
    let role19 = interaction.options.getRole("role19")
      ? interaction.options.getRole("role19")
      : null;
    let role20 = interaction.options.getRole("role20")
      ? interaction.options.getRole("role20")
      : null;
    let role21 = interaction.options.getRole("role21")
      ? interaction.options.getRole("role21")
      : null;
    let role22 = interaction.options.getRole("role22")
      ? interaction.options.getRole("role22")
      : null;
    let role23 = interaction.options.getRole("role23")
      ? interaction.options.getRole("role23")
      : null;
    let role24 = interaction.options.getRole("role24")
      ? interaction.options.getRole("role24")
      : null;

    // create an array of all the roles
    let roles = [
      role1,
      role2,
      role3,
      role4,
      role5,
      role6,
      role7,
      role8,
      role9,
      role10,
      role11,
      role12,
      role13,
      role14,
      role15,
      role16,
      role17,
      role18,
      role19,
      role20,
      role21,
      role22,
      role23,
      role24,
    ];
    if (roles.length <= 0) {
      roles = [];
    } else {
      roles = roles.filter((role) => role != null);
    }

    let userId = interaction.user.id ? interaction.user.id : null;
    let channelId = interaction.channel.id ? interaction.channel.id : null;

    console.log(`🦾 ~ <<Announce>> Command Entered`);
  } else {
    console.log(
      `${
        displayName === name
          ? `${displayName}`
          : `${displayName} aka { ${name} }`
      } does not have permission to use this command`
    );
    await interaction.reply({
      embeds: [embed_NoPermission(interaction)],
      ephemeral: true,
    });
  }
}

const filesFound = new Collection();
let filesFoundArray = (interaction) => {
  console.log(`files found: ${filesFound.get(interaction.id)}`);

  return filesFound.get(`${interaction.id}`);
};
let setFilesFoundArray = (interaction, newFile) => {
  // if there is nothing in the collection, create a new array and add the file to it
  let files = filesFound.get(`${interaction.id}`)
    ? filesFound.get(`${interaction.id}`)
    : [];
  files.push(newFile);
  filesFound.set(`${interaction.id}`, files);
};

async function sendLoad1(interaction) {
  content = `File Archiving Initiating`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1500);
  content = `File Archiving Initiating.`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `File Archiving Initiating..`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(500);
  content = `File Archiving Initiating...`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(500);
  content = `File Downloading In Progress...`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(100);
}
async function sendLoad2(interaction) {
  let content = `Fetching Messages....`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `Fetching Messages`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `Fetching Messages.`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `Fetching Messages..`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
  await scripts.delay(1000);
  content = `Fetching Messages...`;
  await interaction.editReply({
    embeds: [createEmb.createEmbed({ title: content })],
    ephemeral: true,
  });
}

async function loadCooldown(interaction) {
  let content = `Archive Cooldown In Progress...`;
try {
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
      ephemeral: true,
    });
} catch (error) {
  
}
  await scripts.delay(1000);
}

async function saveMessageBatch(message, batch_id, interaction) {
  if (!message || !interaction || !batch_id) return;
  // create the attachments array and metadata object
  console.log(`the message is`, message);
  console.log(`the message.attachments`, message.attachments);
  let attachment_array = [...message.attachments.values()];
  console.log(`the attachment_array`, attachment_array);
  console.log(`the attachment name`, attachment_array[0].name);
  let attachments = [];
  let metadata = {};
  console.log(
    `saving the message with [ ${attachment_array[0].name} ] to the database`
  );
  console.log(`the message includes`, attachment_array[0].name);
  // for every attachment create an attachment object and push it to the attachments array

  for (let attachment_ of attachment_array) {
    console.log(`the attachment_`, attachment_);
    // testing stuff

    // construct the attachments message formatted object
    let messageContent = {};
    if (attachment_.size < 8000000) {
      messageContent = {
        content: `||${attachment_.name}||`, // the name of the file is hidden
        files: [attachment_.url],
        embed: {
          title: `File: \`${attachment_.name}\``,
          description: `Size: \`${attachment_.size / 1000000} Mb\``,
        },
        actionRow: false,
      };
    } else {
      messageContent = {
        content: `||${attachment_.name}||`, // the name of the file is hidden
        embed: {
          title: `File: \`${attachment_.name}\``,
          description: `Size: \`${attachment_.size / 1000000} Mb\``,
        },
        actionRow: true,
        button: {
          style: "link",
          label: "Download File to Listen :loud_sound:",
          link: attachment_.url,
        },
      };
    }

    console.log(`the messageContent`, messageContent);

    // end testing
    let attachment = {
      file_name: attachment_.name,
      file_size: `${attachment_.size / 1000000} Mb`,
      file_url: attachment_.url,
      file_type: attachment_.contentType,
      file_extension: attachment_.name.split(".").pop(),
      file_id: attachment_.id,
      file_batch_id: batch_id,
      message_content: messageContent,
    };
    attachments.push(attachment);
  }
  // create the metadata object
  metadata = {
    from_user_name: message.author.username,
    from_user_id: message.author.id,
    from_channel_name: message.channel.name,
    from_channel_id: message.channel.id,
    from_guild_name: message.guild.name,
    from_guild_id: message.guild.id,
    from_guild_icon: message.guild.iconURL(),
    posted_at: message.createdAt,
    message_id: message.id,
    message_content: message.content,
    message_batch_id: batch_id,
    who_ran_command: interaction.user.username,
    who_ran_command_id: interaction.user.id,
    who_ran_command_avatar: interaction.user.avatarURL(),
  };
  let obj = {
    _id: `${new mongoose.Types.ObjectId()}`,
    attachments: attachments,
    metadata: metadata,
    batch_id: batch_id,
  };
  console.log(`The obj:`, obj);
  await fetchedFiles.create(obj);
  console.log(`--------------------------`);
  for (i = 0; i < obj.attachments.length; i++) {
    console.log(obj.attachments[i].file_name);
  }
  console.log(`^saved to the database^`);
}

function batchArray(arr, size) {
  let batchedArray = [];
  for (let i = 0; i < arr.length; i += size) {
    batchedArray.push(arr.slice(i, i + size));
  }
  return batchedArray;
}
let fileList = (arrayOfFiles, num) => {
  let list = "";
  console.log(`the arrayOfFiles`, arrayOfFiles);
  console.log(`the file 1`, arrayOfFiles[0]);
  // if array is 24 or greater set the array to the first 24 and replace the 25th with a string
  if (!num) {
    if (arrayOfFiles.length >= 24) {
      arrayOfFiles = arrayOfFiles.slice(0, 24);
      if (typeof arrayOfFiles[0] === "string") {
        arrayOfFiles.push(`...and more but they could not fit here`);
      } else {
        arrayOfFiles.push({ name: `...and more but they could not fit here` });
      }
    }
    for (let file of arrayOfFiles) {
      if (typeof file === "string") {
        list += `- ${file}\n`;
      } else {
        list += `- ${file.name}\n`;
      }
    }
  } else {
    if (arrayOfFiles.length >= num) {
      arrayOfFiles = arrayOfFiles.slice(0, num);
      if (typeof arrayOfFiles[0] === "string") {
        arrayOfFiles.push(`...and more but they could not fit here`);
      } else {
        arrayOfFiles.push({ name: `...and more but they could not fit here` });
      }
    }
    for (let file of arrayOfFiles) {
      if (typeof file === "string") {
        list += `- ${file}\n`;
      } else {
        list += `- ${file.name}\n`;
      }
    }
  }
  return list;
};

const attachments_ = new Collection();
let batchAttachments = (batch_id) => {
  return attachments_.get(batch_id);
};
let addAttachment_ = (attachmentObj, batch_id) => {
  let array = batchAttachments(batch_id) ? batchAttachments(batch_id) : [];
  array.push(attachmentObj);
  attachments_.set(batch_id, array);
  console.log(
    `added an attachment to the batch array --the attachments_ :`,
    attachments_
  );
};

let getMessageAttachments = async (targetChannel, interaction, batch_id, be4, after_) => {

  await sendLoad2(interaction);
  console.log(`the be4 passed in`, be4);

  console.log(`the after_ passed in`, after_);

  setBefore(be4, interaction);
  
  let after =  afterCollection(interaction);
  let before = b4(interaction);
  let messages;
  try{
    console.log(`the target channel name`, targetChannel.name);
    console.log(`the before`, before);
    console.log(`the after`, after);
     // if both are inputed, after will be used and before will be ignored
    messages = await targetChannel.messages.fetch({
    before: before ? before : null, after: after ? after : null, limit: 100,
  }); 
  // collection of messages
  console.log(`the messages`, messages);

  console.log(`Here`)
  }catch(err){
    scripts.logError(err, 'error fetching');
    return filesFoundArray(interaction)
    }
  console.log(`the messages`, messages);
  let lastMessage = messages.last();
  console.log(`the last message`, lastMessage);

  // if there are no results from the fetch, return the filesFound array
  if (messages.size === 0) {
    console.log(`messages found in channel is 0`);

    return filesFoundArray(interaction);
  }

  let lastMessageID = messages.last().id;
  console.log(`the last message id`, lastMessageID);

  // get the last message id from the messages collection and send it to the b4 function
  setBefore(lastMessageID, interaction);
  console.log(`the before was set to`, b4(interaction))

  console.log(`the after is`, after)

  console.log(`the ORIGINAL after is`, after_)


  setAfter(after ? after : null, interaction);

  console.log(`the after was set to`, afterCollection(interaction))

 // console.log(`the before was reset`);

  // filter out all the messages that do not have attachments
  let messagesWithAttachments = messages.filter((message) => {
    console.log(`the message`, message);
    console.log(`message found`);
    let theAttachments = [...message.attachments.values()];
    console.log(`theAttachments`, theAttachments);
    let numOfNumMessagesWAttachments = 0;
    for (let attachment of theAttachments) {
      if (attachment.contentType === "audio/mpeg") {
        addAttachment_(attachment, batch_id);
        setFilesFoundArray(interaction, attachment);
        console.log(`the attachments_`, attachments_);
        numOfNumMessagesWAttachments = theAttachments.length;
        console.log(
          `numOfNumMessagesWAttachments`,
          numOfNumMessagesWAttachments
        );
      }
    }

    let num = batchAttachments(batch_id);

    console.log(`the num of attachments`, numOfNumMessagesWAttachments)

    console.log(`batchAttachments(batch_id)`,num)
    
    if (numOfNumMessagesWAttachments > 0) {
      console.log(`in here`)

      return true;
    }
  }); // now the values of the messages collection are filtered to only include messages with attachments
  // if there are no messages with attachments, run the funciton again after a 10 second delay with the new before id
  console.log(`messages with attachments`, messagesWithAttachments);
  let numOfNumMessagesWAttachments = Array.from(messagesWithAttachments);

  console.log(`numOfNumMessagesWAttachments`, numOfNumMessagesWAttachments);
  console.log(
    `numOfNumMessagesWAttachments length`,
    numOfNumMessagesWAttachments.length
  );

  if (numOfNumMessagesWAttachments.length === 0) {
    console.log(`messages with attachments found in channel is 0`);
    
    // return filesFoundArray(interaction);

    await loadCooldown(interaction);
      return  getMessageAttachments(targetChannel, interaction, batch_id, `${ await b4(interaction)}`, `${ await afterCollection(interaction)}`);
  }
  // if there are messages with attachments, loop through the messages and save the attachments to the database
  else {
    console.log(`messages with attachments was found`);
    // loop through the messages with attachments
    console.log(`the messages with attachments`, messagesWithAttachments);

    let messagesWithAttachments_array = [...messagesWithAttachments.values()];
    console.log(
      `the messages with attachments array`,
      messagesWithAttachments_array
    );

    for (let message of messagesWithAttachments_array) {
      // loop through the attachments in the message
      // log message
      console.log(`the message`, message);

      console.log(`the message.attachment`, message.attachments)

        let testVar1 = message.attachments;

        let messageAttachs = [...message.attachments.values()]
        


      for (let attachment of messageAttachs) {
        console.log(`the attachment array`, attachment); // single attachment not array

        console.log(`the attachment `, attachment[1]);

        let attachmentName = attachment.name;

        console.log(`the attachment name`, attachmentName);

        // save the message that has the attachment to the database
        await saveMessageBatch(message, batch_id, interaction);
      }
    }
    // await deleteDuplicateDocs_Kraken(url, batch_id) 
    // after all the attachments have been saved to the database, run the function again with the new before id
    // update teh before id
    // console.log(`the messages`, messages)
    console.log(`the last message id before cooldown check`, lastMessageID);
    // console.log(`the messages last id`, messages.last().id)
     setBefore(lastMessageID, interaction);

    // calculate the first message in a channel before the before message id, then calulate he timestamp of that message

    // then go through every message in theMessages and if 

    let theMessages = await targetChannel.messages.fetch({
      before: b4(interaction), after: afterCollection(interaction), limit: 100,
    });
    // then calculate the last message from a fetch using only the after id option, then calculate the timestamp of that messagecu

    let theBeforeMessages = await targetChannel.messages.fetch({
      before: b4(interaction), limit: 100,
    });

     let firstB4Message = theBeforeMessages.first();

    let theAfterMessages = await targetChannel.messages.fetch({
      after: afterCollection(interaction), limit: 100,
    });
      // at this point the firstB4Message.id is equal to the afterCollection(interaction)
      // consider checking if there are equal and if so do not continue

      
    let lastAfterMessage = theAfterMessages.last(); // is equal to the lastMessageID
// also the lastAfterMessage is equal to the b4(interaction) id
      // consider checking if there are equal and if so do not continue
    if (firstB4Message?.id === afterCollection(interaction) || lastAfterMessage?.id === b4(interaction) || Array.from(theMessages.values()).length === 0) {
     // await loadCooldown(interaction);
     console.log(`the files found array is =`, filesFoundArray(interaction))
     return filesFoundArray(interaction);
    } else {
      await loadCooldown(interaction);
      return  getMessageAttachments(targetChannel, interaction, batch_id, `${ await b4(interaction)}`, `${ await afterCollection(interaction)}`);
      
    }
  }
};

let getBatchId = () => {
  let batch_id = "";
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let millisecond = date.getMilliseconds();
  batch_id = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
  return batch_id;
};

async function gatherChannelFiles(interaction) {
  let content;
  await interaction.deferReply({ ephemeral: true });
  await sendLoad1(interaction);
  // create unique batch id
  // // batch_id will be a unique id compiled from the current date and time
  let batch_id = getBatchId();
  const originChannelID = interaction.channel.id;
  const targetChannel = await interaction.guild.channels.fetch(originChannelID);
  const targetChannelID = targetChannel.id;
  const lastMessages = await targetChannel.messages.fetch({ limit: 1 });
  let lastMessage = lastMessages.first();
  let lastMessageID;
  if (lastMessage) {
    lastMessageID = lastMessage.id;
  }
  // create a function that goes through and fetches every message in the channel and only returns the messages that have attachments
  let arrayOfFiles = await getMessageAttachments(
    targetChannel,
    interaction,
    batch_id
  );
  // send the files to the user who ran the command in a neat embed
  // if there are no files, send a message saying "No files found"
  console.log(arrayOfFiles);
  if (arrayOfFiles === undefined) {
    content = "No files found";
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
    });
    return;
  }
  // if there are files, send a message with a list of all the files that were sent and the total number of files sent in a neat embed, the list of files will reside in description and the total number of files sent will be in the title.
  else {
    let totalNum = arrayOfFiles.length;
    let description = fileList(arrayOfFiles);
    let title = `Total Files Saved: ${totalNum}`;
    let embed;
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: title,
          description: description,
          color: scripts.getColor(),
        }),
      ],
    });
    let docs = await scripts_mongoDB.getBatch(batch_id);
    console.log(docs);
    console.log(docs.length);
    let files = docs.map((doc) => {
      return doc.attachments;
    });
    // send files individually HERE
    // for every file in the files array, send it to the user who ran the command
    title = `Still Processing Files...`;
    description = fileList(arrayOfFiles);
    embed = createEmb.createEmbed({
      title: title,
      fields: [
        {
          name: "`stats`",
          value: `\`${totalNum}\` \`files saved\``,
        },
      ],
      description: description,
      color: scripts.getSuccessColor(),
    });
    await interaction.editReply({
      embeds: [embed],
      ephemeral: true,
    });

    console.log(`the files`, files);

    let firstFile = files[0];
    console.log(`the first file`, firstFile);

    
    let firstFileArray = [];
    let newArr = [...files.values()];

    console.log(`the new array`, newArr);

    for (let arr of newArr) {
      let arrFilearr = [...arr.values()];
      console.log(`the arr file`, arrFilearr);

      for (let arrFile of arrFilearr) {
        console.log(`the arr file length`, arrFilearr.length);
        console.log(`the arr file #1`, arrFile);
        firstFileArray.push(arrFile);
      }
    }

    //let firstFileArray = [...firstFile.values()];
    console.log(`the first file array`, firstFileArray);

    let allFiles = [filesFoundArray(interaction)];

    allFiles = allFiles[0];

    console.log(`all the files`, allFiles);

    for (let i = 0; i < allFiles.length; i++) {
      console.log(`first file array`, firstFileArray);

      let results = firstFileArray[i];
      console.log(`results`, results);

      let file = allFiles[i];
      console.log(`THE FILE NEEDED FOR CONTENT TYPE`, file);
      // filter to only audio files
      if (file.contentType === `audio/mpeg`) {
        content = `So Far I've Saved \`${
          filesFoundArray(interaction).length
        }\` ${
          filesFoundArray(interaction).length === 1 ? `File` : `Files`
        } from the ${targetChannel.name} channel in the ${
          interaction.guild.name
        } Server\n\nAll the files that we found are being downloaded and processed\n**It takes approx. 1 min per 12 files to complete the dm proccess**\n\n\`${
          Math.round((filesFoundArray(interaction).length / 12) * 100) / 100 <=
          1
            ? `less than 1 minute`
            : (Math.round((filesFoundArray(interaction).length / 12) * 100) /
                100)`minutes`
        } estimated\``;
        description = `**Files Saved:**\n${fileList(
          filesFoundArray(interaction)
        )}`;
        console.log(`the content`, content);

        embed = createEmb.createEmbed({
          title: content,
          description: description,
          color: scripts.getSuccessColor(),
        });
        try {
          await interaction.editReply({
            embeds: [embed],
            ephemeral: true,
          });
        } catch (error) {
          console.log(`error editing last reply`, error);
        }

        // add the attachments name to the filesFound array
        // setFilesFoundArray(interaction.id, file);
        // console.log(`updated the files found array`, filesFoundArray(interaction))
        let currentFileName = file.name;
        // check to see of any files in allFiles have a file.file_name === currentFileName
        // if they do, add a number to the end of the file name
        // if they don't, add the file to allFiles
        let allFilesNames = [];

        console.log(`all files`, allFiles);

        if (allFiles.length > 0) {
          allFilesNames = allFiles.map((file) => {
            return file.file_name;
          });

          console.log(`all files names`, allFilesNames);
        }
        console.log(`current file name`, currentFileName);

        // if (!allFilesNames.includes(currentFileName)) {
        //   console.log(`all files`, allFiles);
        //   console.log(`the file`, file);
        //   allFiles.push(file);
        // }

        let fileObj = {
          file_name: file.name,
          file_url: file.url,
          file_size: `${file.size / 1000000} Mb`,
        };

        console.log(`the file Obj`, fileObj);

        let url = fileObj.file_url;
        let name = fileObj.file_name;
        let size = fileObj.file_size;

        // console.log(url, name, size)

        let fileToSend = new AttachmentBuilder(url, {
          name: name,
          description: size,
        });

        // extract the number from the file size string
        let sizeNum = size.split(" ")[0];
        console.log(`the size num`, sizeNum);
        // if the file is under 8 Mb, send it as a file

        // V2
        //  Here all files are sent indiviually, later in the code they are sent in batches of 10 or less so I don't need this here any more
        console.log(`SENT INDIVIDUALLY`);
        console.log(`the file`, file);

        if (results) {
          console.log(`the file message content`, results.message_content);

          title = results.message_content.embed.title;
          content = results.message_content.content;
          description = results.message_content.embed.description;
          let actionRow = results.message_content.actionRow;
          let buttonObj = {};

          if (results.message_content.button) {
            let { button } = results.message_content.button;
            buttonObj = button;
          }

          embed = createEmb.createEmbed({
            title: title,
            description: description,
            color: scripts.getColor(),
          });
          if (!actionRow) {
            try {
              await interaction.user.send({
                content: content,
                embeds: [embed],
                files: [fileToSend],
              });
              // delay for 3.33 seconds
              await scripts.delay(3333);
            } catch (error) {
              console.log(`Failed to send link for ${name}`, error);
            }
          } else {
            try {
              await interaction.user.send({
                content: content,
                embeds: [embed],
                files: [fileToSend],
                components: [
                  await createActRow.createActionRow({
                    components: [await createBtn.createButton(buttonObj)],
                  }),
                ],
              });
              // delay for 3.33 seconds
              await scripts.delay(3333);
            } catch (error) {
              console.log(`Failed to send link for ${name}`, error);
            }
          }
        }
      }

      console.log(`the file`, file);

      console.log(`the all files`, allFiles);
    }

    // from 2901 to here
    console.log(`targetChannel`, targetChannel);

    content = `✅ All files from ${targetChannel.name} have been sent to your DMs!`;
    description = `**Files Saved:**\n${fileList(filesFoundArray(interaction))}`;

    try {
      await interaction.user.send({
        embeds: [
          createEmb.createEmbed({
            title: content,
            description: description,
            color: scripts.getSuccessColor(),
          }),
        ],
      });
    } catch (error) {
      console.log(
        `____ ----- ____ --- error sending embed to user ____ ----- ____ ---`,
        error
      );
    }
    // edit the original message embed to say "{relevant channel} File Archive Complete!"
    title = `✅ File Archive Complete!`;
    content = `Saved \`${filesFoundArray(interaction).length}\` ${
      filesFoundArray(interaction).length === 1 ? `File` : `Files`
    } from the ${targetChannel.name} channel in the ${
      interaction.guild.name
    } Server\n\nAll the files that we found have been sent to you in dms :wink:`;
    description = `**Files Saved:**\n${fileList(filesFoundArray(interaction))}`;
    console.log(`the content`, content);

    embed = createEmb.createEmbed({
      title: content,
      description: description,
      color: scripts.getSuccessColor(),
    });
    try {
      await interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      console.log(`error editing last reply`, error);
    }
    // await scripts.delay(9990);
    // await interaction.deleteReply();
    return;
  }
}

async function uploadFileBatch(interaction, target, beforeID, afterID ) {
  let content;
  setAfter(afterID, interaction);
  await sendLoad1(interaction);
  // create unique batch id
  // // batch_id will be a unique id compiled from the current date and time
  let batch_id = getBatchId();
  const originChannelID = interaction.channel.id;
  const targetChannel = target ? target : await interaction.guild.channels.fetch(originChannelID);
  console.log(`the target `, target)
  console.log(`the target channel`, targetChannel)
  // create a function that goes through and fetches every message in the channel and only returns the messages that have attachments
  let arrayOfFiles = await getMessageAttachments( // next step
    targetChannel,
    interaction,
    batch_id, 
    beforeID,
    afterID
  );

  // send the files to the user who ran the command in a neat embed
  // if there are no files, send a message saying "No files found"
  console.log(arrayOfFiles);

  if (arrayOfFiles === undefined) {
    content = "No files found";
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
    });
    return;
  }
  // if there are files, send a message with a list of all the files that were sent and the total number of files sent in a neat embed, the list of files will reside in description and the total number of files sent will be in the title.
  else {
    
    console.log(`the array of files`, arrayOfFiles);

    let totalNum = arrayOfFiles.length;
    let description = fileList(arrayOfFiles, 18);
try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `✅ Save Complete!`,
            description: `\`${totalNum}\` \`${
              totalNum === 1 ? `file` : `files`
            } saved\`-----\`batch id: ${batch_id}\`\n\nUse \`/downloadfiles\` command and enter the \`batch id\` to retrieve your results\n\nFiles Saved:\n${description}`,
            color: scripts.getSuccessColor(),
          }),
        ],
        content: `||\`batch id:\` \`${batch_id}\`||`,
      });
} catch (error) {
  console.log(`Most Likely a Large Download and it < Connection Timed Out >`, error);
  interaction.channel.send({embeds: [
    createEmb.createEmbed({
      title: `✅ Save Complete!`,
      description: `Damn <@${interaction.user.id}> , You Downloaded Hella Files Causing a \`< Connection Timed Out >\`\n\`${totalNum}\` \`${
        totalNum === 1 ? `file` : `files`
      } saved\`-----\`batch id: ${batch_id}\`\n\nUse \`/downloadfiles\` command and enter the \`batch id\` to retrieve your results\n\nFiles Saved:\n${description}`,
      color: scripts.getSuccessColor(),
    }),
  ],
  content: `||\`batch id:\` \`${batch_id}\`||`,
});
}
    return;
  }
}

async function downloadFileBatch(batch_id, targetChannel, interaction) {
  

  let models = await scripts_mongoDB.getBatch(batch_id);

  if (models.length === 0) {
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `❌ No Files Found!`,
            content: `\`no files found for batch id: ${batch_id}\``,
            color: scripts.getErrorColor(),
          }),
        ],
      });
    } catch (error) {
      scripts.logError(error, `error editing last reply`);
    }
    return;
  }

  let fileResults = models.map((doc) => {
    return doc._doc.attachments;
  });

  let firstFileArray = [];
  let newArr = [...fileResults.values()];

  console.log(`the new array`, newArr);

  for (let arr of newArr) {
    let arrFilearr = [...arr.values()];
    console.log(`the arr file`, arrFilearr);

    for (let arrFile of arrFilearr) {
      console.log(`the arr file length`, arrFilearr.length);
      console.log(`the arr file #1`, arrFile);
      if (firstFileArray.includes(arrFile)) continue;
      firstFileArray.push(arrFile);
    }
  }
  console.log(`the first file array`, firstFileArray);
  

  let nameArr = [];
firstFileArray.forEach(async result => {
  
    let results = result;
    console.log(`the results`, results);

    console.log(`the file message content`, results.message_content);

  let fileToSend = results.file_url;
  let name = results.file_name;
  if (nameArr.includes(name)) return;
  nameArr.push(name);
  title = results.message_content.embed.title;
  content = results.message_content.content;
  let description = results.message_content.embed.description;
  let actionRow = results.message_content.actionRow;
  let theButton = results.message_content.button;
  console.log(`the button`, theButton)
  let buttonObj = { };

if (actionRow) {
   buttonObj = {
      style: "link",
      label: "Download File to Listen :loud_sound:",
      link: theButton.link,
    };
}


  
  embed = createEmb.createEmbed({
  title: title,
  description: description,
  color: scripts.getColor(),
  });

  if (!actionRow) {
  try {
    
    console.log(`Attempting to send --->`, {
      content: content,
      embeds: [embed],
      files: [fileToSend],
    })
    await targetChannel.send({
      content: content,
      embeds: [embed],
      files: [fileToSend],
    });
    // delay for 3.33 seconds
    await scripts.delay(3333);

  } catch (error) {
    console.log(`Failed to send link for ${name}`, error);

  }

  } else {
  try {
    await targetChannel.send({
      content: content,
      embeds: [embed],
      components: [
        await createActRow.createActionRow({
          components: [await createBtn.createButton(buttonObj)],
        }),
      ],
    });
    // delay for 3.33 seconds
    await scripts.delay(3333);
  } catch (error) {
    console.log(`Failed to send link for ${name}`, error);

  }
  }
});
// for every name in name array add each one to a string on a new line and a dash in front of it
// THIS IS THE LINE W THE EMBED OF DUPLICATES fileList() forms the string list of files
let description = `Files Downloaded:\n\`${fileList(nameArr, 23)}\``;
try{
  await targetChannel.send({
    embeds: [
      createEmb.createEmbed({
        title: `✅ Download from ${targetChannel.name} Complete!`,
        description: description,
        color: scripts.getSuccessColor(),
      }),
    ],
  });
} catch (error) {
  scripts.logError(error, `error sending Public Download Complete message`);
}

  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `✅ Download Complete!`,
          description: description,
          color: scripts.getSuccessColor(),
        }),
      ],
    });
  } catch (error) {
    scripts.logError(error, `error editing last reply`);
  }


  return;
}

async function downloadKrakenBatch(batch_id, targetChannel, interaction) {
  

  let models = await scripts_mongoDB.getBatch(batch_id);

  if (models.length === 0) {
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `❌ No Files Found!`,
            content: `\`no files found for batch id: ${batch_id}\``,
            color: scripts.getErrorColor(),
          }),
        ],
      });
    } catch (error) {
      scripts.logError(error, `error editing last reply`);
    }
    return;
  }

  let fileResults = models.map((doc) => {
    return doc._doc.attachments;
  });

  let firstFileArray = [];
  let newArr = [...fileResults.values()];

  console.log(`the new array`, newArr);

  for (let arr of newArr) {
    let arrFilearr = [...arr.values()];
    console.log(`the arr file`, arrFilearr);

    for (let arrFile of arrFilearr) {
      console.log(`the arr file length`, arrFilearr.length);
      console.log(`the arr file #1`, arrFile);
      firstFileArray.push(arrFile);
    }
  }
  console.log(`the first file array`, firstFileArray);
  

  let nameArr = [];
firstFileArray.forEach(async result => {
  
    let results = result;
    console.log(`the results`, results);

    console.log(`the file message content`, results.message_content);

  let fileToSend = 'https://'.concat(results.file_url.trim());
  let krakenLink = results.message_content.embed.url;
  let name = results.file_name;
  nameArr.push(name);
  title = results.message_content.embed.title;
  content = results.message_content.content;
  let description = results.message_content.embed.description;
  let actionRow = results.message_content.actionRow;
  let theButton = results.message_content.button;
  console.log(`the button`, theButton)
  let buttonObj = { };

if (actionRow) {
   buttonObj = {
      style: "link",
      label: "Download File to Save",
      link: fileToSend,
    };
}


  
  embed = createEmb.createEmbed({
  title: title,
  description: description,
  color: scripts.getColor(),
  url: krakenLink,
  });


  if (!actionRow) {
  try {
    
    console.log(`Attempting to send --->`, {
      content: content,
      embeds: [embed],
      files: [fileToSend],
    })
    await targetChannel.send({
      content: content,
      embeds: [embed],
      files: [fileToSend],
    });
    // delay for 3.33 seconds
    await scripts.delay(3333);

  } catch (error) {
    console.log(`Failed to send link for ${name}`, error);
    

  }

  } else {
  try {
    await targetChannel.send({
      content: content,
      embeds: [embed],
      components: [
        await createActRow.createActionRow({
          components: [await createBtn.createButton(buttonObj)],
        }),
      ],
      files: [fileToSend],
    });
    // delay for 3.33 seconds
    await scripts.delay(3333);
  } catch (error) {
    console.log(`Failed to send link2 for ${name}`, error);
    try {
      await targetChannel.send({
        content: content,
        embeds: [embed],
        components: [
          await createActRow.createActionRow({
            components: [await createBtn.createButton(buttonObj)],
          }),
        ],
      });
      // delay for 3.33 seconds
      await scripts.delay(3333);
    } catch (error) {
      console.log(`Failed to send link for ${name}`, error);
  
    }

  }
  }
});
// for every name in name array add each one to a string on a new line and a dash in front of it
console.log(`the name array`, nameArr)
let description = nameArr>0 ?`Files Downloaded:\n\`${fileList(nameArr, 23)}\``  : `Kraken Files Retrieved`; 
console.log(targetChannel)
try{
  await targetChannel.send({
    embeds: [
      createEmb.createEmbed({
        title: `✅ Download Complete!`,
        description: description,
        color: scripts.getSuccessColor(),
      }),
    ],
  });
} catch (error) {
  scripts.logError(error, `error sending Public Download Complete message`);
}

  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `✅ Download Complete!`,
          description: description,
          color: scripts.getSuccessColor(),
        }),
      ],
    });
  } catch (error) {
    scripts.logError(error, `error editing last reply`);
  }


  return;
}

async function saveKrakenBatch(url, fileName, krakenURL, batch_id, interaction) {
  if (!url || !interaction || !batch_id || !fileName) return;
  // create the attachments array and metadata object
  let attachments = [];
  url = url.replace(/\s/g, '')

  // for every attachment create an attachment object and push it to the attachments array

    // construct the attachments message formatted object
    let messageContent = {};
    let newAttachmentInstance = new AttachmentBuilder(url);
    newAttachmentInstance.setName(fileName);
    newAttachmentInstance.setDescription(`File downloaded from Kraken Files Website`)
      messageContent = {
        files: [newAttachmentInstance],
        embed: {
          title: `${fileName} :loud_sound:`,
          description: `Kraken File : currently unable to retrieve attributes such as size, duration, etc`,
          url: krakenURL
        },
        actionRow: true,
        button: {
          style: "link",
          label: "Download File",
          link: url,
        }
      };

    console.log(`the messageContent`, messageContent);

    // end testing
    let attachment = {
      file_name: fileName,
      file_url: url,
      file_batch_id: batch_id,
      message_content: messageContent,
    };
    attachments.push(attachment);
  // create the metadata object
  let obj = {
    _id: `${new mongoose.Types.ObjectId()}`,
    attachments: attachments,
    batch_id: batch_id,
    file_url: url.replace(/'/g, ''),
  };
  console.log(`The obj:`, obj);
  // run a query to see if a doc with the same (metadata.message_id && batch_id) exists
  let exists = await fetchedFiles.findOne({ batch_id: batch_id, file_url: url });
  // // if it exists, dont save it
  console.log(`exists`, exists)

  if (exists !== null) {
    console.log(`--------------------------`);
    console.log(`--------------------------`);
    console.log(`The doc already exists`);
    console.log(`--------------------------`);
    console.log(`--------------------------`);
    await scripts.delay(10000)
    return;
  }
try {
    await fetchedFiles.create(obj);
} catch (error) {
  console.log(`error creating the fetchedFiles doc`, error);
}
  console.log(`--------------------------`);
  for (i = 0; i < obj.attachments.length; i++) {
    console.log(obj.attachments[i].file_url);
  }
  console.log(`^saved to the database^`);
}

let getMessageKrakenLinkFiles = async (targetChannel, interaction, batch_id, be4, after_) => {
  let krakenLinks = [];
  let krakenFiles = [];
  
  await sendLoad2(interaction);
  setBefore(be4, interaction);
  let after = afterCollection(interaction);
  let before = b4(interaction);
  let messages;
  try{
    console.log(`the target channel name`, targetChannel.name);
    console.log(`the before`, before);
    console.log(`the after`, after);
     // if both are inputed, after will be used and before will be ignored
    messages = await targetChannel.messages.fetch({
    before: before ? before : null, after: after ? after : null, limit: 100,
  }); 

  console.log(`the messages`, messages);
}catch(err){
  scripts.logError(err, 'error fetching');
  return filesFoundArray(interaction)
  }

  let lastMessage = messages.last();
  console.log(`the last message`, lastMessage);

  // if there are no results from the fetch, return the filesFound array
  if (messages.size === 0) {
    console.log(`messages found in channel is 0`);

    return filesFoundArray(interaction);
  }
  let lastMessageID = messages.last().id;
  console.log(`the last message id`, lastMessageID);
  // get the last message id from the messages collection and send it to the b4 function
  setBefore(lastMessageID, interaction);
  console.log(`the before was reset`);
  console.log(`the before was set to`, b4(interaction))

  console.log(`the after is`, after)

  console.log(`the ORIGINAL after is`, after_)

  setAfter(after ? after : null, interaction);

  console.log(`the after was set to`, afterCollection(interaction))
  

  // filter out all the messages that do not have attachments
  let messagesWithKrakenLinks = messages.filter( async (message) => {
    let numOfNumMessagesWAttachments = 0;
    console.log(`the message`, message);
    console.log(`message found`);
    let messageContent = message.content;
    console.log(`the message content`, messageContent);

    // if the message content includes "krakenfiles.com" push the message to the messages array
     if (messageContent.includes("krakenfiles.com")) {
      console.log(`message content includes krakenfiles.com`);
      console.log(`the message content`, message.content);


    // for every message content in the messages array extract every set of characters that begin with "https://krakenfiles.com/view/" and end with ".html" and push it to the krakenLinks array as a single string
    
      let messageContentArray = [];
      messageContentArray.push(messageContent);

      for(let i = 0; i < messageContentArray.length; i++) {
        let link = messageContentArray[i].match(/(https:\/\/krakenfiles\.com\/view\/.*?\.html)/g);
       
        if(link) {
            krakenLinks.push(link[0]);
        }

    }

    // for every link in kraken links, send the link through krakenWebScraper to get the file url
    for (let i = 0; i < krakenLinks.length; i++) {
      let krakenLink = krakenLinks[i];

      console.log(`the kraken link`, krakenLink);
      let url;
      try {
         url = await krakenWebScraper(krakenLink, batch_id, interaction);
         console.log(`the urlHERE is`, url)
          url =  url.replace(/'/g, '').replace('//', '');

      } catch (error) {
        console.log(`Error getting kraken URL from Kraken Site`)
        scripts.logError(error, 'error in kraken webscraper');
        console.log(`the url is`, url)
        console.log(`returning to find more files`)
        return;
      }
      console.log(`the url is`, url)
      // url = krakenWebScraper(krakenLink, "audio");
      // if the url is not null, push the url to the krakenFiles array
      if (url) {
          // delete any duplicate docs saved to the database
        try {
          await scripts_mongoDB.deleteDuplicateDocs_Kraken(url, batch_id);
        } catch (error) {
          console.log(`error deleting duplicate docs`, error)
        }
        krakenFiles.push(url);
        addAttachment_(url, batch_id);
    setFilesFoundArray(interaction, url);
    numOfNumMessagesWAttachments++;
      }
    }
    }

    
    if (numOfNumMessagesWAttachments > 0) {
      console.log(`in here`)

      return true;
    }

  }); // now the values of the messages collection are filtered to only include messages with attachments
  // if there are no messages with attachments, run the funciton again after a 10 second delay with the new before id


  console.log(`messages with attachments`, messagesWithKrakenLinks);
  let numOfNumMessagesWAttachments = krakenFiles;
  console.log(`numOfNumMessagesWAttachments`, numOfNumMessagesWAttachments);
  console.log(
    `numOfNumMessagesWAttachments length`,
    numOfNumMessagesWAttachments.length
  );

  if (numOfNumMessagesWAttachments.length === 0) {
    console.log(`messages with attachments found in channel is 0`);
    await loadCooldown(interaction);
    return getMessageKrakenLinkFiles(targetChannel, interaction, batch_id, `${ await b4(interaction)}`, `${ await afterCollection(interaction)}`);
  }
  // if there are messages with attachments, loop through the messages and save the attachments to the database
  else {
    console.log(`messages with kraken files was found`);
    // loop through the messages with attachments

    for (let link of krakenFiles) {
      // loop through the attachments in the link
      // log link
      console.log(`the link`, link);

     //    await saveKrakenBatch(link, batch_id, interaction);
    }
    // after all the attachments have been saved to the database, run the function again with the new before id
    // update teh before id
    // console.log(`the messages`, messages)
    console.log(`the last message id before cooldown check`, lastMessageID);
    // console.log(`the messages last id`, messages.last().id)
    setBefore(lastMessageID, interaction);
    let theMessages = await targetChannel.messages.fetch({
      before: b4(interaction), after: afterCollection(interaction), limit: 100,
    });
    // then calculate the last message from a fetch using only the after id option, then calculate the timestamp of that messagecu

    let theBeforeMessages = await targetChannel.messages.fetch({
      before: b4(interaction), limit: 100,
    });

     let firstB4Message = theBeforeMessages.first();

    let theAfterMessages = await targetChannel.messages.fetch({
      after: afterCollection(interaction), limit: 100,
    });
      // at this point the firstB4Message.id is equal to the afterCollection(interaction)
      // consider checking if there are equal and if so do not continue

      
    let lastAfterMessage = theAfterMessages.last(); // is equal to the lastMessageID
// also the lastAfterMessage is equal to the b4(interaction) id
      // consider checking if there are equal and if so do not continue
    if (firstB4Message?.id === afterCollection(interaction) || lastAfterMessage?.id === b4(interaction) || Array.from(theMessages.values()).length === 0) {
     // await loadCooldown(interaction);
     // filesFound Array is empty causing errors
    //  console.log(`the files found array is =`, filesFoundArray(interaction))
    //  return filesFoundArray(interaction);
    console.log(`the files found array is =`, krakenFiles)

     return krakenFiles; 
     ;
    } else {
      await loadCooldown(interaction);
      return  getMessageKrakenLinkFiles(targetChannel, interaction, batch_id, `${ await b4(interaction)}`, `${ await afterCollection(interaction)}`);
    }
  }
};

async function uploadKrakenLinksBatch(interaction, target, beforeID, afterID) {
  let content;
  setAfter(afterID, interaction);
  await sendLoad1(interaction);
  // create unique batch id
  // // batch_id will be a unique id compiled from the current date and time
  let batch_id = getBatchId();
  const originChannelID = interaction.channel.id;
  const targetChannel = target ? target : await interaction.guild.channels.fetch(originChannelID);
  console.log(`the target `, target)
  console.log(`the target channel`, targetChannel)
  // create a function that goes through and fetches every message in the channel and only returns the messages that have attachments
  let arrayOfFiles = await getMessageKrakenLinkFiles(
    targetChannel,
    interaction,
    batch_id, 
    beforeID,
    afterID
  );
  // send the files to the user who ran the command in a neat embed
  // if there are no files, send a message saying "No files found"
  console.log(`The array of found files`,arrayOfFiles);
  // check for any duplicate in the array and if so remove them
  arrayOfFiles = arrayOfFiles.filter((item, index) => arrayOfFiles.indexOf(item) === index);

  if (arrayOfFiles === undefined) {
    content = "No files found";
    await interaction.editReply({
      embeds: [createEmb.createEmbed({ title: content })],
    });
    return;
  }
  // if there are files, send a message with a list of all the files that were sent and the total number of files sent in a neat embed, the list of files will reside in description and the total number of files sent will be in the title.
  else {
    console.log(`the array of files`, arrayOfFiles);

    let totalNum = arrayOfFiles.length;
    let description = fileList(arrayOfFiles, 18);
try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `✅ Save Complete!`,
            description: `\`${totalNum}\` \`${
              totalNum === 1 ? `file` : `files`
            } saved\`-----\`batch id: ${batch_id}\`\n\nUse \`/downloadfiles\` command and enter the \`batch id\` to retrieve your results\n\nFiles Saved:\n${description}`,
            color: scripts.getSuccessColor(),
          }),
        ],
        content: `||\`batch id:\` \`${batch_id}\`||`,
      });
    } catch (error) {
      console.log(`Most Likely a Large Download and it < Connection Timed Out >`, error);
      interaction.channel.send({embeds: [
        createEmb.createEmbed({
          title: `✅ Save Complete!`,
          description: `Damn <@${interaction.user.id}> , You Downloaded Hella Files Causing a \`< Connection Timed Out >\`\n\`${totalNum}\` \`${
            totalNum === 1 ? `file` : `files`
          } saved\`-----\`batch id: ${batch_id}\`\n\nUse \`/downloadfiles\` command and enter the \`batch id\` to retrieve your results\n\nFiles Saved:\n${description}`,
          color: scripts.getSuccessColor(),
        }),
      ],
      content: `||\`batch id:\` \`${batch_id}\`||`,
    });
    }

    return;
  }
}

let getRandID = () =>
{ 
  let randID = "";
  let date = new Date();
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let millisecond = date.getMilliseconds();
  randID = `#${Math.floor(Math.random() * 999) + 999}${year}${month}${day}${hour}${minute}${second}${millisecond}`;
  return randID;
}

module.exports = {
  getRandID,
  beginFileFetch,
  getInteractionObj,
  getMemberInfoObj,
  getCommands,
  krakenWebScraper,
  embed_FileSizeTooBig,
  row_FileSizeTooBig,
  embed_Announcement_NoFile,
  embed_Announcement_File,
  button_NewLeak,
  button_NewOGFile,
  button_NewStudioSession,
  button_NewSnippet,
  button_CustomAnnouncement,
  modal_NewLeak,
  modal_NewOGFile,
  modal_NewStudioSession,
  modal_NewSnippet,
  modal_NewCustomAnnouncement,
  extractID,
  createAnnounceEmbed,
  sendDraft,
  getModalInput_A,
  getModalInput_B,
  getModalInput_C,
  embed_NoPermission,
  errEmbed,
  createFinalAnnouncement,
  row_Attachment,
  row_Draft,
  getOnlineCount,
  getOfflineCount,
  getIdleCount,
  getDndCount,
  getBotCount,
  getHumanCount,
  getOnlineHumans,
  getOnlineBots,
  getOfflineHumans,
  getOfflineBots,
  getMemberCount,
  getServerInfoObj,
  announce,
  fileCheck,
  gatherChannelFiles,
  uploadFileBatch,
  downloadFileBatch,
  uploadKrakenLinksBatch,
  downloadKrakenBatch,
  getAlertEmoji,
  krakenFileSizeFinder,
  krakenTitleFinder
};
