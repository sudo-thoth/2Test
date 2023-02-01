const createEmb = require("../create/createEmbed.js");
const scripts = require("../scripts/scripts.js");
const createBtn = require("../create/createButton.js");
const createActRow = require("../create/createActionRow.js");
const createMdl = require("../create/createModal.js");
const createSelMenu = require("../create/createSelectMenu.js");
const axios = require("axios").default;
const scripts_mongoDB = require("../scripts/scripts_mongoDB.js");
const announcementData = require("../../../MongoDB/db/schemas/schema_announcement.js");


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

let getAlertEmoji = () => {
  let alertEmojis = [`🫵🏿`, `🛎️`, `📬`, `💌`, `🆕`, `🔔`, `📣`, `📢`, `📳`, `🪬`];
  let random = Math.floor(Math.random() * alertEmojis.length);
  return alertEmojis[random];
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
      customID: `${interaction.customId}`,
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

  function extractID(str){
    if (str === undefined) return;
    console.log(`THE STRING:`,str);
    if (str.includes('#')) {
      let id = `#${str.split('#')[1]}`;
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
// // Embeds
const embed_Announcement_NoFile = (interaction, randID) => {
 let embed = createEmb.createEmbed({
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
return embed;
}
const embed_Announcement_File = (interaction, randID) => {
  let embed = createEmb.createEmbed({
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
return embed;
}
// // Buttons
const button_NewLeak = (randID) => {
  let button =  createBtn.createButton({
  customID: `newleak${randID}`,
  label: `New Leak`,
  style: `danger`,
});
return button;
}
const button_NewOGFile = (randID) => {
  let button = createBtn.createButton({
  customID: `ogfile${randID}`,
  label: `New OG File Leak`,
  style: `danger`,
});
return button;
}
const button_NewStudioSession = (randID) => {
  let button = createBtn.createButton({
  customID: `studiosession${randID}`,
  label: `New Studio Sessions`,
  style: `danger`,
});
return button;
}
const button_NewSnippet = (randID) => {
 let button = createBtn.createButton({
  customID: `snippet${randID}`,
  label: `New Snippet`,
  style: `danger`,
});
return button;
}
const button_CustomAnnouncement = (randID) => {
  let button = createBtn.createButton({
  customID: `custom${randID}`,
  label: `Custom Announcement`,
  style: `primary`,
});
return button;
}
const button_GroupBuy = (randID) => {
  let button = createBtn.createButton({
  customID: `groupbuybtn${randID}`,
  label: `Group Buy`,
  style: `secondary`,
});
return button;
} // TODO: Make an embed w actionrows w buttons for the group buy button

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
}
// on button cancel interaction, disable all buttons
const button_Cancel = (randID) => {
  let button = createBtn.createButton({
  customID: `cancel${randID}`,
  label: `Cancel`,
  style: `danger`,
});
return button;
}

const button_Download = (randID, mute) => {
  // throw error saying I need to retrieve the attachmentURL in button_download

  throw new Error("I need to retrieve the attachmentURL in button_download");

  // get attachmentURL
  let attachment;
  let button = createBtn.createButton({
  link: attachment,
  label: `Download`,
  style: `link`,
  disabled: mute,
});
return button;
}
const button_View = (randID, mute) => {
  let button = createBtn.createButton({
  customID: `view${randID}`,
  label: `View`,
  style: `primary`,
  disabled: mute,
});
return button;
}

const button_DirectMessage = (randID, mute) => {
  let button = createBtn.createButton({
  customID: `directmessage${randID}`,
  label: `Direct Message`,
  style: `secondary`,
  disabled: mute,
});
return button;
}



// // Action Rows
// Returns a promise ; So must await when calling this function
const row2_Announcement = async (randID) => {
  let row = createActRow.createActionRow({
  components: [
    button_NewLeak(randID),
    button_NewOGFile(randID),
    button_NewStudioSession(randID),
    button_NewSnippet(randID),
    button_GroupBuy(randID),
  ],
});
let theRow = await row;
console.log(theRow)
return row; // a promise
}
const row_Announcement = async (randID) => {
  let row = createActRow.createActionRow({
  components: [
    button_CustomAnnouncement(randID)
  ],
});
let theRow = await row;
console.log(theRow)
return row; // a promise
}

const row_Attachment = async (randID, mute) => {
  // check to make sure the attachment is a file if it is a file type then send download button, view button, and dm button. But if the attachment is a link then just send the download button and the dm button
  let row = createActRow.createActionRow({
  components: [
    button_Download(randID, mute), // link button
    button_View(randID, mute),
    button_DirectMessage(randID, mute),
  ],
});
let theRow = await row;
console.log(theRow)
return row; // a promise
}


const row_Draft = async (randID) => {
  let row = createActRow.createActionRow({
  components: [
    button_Confirm(randID),
    button_Cancel(randID),
  ],
});
let theRow = await row;
console.log(theRow)
return row; // a promise
}

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
      required: true
  },
  {
      customID: "altLeakNames",
      label: "If there are alternate titles, separate (,)",
      style: "short",
      placeholder: "Dark Knight,Seen A Soul Like Yours,Hold U",
      required: false
  },
  {
    customID: `dateOfLeak`,
    label: `Input the date the leak occurred`, 
    style: `short`,
    placeholder: `October 25th 2021`,
    required: true
  },
  {
    customID: `price`,
    label: `Enter the price if bought or skip`,
    style: `short`,
    placeholder: `$25,000`,
    required: false
  },
  {
    customID: `notes`,
    label: `Any more info to send in announcement?`,
    style: `long`,
    placeholder: `Adore You was group bought in a bundle along with PITR and one other song`,
    required: false
  },

]
}
let modal = createMdl.createModal(modalObj);
return modal;

}
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
      required: true
  },
  {
      customID: "altLeakNames",
      label: "If there are alternate titles, separate (,)",
      style: "short",
      placeholder: "Dark Knight,Seen A Soul Like Yours,Hold U",
      required: false
  },
  {
    customID: `dateOfLeak`,
    label: `Input the date the leak occurred`,
    style: `short`,
    placeholder: `October 25th 2021`,
    required: true
  },
  {
    customID: `price`,
    label: `Enter the price if bought or skip`,
    style: `short`,
    placeholder: `$25,000`,
    required: false
  },
  {
    customID: `notes`,
    label: `Any more info to send in announcement?`,
    style: `long`,
    placeholder: `Adore You was group bought in a bundle along with PITR and one other song`,
    required: false
  },
]
}
let modal = createMdl.createModal(modalObj);
return modal;
}
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
      required: true
  },
  {
      customID: "altLeakNames",
      label: "If there are alternate titles, separate (,)",
      style: "short",
      placeholder: "Dark Knight,Seen A Soul Like Yours,Hold U",
      required: false
  },
  {
    customID: `dateOfLeak`,
    label: `Input the date the leak occurred`,
    style: `short`,
    placeholder: `October 25th 2024`,
    required: true
  },
  {
    customID: `price`,
    label: `Enter the price if bought or skip`,
    style: `short`,
    placeholder: `$25,000`,
    required: false
  },
  {
    customID: `notes`,
    label: `Any more info to send in announcement?`,
    style: `long`,
    placeholder: `Adore You was group bought in a bundle along with PITR and one other song a few years ago before the sessions were leaked`,
    required: false
  },
]
}
let modal = createMdl.createModal(modalObj);
return modal;
}
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
      required: true
  },
  {
      customID: "altLeakNames",
      label: "If there are alternate titles, separate (,)",
      style: "short",
      placeholder: "Dark Knight,Seen A Soul Like Yours,Hold U",
      required: false
  },
  {
    customID: `era`,
    label: `era of the leak`,
    style: `short`,
    placeholder: `DRFL`,
    required: true
  },
  {
    customID: `notes`,
    label: `Any additional notes to send in announcement?`,
    style: `long`,
    placeholder: `Adore You was group bought in a bundle along with PITR and one other song`,
    required: false
  }
]
}
let modal = createMdl.createModal(modalObj);
return modal;
}
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
      required: true
  },
  {
      customID: "description",
      label: "What is the announcement description?",
      style: "short",
      placeholder: "1 Year Free Nitro Giveaway",
      required: false
  },
  {
    customID: `content`,
    label: `Add content for the announcement (if you have content, you must have a sub-header)`,
    style: `long`,
    placeholder: `It's Jarad's Birthday so we are giving away Free Nitro!`,
    required: false
  },
  {
    customID: `contentHeader`,
    label: `Add a sub-header for the content (if you have a sub-header, you must enter content)`,
    style: `short`,
    placeholder: `Happy Birthday Jarad`,
    required: false
  },
  {
    customID: `additionalDetails`,
    label: `Any additional details? (optional)`,
    style: `long`,
    placeholder: `Next Year on J's Birthday we will give away more Nitro!, 999`,
    required: false
  },
]
}
let modal = createMdl.createModal(modalObj);
return modal;
}
// Get Modal Input
const getModalInput_A = (randID, interaction) => {
  let leakName, altLeakNames, dateOfLeak, price, notes;
  let modalObj = {};
  if (interaction.fields.getTextInputValue("leakName")) {
    leakName = interaction.fields.getTextInputValue("leakName");
    if (scripts.isDefined(leakName)){
      modalObj.leakName = leakName;
    }
}
if (interaction.fields.getTextInputValue("altLeakNames")) {
    altLeakNames = interaction.fields.getTextInputValue("altLeakNames");
    if (scripts.isDefined(altLeakNames)){
      modalObj.altLeakNames = altLeakNames;
    }
}
if (interaction.fields.getTextInputValue("dateOfLeak")) {
    dateOfLeak = interaction.fields.getTextInputValue("dateOfLeak");
    if (scripts.isDefined(dateOfLeak)){
      modalObj.dateOfLeak = dateOfLeak;
    }
}
if (interaction.fields.getTextInputValue("price")) {
    price = interaction.fields.getTextInputValue("price");
    if (scripts.isDefined(price)){
      modalObj.price = price;
    }
}
if (interaction.fields.getTextInputValue("notes")) {
    notes = interaction.fields.getTextInputValue("notes");
    if (scripts.isDefined(notes)){
      modalObj.notes = notes;
    }
  
}

console.log(modalObj)

return modalObj;
}
const getModalInput_B = (randID, interaction) => {
  let leakName, altLeakNames, dateOfLeak, era, notes;
  let modalObj = {};
  if (interaction.fields.getTextInputValue("leakName")) {
    leakName = interaction.fields.getTextInputValue("leakName");
    if (scripts.isDefined(leakName)){
      modalObj.leakName = leakName;
    }
}
if (interaction.fields.getTextInputValue("altLeakNames")) {
    altLeakNames = interaction.fields.getTextInputValue("altLeakNames");
    if (scripts.isDefined(altLeakNames)){
      modalObj.altLeakNames = altLeakNames;
    }
}
if (interaction.fields.getTextInputValue("dateOfLeak")) {
    dateOfLeak = interaction.fields.getTextInputValue("dateOfLeak");
    if (scripts.isDefined(dateOfLeak)){
      modalObj.dateOfLeak = dateOfLeak;
    }
}
if (interaction.fields.getTextInputValue("era")) {
    era = interaction.fields.getTextInputValue("era");
    if (scripts.isDefined(era)){
      modalObj.era = era;
    }
}
if (interaction.fields.getTextInputValue("notes")) {
    notes = interaction.fields.getTextInputValue("notes");
    if (scripts.isDefined(notes)){
      modalObj.notes = notes;
    }
  
}

return modalObj;
}
const getModalInput_C = (randID, interaction) => {
  let title, description, content, contentHeader, additionalDetails;
  let modalObj = {};
  if (interaction.fields.getTextInputValue("title")) {
    title = interaction.fields.getTextInputValue("title");
    if (scripts.isDefined(title)){
      modalObj.title = title;
    }
}
if (interaction.fields.getTextInputValue("description")) {
    description = interaction.fields.getTextInputValue("description");
    if (scripts.isDefined(description)){
      modalObj.description = description;
    }
}
if (interaction.fields.getTextInputValue("content")) {
    content = interaction.fields.getTextInputValue("content");
    if (scripts.isDefined(content)){
      modalObj.content = content;
    }
}
if (interaction.fields.getTextInputValue("contentHeader")) {
    contentHeader = interaction.fields.getTextInputValue("contentHeader");
    if (scripts.isDefined(contentHeader)){
      modalObj.contentHeader = contentHeader;
    }
}
if (interaction.fields.getTextInputValue("additionalDetails")) {
    additionalDetails = interaction.fields.getTextInputValue("additionalDetails");
    if (scripts.isDefined(additionalDetails)){
      modalObj.additionalDetails = additionalDetails;
    }
  
}

return modalObj;
}

function createAnnounceEmbed(randID, modalInput, num, interaction){
  if(!num) return; // maybe throw error in the future TODO
  let embed;
  const intObj = getInteractionObj(interaction);
  const {userInfo} = intObj;
  const {name, avatar, userId} = userInfo; 
  let {
    leakName, altLeakNames, dateOfLeak, price, notes, era, title, description, content, contentHeader, additionalDetails
    } = modalInput;
    
switch (num){
  case 1:
  
  if (!scripts.isDefined(price)) {
    price = "FREE";
  }
  if (!scripts.isDefined(notes)) {
    notes = "";
  }
  if (!scripts.isDefined(altLeakNames)) {
    altLeakNames = "";
  }
  embed = createEmb.createEmbed({
    title: `${leakName}`,
    description: `New Leak`,
    color: `${scripts.getColor()}`,
    author: {
            name: '',
            id: userId,
            iconURL: avatar,
            url: `https://discord.com/users/${userId}`
        },
        footer: { text: null, iconURL: avatar },
        thumbnail: `${interaction.guild.iconURL() ? interaction.guild.iconURL() : null}`,
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
      {
        name: "From ✍🏿",
        value: `<@${userId}>`,
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
      }
    ]
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
    author: {
      name: name,
      id: userId,
      iconURL: avatar,
      url: `https://discord.com/users/${userId}`
  },
  footer: { iconURL: avatar },
  thumbnail: `${interaction.guild.iconURL() ? interaction.guild.iconURL() : null}`,
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
      {
        name: "From ✍🏿",
        value: `<@${userId}>`,
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
      }
    ]
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
    author: {
      name: name,
      id: userId,
      iconURL: avatar,
      url: `https://discord.com/users/${userId}`
  },
  footer: { iconURL: avatar },
  thumbnail: `${interaction.guild.iconURL() ? interaction.guild.iconURL() : null}`,
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
      }
    ]
  });
  break;

  default:
  // throw error 
  break;
}
return embed;
}

async function sendDraft(randID, interaction){

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


  let doc = await scripts_mongoDB.getData(randID) // get data from db
  console.log(`The data`, doc)
  let targetChannel = doc.targetChannel; // channel ID
  let roles = doc.roles; // array of roles
  let attachmentURL = doc.attachmentURL; // attachment URL
  let {title, description, color, author, fields, thumbnail} = doc.embed; // embedBuilder
  let {name,  icon_url, url} = author;
  let avatar = icon_url;
  let row_Top = null;
  console.log(`attachmentURL :`, attachmentURL)
  if (attachmentURL === null){
    console.log(`PATH A`)
    row_Top = null;
  } else {
    console.log(`PATH B`)
    row_Top = await row_Attachment(randID, true); // row_Top
  }
  let row_Bottom = await row_Draft(randID); // row_Bottom

  // create a function that takes in an array of strings and for every string it adds it to the same string but each on a new line
  // example : ["@everyone", "@here", "@role"] => "@everyone\n@here\n@role"



  let rolesString = (roles) => {
    let str = `${getAlertEmoji()} :`;
    roles.forEach(role => {
      str += ` ${role} `
    });
    return str;
  }


console.log(`components :`,doc.components) // undefined
// console.log(`component 2 : 1 : customID `, doc.components[1].components[0].custom_id)
// console.log(`component 2 : 2 : customID `, doc.components[1].components[1].custom_id)

let array = [];
if (row_Top === null){
  console.log(`PATH C`)
  array = [
    row_Bottom
  ]
} else {
  console.log(`PATH D`)
  array = [
    row_Top,
    row_Bottom
  ]
}

let text = roles !== [] ? `Are you sure you want to send to channel: ${targetChannel} ?\n${rolesString(roles)}` : `Are you sure you want to send to channel: ${targetChannel} ?`
  interaction.editReply({
    content: text,
    embeds: [createEmb.createEmbed({
      title: title,
      description: description,
      color: color,
      author: author,
      fields: fields,
      thumbnail: thumbnail ? thumbnail : null,
      footer: { text: '999' ,iconURL: avatar }
    })
    ],
    ephemeral: true,
    components: array,
    
  });

  
  // const completeEmbed = {
  //   content: roles.length ? `Are you sure you want to send to channel: ${targetChannel} ?\nAlerting : ${roles}` : `Are you sure you want to send to channel: ${targetChannel} ?`,
  //   embeds: [sendEmbed],
  //   ephemeral: true,
  //   components: [
  //     ActionRowBuilder.from({
  //       components: [
  //         ButtonBuilder.from({
  //           customId: "sendAnnouncement",
  //           label: "Send Announcement",
  //           style: ButtonStyle.Danger,
  //         }),
  //       ],
  //     }),
  //   ],
  //   files: [
  //     ...(attachment.length
  //       ? [
  //           {
  //             attachment,
  //           },
  //         ]
  //       : []),
  //   ],
  // };
    console.log("FINALLY DONE W BUG TESTING")

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
}