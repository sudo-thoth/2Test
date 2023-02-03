
if (client) {
  client.on("interactionCreate", async (interaction) => {
    const interactionObj = scripts_djs.getInteractionObj(interaction);
    const { id, channel, guild, userInfo, customID } = interactionObj;
    const { name, displayName, userId, avatar, role, roleID, roleName } =
      userInfo;
    let randID = 0;
    let doc, targetChannel, targetChannelID;

    // BUTTONS
    if (interaction.isButton()) {
      console.log(`Button Clicked`);
      if (customID.includes("newleak")) {
        // Launch New Leak Modal
        let modal = await scripts_djs.modal_NewLeak(randID);
        console.log(`interaction reply 10`)
        await interaction.showModal(modal);
      } else if (customID.includes("confirm")) {
        // check if theres an attachment
        // if so turn the attachment into

        let finalAnnouncementMessage =
          await scripts_djs.createFinalAnnouncement(doc, randID, interaction);
        let filter = (obj) => {
          for (i = 0; i < Object.keys(obj).length; i++) {
            if (
              obj[i] === null ||
              obj[i] === [null] ||
              obj[i] === undefined ||
              obj[i] === "" ||
              obj[i] === [] ||
              obj[i] === {}
            ) {
              delete obj[i];
            }
          }
          return obj;
        };
        finalAnnouncementMessage = filter(finalAnnouncementMessage);
        console.log(`components`, finalAnnouncementMessage.components);
        if (finalAnnouncementMessage.components[0] === undefined) {
          finalAnnouncementMessage.components = [];
        }
        // console.log(`the final announcement message`, finalAnnouncementMessage);

        client.channels.cache
          .get(targetChannelID)
          .send(finalAnnouncementMessage);

        // client.channels.cache
        // .get(targetChannelID)
        // .send({content: `<a:LFGGG:1029914284492333157> LFG emoji` });
        console.log(`interaction reply 1`)
        await interaction.update({
          content: ``,
          components: [],
          embeds: [createEmb.createEmbed({ title: `Announcement Sent 👍🏼` })],
          ephemeral: true,
        });
      }
    }
    // MODALS
    if (interaction.isModalSubmit()) {
      console.log(`Modal Submitted`);
      // defer the interaction
      console.log(`interaction reply 8`)
      await interaction.deferReply({
        ephemeral: true,
      });
      let modalInput = null;
      let embed = null;
      if (customID.includes(`newleakmodal`)) {
        modalInput = scripts_djs.getModalInput_A(randID, interaction);
        console.log(`modalInput`, modalInput)
        embed = scripts_djs.createAnnounceEmbed(
          randID,
          modalInput,
          1,
          interaction
        );
        await scripts_mongoDB.addModal_Embed(randID, modalInput, embed);
        scripts_djs.sendDraft(randID, interaction);
      }
    }
  });
}


// createEmbed.js

/* Example embed object that gets passed in below
const embedObj = {
    title: 'Title',
    description: 'Description',
    color: '#FF0000',
    footer: {
        text: 'Footer text',
        iconURL: 'https://example.com/image.png'
    },
    thumbnail: 'https://example.com/image.png',
    image: 'https://example.com/image.png',
    author: {
            // The display name of the user
            name: 'Logan'
            // the username will be the discord username of the person who ran the command
            id: `${interaction.user.id}`,
            // the icon URL will be the discord avatar of the person who ran the command
            iconURL: `${interaction.user.avatarURL()}`,
            url: `https://discord.com/users/${interaction.user.id}`,
            // role will be the highest role of the person who ran the command
            role: `${interaction.member.roles.highest}`
        },
    fields: [
        {
            name: 'Field 1',
            value: 'Field 1 value',
            inline: true
        },
        {
            name: 'Field 2',
            value: 'Field 2 value',
            inline: true
        }
    ]
};
*/


function createEmbed(obj) {
  // Check if the obj has a valid value in the title, description, image, or fields array
  // At least one of these properties must be present in the obj in order for the embed to be valid
  if ((!obj.title && !obj.description && !obj.image && !obj.fields) || (obj.title === null && obj.description === null && obj.image === null && (obj.fields === null || obj.fields === []) ) ) {
    // If not, log an error
    try {
      scripts.logError(
        new Error("Invalid properties were given to create the embed"),
        "Invalid properties were given to create the embed"
      );
    } catch (error) {
      console.error(error);
    }

    return errEmbed;
  }
  // console.log('obj passed into create Embed', obj);

  // Create a new EmbedBuilder instance
  let embed;
  try {
    embed = new EmbedBuilder();
  } catch (error) {
    try {
      scripts.logError(error, "Error creating EmbedBuilder instance");
    } catch (error) {
      console.error(error);
    }

    return errEmbed;
  }

  // Set the properties of the embed if they are present in the obj
  try {
    if (obj.title) embed.setTitle(obj.title);
    if (obj.description) {
      try {
        embed.setDescription(obj.description);
      //  console.log(`description set to ${obj.description}`);
      } catch (error) {
        scripts.logError(error, "Error setting description of embed");
      }
    }
    if (obj.color) embed.setColor(obj.color);
    if (scripts.isDefined(obj.footer)) {
	      try {
	        
	        embed.setFooter({ text: obj.footer.text ? obj.footer.text : '\u0020', iconURL: obj.footer.iconURL ? obj.footer.iconURL : null });
	      //  console.log(`footer set to ${obj.footer.text}`);
	      } catch (error) {
	        scripts.logError(error, "Error setting footer of embed");
	      }
}
    if (scripts.isDefined(obj.thumbnail)) {
      console.log("thumbnail", obj.thumbnail);
      try {
      //  console.log("thumbnail", obj.thumbnail);
        embed.setThumbnail(obj.thumbnail);
      //  console.log(`thumbnail set to ${obj.thumbnail}`);
      } catch (error) {
        scripts.logError(error, "Error setting thumbnail of embed");
      }
    } // Error occuring
    if (obj.image) {
      try {
        embed.setImage(obj.image);
      //  console.log(`image set to ${obj.image}`);
      } catch (error) {
        scripts.logError(error, "Error setting image of embed");
      }
    }
    if (obj.author) {
      try {
        embed.setAuthor({
          name: obj.author.name ? obj.author.name : '\u0020',
          iconURL: obj.author.iconURL ? obj.author.iconURL : null,
          url: obj.author.url ? obj.author.url : null,
        });
      } catch (error) {
        scripts.logError(error, "Error setting author of embed");
      }
    }

    // embed.setAuthor({name: obj.author.name, iconURL: obj.author.iconURL, url: obj.author.url})
  } catch (error) {
    try {
      scripts.logError(error, "Error setting properties of the embed");
    } catch (error) {
      console.error(error);
    }
    console.log("error setting properties of the embed");
    console.log(`sending error embed`);
    return errEmbed;
  }

  // Add fields to the embed if they are present in the obj
  try {
    if (obj.fields) {
      obj.fields.forEach((field) => {
        if (!scripts.isDefined(field.value)) return;
        try {
          embed.addFields({
            name: field.name,
            value: field.value,
            inline: field.inline,
          });
        //  console.log(`field ${field.name} set to ${field.value}`);
        } catch (error) {
          scripts.logError(error, "Error adding fields to the embed");
        }
      });
    }
  } catch (error) {
    try {
      scripts.logError(error, "Error adding fields to the embed");
    } catch (error) {
      console.error(error);
    }
    console.log("error adding fields to the embed");
    console.log(`sending error embed`);
    return errEmbed;
  }

  // Return the completed embed
  console.log(`sending embed`);
  return embed;
}



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

  
  //   // Example Modal Object that gets passed in below
  //   let modalObj = {
  //     customID: "newCustomModal",
  //     title: "Create Your own CUSTOM Announcement",
  //     inputFields: [
  //     {
  //         customID: "title",
  //         label: "What is the title of the announcement?",
  //         style: "TextInputStyle.Short",
  //         placeholder: "Placeholder",
  //         required: true
  //     },
  //     {
  //         customID: "description",
  //         label: "What is the title of the announcement?",
  //         style: "TextInputStyle.Short",
  //         placeholder: "Placeholder",
  //         required: true
  //     }
  // ]
  //   }
  

  async function createModal(modalObj) {
    // destructure the modalObj
    const { customID, title, inputFields } = modalObj;
    // make sure each property is defined with isDefined(), which returns true if the property is defined
    if (!scripts.isDefined(customID) || !scripts.isDefined(title) || !scripts.isDefined(inputFields)) {
      scripts.logError(
        new Error("One or more modal properties are not defined"),
        `Error creating modal`
      );
    }
  
    let newCustomModal;
    // put try catch blocks around newCustomModal variable declaration and ModalBuilder() instantiation, use logError() to log the error
    try {
      newCustomModal = new ModalBuilder().setCustomId(customID).setTitle(title);
    } catch (error) {
      scripts.logError(error, `Error creating modal`);
    }
  
    inputFields.forEach((field) => {
      // put try catch blocks around newCustomModal.addComponents() and createTextInputField() function calls, catch error and continue, but make the error message custom like "Error adding row "blank" to modal ${error.line}"
      try {
        
        let row = createTextInputField(field)
  
        newCustomModal.addComponents(row);
  
      } catch (error) {
        scripts.logError(error, `Error adding field to modal`);
      }
    });
  
    return newCustomModal;
  }
 
  const createTextInputField = (textInputObj) => {
    // destructure the textInputObj
    const {
      customID,
      label,
      style = `TextInputStyle.Short`,
      placeholder,
      required = false,
    } = textInputObj;
  
    let textInputField = new TextInputBuilder();
  
    let lessCharsThan = (str, num) => {
      let arr = [];
      for (let i = 0; i < str.length; i++) {
        arr.push(str.charAt(i));
      }
      if (arr.length <= num) {
        return true;
      } else {
        return false;
      }
    };
  
  
    // make sure each property is defined with isDefined(), which returns true if the property is defined
    if (!scripts.isDefined(customID)) {
      try {
        throw new Error("customID is not defined");
      } catch (error) {
        scripts.logError(error, "customID is not defined in createTextInputField()");
      }
    } else {
      // DO
      // check to make sure it is a string that is within the character limit for a customID
      // check to make sure custom id is less than or equal to 100 characters
      // if its not throw an error and log with logError()
      if (!lessCharsThan(customID, 100)) {
        try {
          throw new Error("customID is too long");
        } catch (error) {
          scripts.logError(error, "customID is too long: MAX 100 characters");
        }
      }
      try {
        textInputField.setCustomId(customID);
      } catch (error) {
        scripts.logError(error, "error w customID");
      }
    }
    if (!scripts.isDefined(label)) {
      try {
        throw new Error("label is not defined");
      } catch (error) {
        scripts.logError(error, "label is not defined");
      }
    } else {
      console.log("label is ", label);
      console.log(`number of chars label has is`, label.length)
      if (label.length > 45) {
        try {
          throw new Error("label is too long");
        } catch (error) {
          scripts.logError(error, "label is too long: MAX 45 characters");
        }
      } else {
      textInputField.setLabel(label);
      }
    }
    if (scripts.isDefined(style)) {
      let s;
      // DO
      // check to make sure it is a string that is one of the TextInputStyle options
      if (style === `long` || style === `Long` || style === `paragraph` || style === `Paragraph` || style === `TextInputStyle.Paragraph`) {
        console.log("style is paragraph");
        s = TextInputStyle.Paragraph;
      } else if (style === `short` || style === `Short` || style === `TextInputStyle.Short`) {
        console.log("style is short")
        s = TextInputStyle.Short;
      } else {
        try {
          scripts.cLog(
            "style is not a valid TextInputStyle\nAuto Assigning TextInputStyle.Short"
          );
          s = TextInputStyle.Short;
        } catch (error) {
          scripts.logError(error, "style is not a valid TextInputStyle");
        }
      }
      textInputField.setStyle(s);
    }
    if (scripts.isDefined(placeholder)) {
      if (placeholder.length > 100) {
        try {
          throw new Error("placeholder is too long");
        } catch (error) {
          scripts.logError(error, "placeholder is too long: MAX 100 characters");
        }
      }
      textInputField.setPlaceholder(placeholder);
    }
    if (scripts.isDefined(required)) {
  
      if (typeof required !== "boolean") {      try {
          scripts.cLog("required is not a boolean\nAuto Assigning required to false");
        } catch (error) {
          scripts.logError(error, "required is not a boolean");
        }
  
  
        textInputField.setRequired(false);
      } else {
        
        textInputField.setRequired(required);
      }
    } else {
      
      textInputField.setRequired(false);
    }
   
  
    return new ActionRowBuilder().addComponents(textInputField);
  };

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
  
    default:
    // throw error 
    break;
  }
  return embed;
  }

  async function addModal_Embed(randID, modalInput,embed) {
    let {
        leakName, altLeakNames, dateOfLeak, price, notes, era, title, description, content, contentHeader, additionalDetails
        } = modalInput
        // check if any values within the embed.data object properties are null if so replace them with `\u0020`

        console.log(`the embed data before: ----`, embed.data)


        let inputs = { leakName: leakName, altLeakNames: altLeakNames, dateOfLeak: dateOfLeak, price: price, notes: notes, era: era, title: title, description: description, content: content, contentHeader: contentHeader, additionalDetails: additionalDetails, embed: embed.data}
    console.log(`SAVING MODAL DATA`)
    console.log(`randID: ${randID}`)
    console.log(`the embed: ----`, embed)

    if (!randID || !modalInput || !embed) return;
    const query = { randID: randID };
  // TODO : add the modal data to the database
  const update = { };
  // for each modal input check to make sure its not null, if not null, add it to the update object
  for (let key in inputs) {
    if (inputs[key] != null && inputs[key] != undefined) {
      update[key] = inputs[key];
    }
  }
    // change the forEach so that it places each input value into the update object    
    try {
      // make sure update has at least one key/value pair
        if (Object.keys(update).length > 0) {
            console.log(`updating db`)
            console.log(`current update obj:`, update)
  await announcementData.findOneAndUpdate(query, update, { upsert: true },(err, data) => (err ? console.log(`Ran into some Errors while trying to find and update: `, err) : console.log(`found it and updated it successfully`))
  ).clone()
  console.log(`updated db`)
    } else {
        console.log(`nothing to update`)
        return;
    }

        console.log(`saved modal_embed data to db`);
    } catch (error) {
        scripts.logError(error)
        console.log(`data not saved`);
    }
}

async function sendDraft(randID, interaction){
  
  
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