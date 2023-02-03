const createEmb = require("../create/createEmbed.js");
const scripts = require("../scripts/scripts.js");
const createBtn = require("../create/createButton.js");
const createActRow = require("../create/createActionRow.js");
const createMdl = require("../create/createModal.js");
const createSelMenu = require("../create/createSelectMenu.js");
const axios = require("axios").default;
const scripts_mongoDB = require("../scripts/scripts_mongoDB.js");
const announcementData = require("../../../MongoDB/db/schemas/schema_announcement.js");
const { EmbedBuilder, PermissionsBitField } = require("discord.js");


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
      roles: interaction.member.roles
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
const embed_NoPermission = (interaction) => {
 if (!interaction)return;
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

}

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

async function fileCheck(link) {
  console.log("🚀 ~ Initiating fileCheck.js ~ line 5");

  if (typeof link !== "string") {
    console.log("Link is not a string, returning empty handed, therefor undefined");
    return null;
  } else {
    // need to check last four char to be either .jpg .png .mp3 .mp4 .m4a or .jpeg to be defined as a file, then check size of only the files
    console.log(`Checking Link File Size  : ${link} . . . line 12 fileCheck.js`);
    const response = await fetch(link, { method: "HEAD" });
    const size = response.headers.get("content-length");
    // console.log(`Size : ${size} Vs. ${8 * 1024 * 1024}`);
    
    if (link.includes(".mov") || size >= 8 * 1024 * 1024 || size === null || size === undefined) {
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
  if (doc){
    attachmentURL = doc.attachmentURL;
  } else {
    attachmentURL = "https://google.com/";
  }
  console.log(`attachmentURL : ${attachmentURL}`)
    let button = createBtn.createButton({
      link: attachmentURL,
      label: `Download`,
      style: `link`,
      disabled: mute,
    }, randID);
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
    await button_NewLeak(randID),
    await button_NewOGFile(randID),
    await button_NewStudioSession(randID),
    await button_NewSnippet(randID),
    await button_GroupBuy(randID),
  ],
});
console.log(`row2_Announcement()`)
return row; // a promise
}


const row_Announcement = async (randID) => {
  let row = createActRow.createActionRow({
  components: [
    await button_CustomAnnouncement(randID)
  ],
});
console.log(`row_Announcement()`)
return row; // a promise
}

const row_Attachment = async (randID, mute) => {
  // check to make sure the attachment is a file if it is a file type then send download button, view button, and dm button. But if the attachment is a link then just send the download button and the dm button
  let row = createActRow.createActionRow({
  components: [
    await button_Download(randID, mute), // link button
    await button_View(randID, mute),
    await button_DirectMessage(randID, mute),
  ],
});
console.log(`row_Attachment()`)
return row; // a promise
}


const row_Draft = async (randID) => {
  let row = createActRow.createActionRow({
  components: [
    await button_Confirm(randID),
    await button_Cancel(randID),
  ],
});
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
    customID: `era`,
    label: `Era`,
    style: `short`,
    placeholder: `DRFL`,
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
    placeholder: `Before the Sessions, Adore You was group bought for $25,000 in a bundle along with PITR among others`,
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
    label: `Add content for the announcement`,
    style: `long`,
    placeholder: `(if you have content, you must have a sub-header)`,
    required: false
  },
  {
    customID: `contentHeader`,
    label: `Add a sub-header for the content`,
    style: `short`,
    placeholder: `(if you have a sub-header, you must enter content)`,
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
console.log(`modalObj 1`, modalObj)
if (interaction.fields.getTextInputValue("era")) {
    era = interaction.fields.getTextInputValue("era");
    if (scripts.isDefined(era)){
      modalObj.era = era;
    }
}
console.log(`modalObj 2`, modalObj)
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
// HERES
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
    thumbnail: interaction.guild.iconURL ? interaction.guild.iconURL({dynamic: true}) : 'https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg',
      footer: { text: interaction.member.user.displayName ,iconURL: avatar },
      author: { name: `New Leak`, iconURL: `https://cdn.discordapp.com/emojis/867536090961281034.gif?size=44&quality=lossless` },
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
    thumbnail: interaction.guild.iconURL() ? interaction.guild.iconURL({dynamic: true}) : 'https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg',
      footer: { text: interaction.member.user.displayName ,iconURL: avatar },
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
    thumbnail: interaction.guild.iconURL ? interaction.guild.iconURL({dynamic: true}) : 'https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg',
      footer: { text: interaction.member.user.displayName ,iconURL: avatar },
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
    thumbnail: interaction.guild.iconURL ? interaction.guild.iconURL({dynamic: true}) : 'https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg',
      footer: { text: interaction.member.user.displayName ,iconURL: avatar },
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
      }
    ]
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
    thumbnail: interaction.guild.iconURL ? interaction.guild.iconURL({dynamic: true}) : 'https://media.discordapp.net/attachments/969397226373804082/1070659056286564403/Juice_2.jpeg',
      footer: { text: interaction.member.user.displayName ,iconURL: avatar },
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

let rolesString = (roles) => {
  let str = `${getAlertEmoji()} :`;
  roles.forEach(role => {
    str += ` ${role} `
  });
  return str;
}
async function announce(interaction) {
  if (!interaction) return;
  let interactionObj = getInteractionObj(interaction)
  let {memberPerms,  userInfo } = interactionObj;
  let { name, displayName, roles, role } = userInfo;
  if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    console.log(`${displayName === name ? `${displayName}` : `${displayName} aka { ${name} }`} has permission to use this command`);
     await interaction.deferReply({ ephemeral: true })
  console.log(`🦾 ~ <<Announce>> Command Entered`);
  let randID = `#${Math.floor(Math.random() * 90000) + 10000}`;
  

  

  // The attachment if the user to includes an attachment
  let attachment = null, role1 = null, role2 = null, role3 = null, targetChannel;
  attachment = interaction.options.getAttachment("attachment") ? interaction.options.getAttachment("attachment") : null;
  
  role1 = interaction.options.getRole("role1") ? interaction.options.getRole("role1") : null;
 
  role2 = interaction.options.getRole("role2") ? interaction.options.getRole("role2") : null;
  
  role3 = interaction.options.getRole("role3") ? interaction.options.getRole("role3") : null;
  
  targetChannel = interaction.options.getChannel("sendto");
  

  let roles = [role1, role2, role3];
  if (roles.length <= 0) {
    roles = [];
  } else {
    roles = roles.filter((role) => role != null );
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
  }

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
  console.log(`Is attachment valid?`, validStatus)
  

  // SWITCH TO CHECK THE OUTCOME OF VALID SIZE AND GO FORWARD ACCORDINGLY
  let message_ValidFile, message_fileSizeTooBig, message_NoAttachment;
  let row,row2,rowAttachment;

  switch (validStatus) {
    // : VALID FILE PRESENT
    case 0:
      console.log(
        `Sending Q: \'What kind of Announcement would you like to make? \'`
      );
       row = await row_Announcement(randID) // the row with the custom announcement option
       row2 = await row2_Announcement(randID) // the row with leak type announcements and gb button
       rowAttachment = await row_Attachment(randID, true) // the attachment buttons : disabled until final announcement is made

      message_ValidFile = {
        ephemeral: true,
        embeds: [embed_Announcement_File(interaction, randID)],
        components: [
          rowAttachment, row, row2
        ],
      }

     // interaction.reply();

      break;

    // : INVALID FILE PRESENT
    case -1:
      console.log(`Sending -1 interaction`);
      let embed = embed_FileSizeTooBig(interaction, randID)
      let choiceRow = row_FileSizeTooBig(randID)

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
      row = await row_Announcement(randID) // the row with the custom announcement option
      row2 = await row2_Announcement(randID) // the row with leak type announcements and gb button

      message_NoAttachment = {
        ephemeral: true,
        embeds: [embed_Announcement_NoFile(interaction, randID)],
        components: [row, row2],
      }
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
  let message = getDefined(message_ValidFile, message_fileSizeTooBig, message_NoAttachment);
  console.log(`Message is`, message)
  try {
    console.log(`interaction reply 15`)
     await interaction.editReply(message);
   // interaction.reply(message);

  }
  catch(error) {

    scripts.logError(error, "unable to send reply message")

  }

} else {
  // don't run command
  console.log(`${displayName === name ? `${displayName}` : `${displayName} aka { ${name} }`} does not have permission to use this command`);
  console.log(`${displayName === name ? `${displayName}` : `${displayName} aka { ${name} }`}  highest role is ${role}`)
  try {
    console.log(`interaction reply 6`)
  await interaction.reply({ ephemeral: true, embeds: [embed_NoPermission(interaction)] })
  } catch(error) {
    scripts.logError(error, 'Was not able to complete the `NO PERMISSIONS` reply')
  }

}
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
  // console.log(`The data`, doc)
  let targetChannel = doc.targetChannel; // channel ID
  let roles = doc.roles; // array of roles
  let attachmentURL = doc.attachmentURL; // attachment URL
  let {title, description, color, author, fields, thumbnail} = doc.embed; // embedBuilder
  let icon_url_;
  if (author) {
    let {name,  icon_url, url} = author;
    icon_url_ = icon_url;
  }
  console.log(`the fields`, fields)
  
  let avatar = icon_url_;
  let row_Top = null;
  console.log(`attachmentURL :`, attachmentURL)
  if (attachmentURL === null){
  //  console.log(`PATH A`)
    row_Top = null;
  } else {
  //  console.log(`PATH B`)
    row_Top = await row_Attachment(randID, true); // row_Top
  }
  let row_Bottom = await row_Draft(randID); // row_Bottom

let array = [];
if (row_Top === null){
//  console.log(`PATH C`)
  array = [
    row_Bottom
  ]
} else {
//  console.log(`PATH D`)
  array = [
    row_Top,
    row_Bottom
  ]
}


let text = roles !== [] ? `Are you sure you want to send to channel: ${targetChannel} ?\n${rolesString(roles)}` : `Are you sure you want to send to channel: ${targetChannel} ?`
console.log(`interaction reply 17`)
  interaction.editReply({
    content: text,
    embeds: [createEmb.createEmbed({
      title: title,
      description: description,
      color: color,
      fields: fields,
      thumbnail: thumbnail ? thumbnail.url : (interaction.guild.icon ? interaction.guild.iconURL({dynamic: true}) : 'https://media.discordapp.net/attachments/969397226373804082/1070662471683149844/ezgif.com-gif-maker.jpg'),
      footer:  (avatar ? {text: interaction.member.user.displayName ,iconURL: avatar} : { } )
    })
    ],
    ephemeral: true,
    components: array,
    
  });

    console.log("DONE W sending DRAFT")

}

let errEmbed =  () => {
  return new EmbedBuilder()
.setColor("#FF0000")
.setTitle("❗️ Error")
.setDescription("Invalid properties were given to create the embed");
}

let errMessage = () => {
  return {embeds: [errEmbed()]}
}


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
     console.log(`Final Embed Info:`, embed)
     title = `${title}`
     console.log(`The Title:`, title)
     
      console.log(`The Description:`, description)
      console.log(`The Color:`, color)
      console.log(`The Thumbnail:`, thumbnail)
      console.log(`The Image:`, image)
      console.log(`The Footer:`, footer)
      console.log(`The Author:`, author)
      console.log(`The Fields:`, fields)

	
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
	      thumbnail: thumbnail ? thumbnail.url : (interaction.guild.icon ? interaction.guild.iconURL({dynamic: true}) : 'https://media.discordapp.net/attachments/969397226373804082/1070662471683149844/ezgif.com-gif-maker.jpg'),
	      image: image ? image : null,
	      footer: footer ? footer : [],
	      author: author ? author : [],
	      fields: fields ? fields : [],
	
	   });
	
     
     componentArray = [row_Top];

	    let finalAnnouncementMessage = {
	      content: text,
	      embeds: [finalEmbed],
	      components: componentArray === [undefined] || componentArray === [] ? [] : componentArray,
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
  scripts.logError(error)

  return errMessage();
	
}
}

let getOnlineCount = async ( interaction ) => {
  let onlineCount = 0;

  const cache = await interaction.guild.members.fetch();
  let fetchedMembers = cache.filter(ctx.presence?.status === 'online');
  onlineCount = fetchedMembers.size;
  return onlineCount;
};

let getOfflineCount = ( interaction ) => {
  let offlineCount = 0;
  interaction. guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalOffline = fetchedMembers.filter(member => member.presence?.status === 'offline');
    offlineCount = totalOffline.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return offlineCount;
};

let getIdleCount = ( interaction ) => {
  let idleCount = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalIdle = fetchedMembers.filter(member => member.presence?.status === 'idle');
    idleCount = totalIdle.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return idleCount;
};

let getDndCount = ( interaction ) => { 
  let dndCount = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalDnd = fetchedMembers.filter(member => member.presence?.status === 'dnd');
    dndCount = totalDnd.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return dndCount;
};

let getBotCount = ( interaction ) => {
  let botCount = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalBots = fetchedMembers.filter(member => member.user.bot);
    botCount = totalBots.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return botCount;
};

let getHumanCount = ( interaction ) => {
  let humanCount = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalHumans = fetchedMembers.filter(member => !member.user.bot);
    humanCount = totalHumans.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return humanCount;
};

let getOnlineHumans = ( interaction ) => {
  let onlineHumans = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalOnlineHumans = fetchedMembers.filter(member => member.presence?.status === 'online' && !member.user.bot);
    onlineHumans = totalOnlineHumans.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return onlineHumans;
};

let getOnlineBots = ( interaction ) => {
  let onlineBots = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalOnlineBots = fetchedMembers.filter(member => member.presence?.status === 'online' && member.user.bot);
    onlineBots = totalOnlineBots.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return onlineBots;
};

let getOfflineHumans = ( interaction ) => {
  let offlineHumans = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalOfflineHumans = fetchedMembers.filter(member => member.presence?.status === 'offline' && !member.user.bot);
    offlineHumans = totalOfflineHumans.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return offlineHumans;
};

let getOfflineBots = ( interaction ) => {
  let offlineBots = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalOfflineBots = fetchedMembers.filter(member => member.presence?.status === 'offline' && member.user.bot);
    offlineBots = totalOfflineBots.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return offlineBots;
};

let getMemberCount = ( interaction ) => {
  let memberCount = 0;
  interaction.guild.members.fetch({ withPresences: true }).then(fetchedMembers => {
    const totalMembers = fetchedMembers.filter(member => !member.user.bot);
    memberCount = totalMembers.size;
    // Now you have a collection with all online member objects in the totalOnline variable
  });
  return memberCount;
};

let getServerInfoObj = ( interaction ) => {
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
    memberCount: getMemberCount(interaction)
  };

  return serverInfoObj;
};


module.exports = {
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
  

}