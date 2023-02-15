const client = require(`../../index.js`);
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require(`../../functions/scripts/scripts_djs.js`);
const scripts_mongoDB = require(`../../functions/scripts/scripts_mongoDB.js`);
const createEmb = require(`../../functions/create/createEmbed.js`);
const createBtn = require(`../../functions/create/createButton.js`);
const createActRow = require(`../../functions/create/createActionRow.js`);
const gb = require(`../../commands/Juice/gb.js`);
// const index = require(`src/djs/index.js`)
// const client = index.getClient();
// console.log(client);
const roleString = (roles) => {
  // for every role in the array, add it to the string
  let string = ``;
  roles.forEach((role) => {
    string += `${role && role !== null ? `${role}\n` : ``}`;
  });
  return string;
};
let sentEmojis = [
  "📨",
  "📩",
  "📤",
  "📥",
  ":wind_blowing_face:",
  ":satellite_orbital:",
  ":parachute:",
  ":boomerang:",
  ":calling:",
  ":arrow_upper_left:",
  ":mailbox_with_mail:",
  ":white_check_mark:",
  ":vibration_mode:",
  ":mailbox:",
  ":inbox_tray:",
];
let emoji = sentEmojis[Math.floor(Math.random() * sentEmojis.length)];
let labelText = [
  "Sent!",
  "Delivered!",
  "In ur Mailbox!",
  "In ur Inbox!",
  "In ur DMs!",
  "Transferred",
  "Forwarded!",
  "Mailed!",
];
let labelT = `${emoji} ${
  labelText[Math.floor(Math.random() * labelText.length)]
}`;

if (client) {
  // console.log(`The Client`, client);
  client.on("PostCommand", (optionsObj) => {
    // code to execute when the emit is triggered
    // save the data to db
    let obj = {
      file: optionsObj.file ? optionsObj.file : null,
      userId: optionsObj.userId ? optionsObj.userId : null,
      user: optionsObj.user ? optionsObj.user : null,
      type: optionsObj.type ? optionsObj.type : null,
      format: optionsObj.format ? optionsObj.format : null,
      file_type: optionsObj.file_type ? optionsObj.file_type : null,
      interactionID: optionsObj.interaction ? optionsObj.interaction : null,
      choice: optionsObj.choice ? optionsObj.choice : null,
      roles: optionsObj.roles ? optionsObj.roles : null,
      randID: optionsObj.randID ? optionsObj.randID : null,
    };

    scripts_mongoDB.savePostData(obj);
  });

  client.on("interactionCreate", async (interaction) => {
    // console.log(`the interaction`, interaction);
    const interactionObj = scripts_djs.getInteractionObj(interaction);
    const { id, channel, guild, userInfo, customID } = interactionObj;
    const { name, displayName, userId, avatar, role, roleID, roleName } =
      userInfo;
    const originChannel = channel;
    let randID = 0;
    let doc, targetChannel, targetChannelID;
    if (!interaction.isChatInputCommand()) {
      if (!customID.includes("post_") && !customID.includes("view_attachment_") && !customID.includes("direct_message_") && !customID.includes("groupbuy_")) {
        randID = scripts_djs.extractID(customID);
        doc = await scripts_mongoDB.getData(randID);
        // scripts.cLog(`The Doc`, doc);
        // console.log(`HERE`);
        // console.log(doc);
        // console.log(`randID`, randID);
        if (doc) {
          targetChannel = doc.targetChannel;
        targetChannelID = targetChannel.replace(/[^0-9]/g, "");
        console.log(`the target channel`, targetChannelID);
        }

      } else if (customID.includes("post_")) {
        randID = scripts_djs.extractID(customID);
        doc = await scripts_mongoDB.getPostData(randID);
      } 
    }

    // BUTTONS
    if (interaction.isButton()) {
    console.log(`Button Clicked`);

      if(customID.includes("groupbuy_")){
        console.log(`Group Buy Button Clicked`)
        client.emit("GroupBuyButton", interaction);

      }else if (customID.includes("gb_")){

if (customID.includes("gb_edit")) {
  let randID = scripts_djs.extractID(customID);
  await gb.gbedit(interaction, randID);
}else if(customID.includes("gb_update")){
  let randID = scripts_djs.extractID(customID);
  if (customID.includes("add")) {
    await gb.gbadd(interaction, randID);
  } else if (customID.includes("minus")){
    await gb.gbsub(interaction, randID);
  } else if (customID.includes("embed")){
    await gb.gbembed(interaction, randID);
  } 
  // else if (customID.includes("gb_update_delete_confirm")) {
  //   let randID = scripts_djs.extractID(customID);
  //   await gb.gbconfirmdelete(interaction, randID);
  // } else if (customID.includes("gb_update_delete_cancel")) {
  //   await gb.gbcanceldelete(interaction);
  // } 
  else {
    await gb.gbupdate(interaction, randID);
  } 
} else if (customID.includes("gb_delete")) {
  let randID = scripts_djs.extractID(customID);
  await gb.gbdelete(interaction, randID);
} else if (customID.includes("gb_end")) {
  let randID = scripts_djs.extractID(customID);
  await gb.gbend(interaction, randID);
}  else if (customID.includes("gb_completedgb")) {
  let randID = scripts_djs.extractID(customID);
  await gb.gbcompletedgb(interaction, randID);
} else if (customID.includes("gb_canceledgb")) {
  let randID = scripts_djs.extractID(customID);
  await gb.gbcanceledgb_modal(interaction, randID);
} else if (customID.includes("gb_postponedgb")) {
  await gb.gbpostponedgb_modal(interaction, randID);
}
        

      } else if (customID.includes("newleak")) {
        // Launch New Leak Modal
        let modal = await scripts_djs.modal_NewLeak(randID);
        console.log(`interaction reply 10`);
        await interaction.showModal(modal);
      } else if (customID.includes("ogfile")) {
        // Launch OG File Modal
        let modal = await scripts_djs.modal_NewOGFile(randID);
        console.log(`interaction reply 11`);
        await interaction.showModal(modal);
      } else if (customID.includes("studiosession")) {
        // Launch Studio Session Modal
        let modal = await scripts_djs.modal_NewStudioSession(randID);
        console.log(`interaction reply 12`);
        await interaction.showModal(modal);
      } else if (customID.includes("snippet")) {
        // Launch Snippet Modal
        let modal = await scripts_djs.modal_NewSnippet(randID);
        console.log(`interaction reply 13`);
        await interaction.showModal(modal);
      } else if (customID.includes("groupbuybtn")) {
        // Launch Group Buy Hub {Embed}
        await interaction.editReply({embeds: [createEmb.createEmbed({
          title: `This button has been redacted`,
          description: `please use the command \`/groupbuy\` to access the group buy hub`,
          color: scripts.getErrorColor(),
        })]})
        // delete the reply in 6 seconds
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 6000);
      } else if (customID.includes("custom")) {
        // Launch Custom Modal
        let modal = await scripts_djs.modal_NewCustomAnnouncement(randID);
        try {
          console.log(`interaction reply 14`);
          console.log(`the interaction`, interaction);

          interaction.showModal(modal);
        } catch (error) {
          console.log(error);
        }
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
        console.log(`interaction reply 1`);
        await interaction.update({
          content: ``,
          components: [],
          embeds: [createEmb.createEmbed({ title: `Announcement Sent 👍🏼` })],
          ephemeral: true,
        });
      } else if (customID.includes("cancel")) {
        // delete the draft
        console.log(`interaction reply 2`);
        await interaction.update({
          content: ``,
          components: [],
          embeds: [
            createEmb.createEmbed({ title: `Announcement Cancelled 👍🏼` }),
          ],
          ephemeral: true,
        });
      } else if (customID.includes("view__")) {
        console.log(`interaction reply 3`);
        await interaction.deferReply({ ephemeral: true });
        // TODO:

        let attachmentURL = doc.attachmentURL;

        let isFile = await scripts_djs.fileCheck(attachmentURL);

        if (isFile === true) {
          console.log(`should send reply with file`);

          try {
            console.log(`interaction reply 4`);
            await interaction.editReply({
              files: [attachmentURL],
              ephemeral: true,
            });
          } catch (error) {
            console.log(error);
          }
        } else if (isFile === false) {
          console.log(`should send reply as link`);
          try {
            console.log(`interaction reply 5`);
            await interaction.editReply({
              content: attachmentURL,
              ephemeral: true,
            });
          } catch (error) {
            console.log(error);
          }
        }
      } else if (customID.includes("directmessage")) {
        let attachmentURL = doc.attachmentURL;
        let title = doc.embed.title;
        let user = await client.users.fetch(userId);
        let isFile = await scripts_djs.fileCheck(attachmentURL);

        if (isFile === true) {
          user.send({ content: title, files: [attachmentURL] });
          let obj = await scripts_djs.createFinalAnnouncement(
            doc,
            randID,
            interaction
          );
          // need to take the message obj and go into the components and update the direct message button to be disabled
          // let styles = ["PRIMARY", "SECONDARY", "SUCCESS", "DANGER"];
          // // let labels be synonymous with the word "sent" and also have an emoji that represents something being sent in front of it  :calling: :arrow_upper_left:  :mailbox_with_m
          // let sentEmojis = ["📨", "📩", "📤", "📥", ":wind_blowing_face:", ":satellite_orbital:", ":parachute:", ":boomerang:", ":calling:", ":arrow_upper_left:", ":mailbox_with_mail:", ":white_check_mark:", ":vibration_mode:", ":mailbox:", ":inbox_tray:"];
          // let emoji = sentEmojis[Math.floor(Math.random() * sentEmojis.length)];
          // let labelText = ['Sent!', 'Delivered!', 'In ur Mailbox!', 'In ur Inbox!', 'In ur DMs!', 'Transferred', 'Forwarded!', 'Mailed!']
          // let labelT = `${sentEmojis[Math.floor(Math.random() * sentEmojis.length)]} ${labelText[Math.floor(Math.random() * labelText.length)]}`;
          // let style = styles[Math.floor(Math.random() * styles.length)];
          // let label = `${emoji} ${labelT}`
          // console.log(`the obj`, obj.components[0].components[2])
          // obj.components[0].components[2].style = style;
          // obj.components[0].components[2].label = label;
          // console.log(`the updated obj`, obj)
          console.log(`interaction reply 66`);
          await interaction.update(obj);
        } else if (isFile === false) {
          user.send({ content: attachmentURL });
          let obj = await scripts_djs.createFinalAnnouncement(
            doc,
            randID,
            interaction
          );
          console.log(`interaction reply 66`);
          await interaction.update(obj);
        }
      } else if (customID.includes("direct_message_")) {
        await interaction.deferReply({ ephemeral: true });
        randID = scripts_djs.extractID(customID);
        let data = await scripts_mongoDB.getPostData(randID);
        let { file } = data;
        let { choice, size, name, url, attachment } = file;
        let user = interaction.user;
        // direct message the user the file
        // convert size from bytes to mb
        let sizeMB = size / 1000000;
        let isFile = sizeMB > 8 ? false : true;

        if (isFile === true) {
          user.send({ content: file.name, files: [file] });
          try {
            await interaction.editReply({
              embeds: [createEmb.createEmbed({ title: labelT })],
              content: "",
              files: [],
              components: [],
            });
          } catch (error) {
            console.log(
              `An Error occured when trying to reply to a DM Button Request`,
              error
            );
          }
        } else if (isFile === false) {
          user.send({
            content: `__**Visit :**__ ${attachment}`,
            embeds: [
              createEmb.createEmbed({
                title: name,
                description: `the file is too big to be sent as an attachment, visit the link with your web browser to download the file`,
              }),
            ],
          });
          try {
            await interaction.editReply({
              embeds: [createEmb.createEmbed({ title: labelT })],
              content: "",
              files: [],
              components: [],
            });
          } catch (error) {
            console.log(
              `An Error occured when trying to reply to a DM Button Request`,
              error
            );
          }
        }
      } else if (customID.includes("view_attachment_")) {
        await interaction.deferReply({ ephemeral: true });
        randID = scripts_djs.extractID(customID);
        let data = await scripts_mongoDB.getPostData(randID);

        let { file } = data;
        let { choice, size, name, url, attachment } = file;
        let user = interaction.user;
        // direct message the user the file
        // convert size from bytes to mb
        let sizeMB = size / 1000000;
        let isFile = sizeMB > 8 ? false : true;

        if (isFile === true) {
          try {
            await interaction.editReply({
              files: [file],
              embeds: [createEmb.createEmbed({ title: name })],
              content: "",
              components: [],
            });
          } catch (error) {
            console.log(
              `An Error occured when trying to reply to a Show File Button Request`,
              error
            );
          }
        } else if (isFile === false) {
          try {
            await interaction.editReply({
              files: [],
              embeds: [
                createEmb.createEmbed({
                  title: name,
                  description: `the file is too big to be sent as an attachment, visit the link with your web browser to download the file`,
                }),
              ],
              content: `__**Visit :**__ ${url}`,
              components: [],
            });
          } catch (error) {
            console.log(
              `An Error occured when trying to reply to a Show File Button Request`,
              error
            );
          }
        }
      }
    }
    // MODALS
    if (interaction.isModalSubmit()) {
      console.log(`Modal Submitted`);
      // defer the interaction
      console.log(`interaction reply 8`);
      await interaction.deferReply({
        ephemeral: true,
      });

      let modalInput = null;
      let embed = null;
      if(customID.includes("groupbuy_")){
        console.log(`Group Buy Modal Submitted`)
        console.log(`the interaction`, interaction)
        client.emit("GroupBuyModal", interaction, customID);
        console.log(`emitted modal submittion`)

      } else if (customID.includes("gb-post")){
        // extract the name, price, and current amount raised from the modal
        const songName = interaction.fields.getTextInputValue("gb_p_name")
          ? interaction.fields.getTextInputValue("gb_p_name")
          : '';
        let price = interaction.fields.getTextInputValue("gb_p_price")
          ? interaction.fields.getTextInputValue("gb_p_price") : '';
        let current = interaction.fields.getTextInputValue("gb_p_current") ? interaction.fields.getTextInputValue("gb_p_current") : '0';
        // if price or current has no numbers and all alphabetical characters edit the reply telling the user if they put in an input, it must be a number in the price & current field, then return
        let priceNumber = price ? price.replace(/[^0-9]/g, '') : '0';
const matches = price ? price.match(/\$?(\d+\.\d{2})|(\d+\.\d)|(\d+)/g) : ['0'];
const transformedMatches = matches.map(match => match );
price = transformedMatches[0] ? transformedMatches[0] : price;

        let currentNumber = current ? current.replace(/[^0-9]/g, '') : '0';
        const currentMatches = current ? current.match(/\$?(\d+\.\d{2})|(\d+\.\d)|(\d+)/g) : ['0'];
const transformedCurrentMatches = currentMatches.map(match => match );
current = transformedCurrentMatches[0] ? transformedCurrentMatches[0] : current;
        let channel = interaction.channel;
        let randID = scripts_djs.extractID(customID);
        let obj = {
          randID: randID, 
          name: songName,
          price: price,
          priceNumber: priceNumber,
          amountPaid: current,
          amountPaidNumber: currentNumber,
          channel: channel,
        }
       await gb.runGB(obj, interaction);
      } else if (customID.includes("gb-add")){
        // extract the num from the modal
        const num = interaction.fields.getTextInputValue("gb_add")
          ? interaction.fields.getTextInputValue("gb_add")
          : '';
        let randID = scripts_djs.extractID(customID);

        await gb.gbaddtototal(num, randID, interaction);
      } else if (customID.includes("gb-minus")){
        // extract the num from the modal
        const num = interaction.fields.getTextInputValue("gb_sub")
          ? interaction.fields.getTextInputValue("gb_sub")
          : '';
        let randID = scripts_djs.extractID(customID);

        await gb.gbsubfromtotal(num, randID, interaction);

      } else if (customID.includes("gb-reset")){
        let name = interaction.fields.getTextInputValue("gb_update_name") ? interaction.fields.getTextInputValue("gb_update_name") : '';
        let price = interaction.fields.getTextInputValue("gb_update_price") ? interaction.fields.getTextInputValue("gb_update_price") : '';
        let current = interaction.fields.getTextInputValue("gb_update_current") ? interaction.fields.getTextInputValue("gb_update_current") : '';
        let priceNumber = price ? price.replace(/[^0-9]/g, '') : '';
const matches = price ? price.match(/\$?(\d+\.\d{2})|(\d+\.\d)|(\d+)/g) : '';
const transformedMatches = matches.map(match => match );
price = transformedMatches[0] ? transformedMatches[0] : price;

        let currentNumber = current ? current.replace(/[^0-9]/g, '') : '';
        const currentMatches = current ? current.match(/\$?(\d+\.\d{2})|(\d+\.\d)|(\d+)/g) : '';
const transformedCurrentMatches = currentMatches.map(match => match );
current = transformedCurrentMatches[0] ? transformedCurrentMatches[0] : current;
        let randID = scripts_djs.extractID(customID);
        let obj = {
          randID: randID,
          name: name,
          price: price,
          priceNumber: priceNumber,
          amountPaid: current,
          amountPaidNumber: currentNumber,
        }
        await gb.gbreset(obj, interaction);
      } else if (customID.includes("gb-canceledgb_modal2")){

        let reason = interaction.fields.getTextInputValue("why") ? interaction.fields.getTextInputValue("why") : '';

        let randID = scripts_djs.extractID(customID);

        let obj = {
          randID: randID,
          reason: reason,
        }

        await gb.gbcanceledgb(interaction, obj)


      } else if (customID.includes("gb-ppgb_modal")){
        let reason = interaction.fields.getTextInputValue("why") ? interaction.fields.getTextInputValue("why") : '';

        let randID = scripts_djs.extractID(customID);

        let obj = {
          randID: randID,
          reason: reason,
        }

        await gb.gbpostponedgb(interaction, obj)



      } else if (customID.includes("gb-sub-modal")){

        const num = interaction.fields.getTextInputValue("gb_sub")
        ? interaction.fields.getTextInputValue("gb_sub")
        : '';
      let randID = scripts_djs.extractID(customID);


        await gb.gbsubfromtotal(num, randID, interaction)
      }
      if (customID.includes(`newleakmodal`)) {
        modalInput = scripts_djs.getModalInput_A(randID, interaction);
        console.log(`modalInput`, modalInput);
        embed = scripts_djs.createAnnounceEmbed(
          randID,
          modalInput,
          1,
          interaction
        );
        await scripts_mongoDB.addModal_Embed(randID, modalInput, embed);
        scripts_djs.sendDraft(randID, interaction);
      } else if (customID.includes(`newogfilemodal`)) {
        modalInput = scripts_djs.getModalInput_A(randID, interaction);
        embed = scripts_djs.createAnnounceEmbed(
          randID,
          modalInput,
          4,
          interaction
        );
        await scripts_mongoDB.addModal_Embed(randID, modalInput, embed);
        scripts_djs.sendDraft(randID, interaction);
      } else if (customID.includes(`newstudiosessionmodal`)) {
        modalInput = scripts_djs.getModalInput_A(randID, interaction);
        embed = scripts_djs.createAnnounceEmbed(
          randID,
          modalInput,
          5,
          interaction
        );
        await scripts_mongoDB.addModal_Embed(randID, modalInput, embed);
        scripts_djs.sendDraft(randID, interaction);
      } else if (customID.includes(`newsnippetmodal`)) {
        modalInput = scripts_djs.getModalInput_B(randID, interaction);
        embed = scripts_djs.createAnnounceEmbed(
          randID,
          modalInput,
          2,
          interaction
        );
        await scripts_mongoDB.addModal_Embed(randID, modalInput, embed);
        scripts_djs.sendDraft(randID, interaction);
      } else if (customID.includes(`newcustomannouncementmodal`)) {
        modalInput = scripts_djs.getModalInput_C(randID, interaction);

        embed = scripts_djs.createAnnounceEmbed(
          randID,
          modalInput,
          3,
          interaction
        );

        await scripts_mongoDB.addModal_Embed(randID, modalInput, embed);
        scripts_djs.sendDraft(randID, interaction);
      }
      // The Post Command Modal Interaction Listeners
      else if (customID.includes(`post_coverart_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        console.log(`the data is right here data`, data);
        let {
          userId,
          roles,
          type,
          format,
          file,
          interactionID,
          file_type,
          choice,
          buttons,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const artist = interaction.fields.getTextInputValue("artist")
          ? interaction.fields.getTextInputValue("artist")
          : null;
        const artistsocial = interaction.fields.getTextInputValue(
          "artistsocial"
        )
          ? interaction.fields.getTextInputValue("artistsocial")
          : null;

        const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        const embed = createEmb.createEmbed({
          title: `Cover Art: ${songName}`,
          description: `${artist !== null ? `Art By: ${artist}` : ` `}`,
          color: scripts.getColor(),
          url: artistsocial !== null ? artistsocial : null,
          image: file ? file.attachment : null,
        });
        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        // create a action row to hold the button
        const actionRow = await createActRow.createActionRow({
          components: [downloadButton],
        });
        try {
          interaction.channel.send({
            content: `${
              role.length > 1
                ? `|| ${scripts_djs.getAlertEmoji()} ${role} ||`
                : ``
            }`,
            embeds: [embed],
            components: [actionRow],
          });
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sent Cover Art: ${songName}`,
              }),
            ],
          });
        } catch (error) {
          console.log(`cover art error`, error);
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sorry But There was an Error Posting [ Cover Art: ${songName} ]`,
                color: scripts.getErrorColor(),
              }),
            ],
          });
        }
      } else if (customID.includes(`post_rando_image_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          //  choice,
          //  buttons,
        } = data;
        const title = interaction.fields.getTextInputValue("title")
          ? interaction.fields.getTextInputValue("title")
          : null;
        const text = interaction.fields.getTextInputValue("text")
          ? interaction.fields.getTextInputValue("text")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        const embed = createEmb.createEmbed({
          title: `${title}`,
          description: `${text !== null ? `${text}` : ` `}`,
          color: scripts.getColor(),
          image: file ? file.attachment : null,
        });
        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        // create a action row to hold the button
        const actionRow = await createActRow.createActionRow({
          components: [downloadButton],
        });

        try {
          interaction.channel.send({
            content: `${
              role.length > 1
                ? `|| ${scripts_djs.getAlertEmoji()} ${role} ||`
                : ``
            }`,
            embeds: [embed],
            components: [actionRow],
          });
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sent [ Image: ${songName} ]`,
              }),
            ],
          });
        } catch (error) {
          console.log(`Image Post error`, error);
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sorry But There was an Error Posting [ Image: ${songName} ]`,
                color: scripts.getErrorColor(),
              }),
            ],
          });
        }
      } else if (customID.includes(`post_snippet_modal_vid`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          //  choice,
          //  buttons,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const text = interaction.fields.getTextInputValue("text")
          ? interaction.fields.getTextInputValue("text")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        const embed = createEmb.createEmbed({
          title: `Snippet: ${songName}`,
          description: `${text !== null ? `${text}` : ` `}`,
          color: scripts.getColor(),
        });
        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        // create a action row to hold the button
        const actionRow = await createActRow.createActionRow({
          components: [downloadButton],
        });

        try {
          interaction.channel.send({
            content: `${
              role.length > 1
                ? `|| ${scripts_djs.getAlertEmoji()} ${role} ||`
                : ``
            }`,
            embeds: [embed],
            components: [actionRow],
            files: [file],
          });
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sent [ Snippet: ${songName} ]`,
              }),
            ],
          });
        } catch (error) {
          console.log(`Video Snippet Post error`, error);
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sorry But There was an Error Posting [ Snippet: ${songName} ]`,
                color: scripts.getErrorColor(),
              }),
            ],
          });
        }
      } else if (customID.includes(`post_rando_video_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          //  choice,
          //  buttons,
        } = data;
        const title = interaction.fields.getTextInputValue("title")
          ? interaction.fields.getTextInputValue("title")
          : null;
        const text = interaction.fields.getTextInputValue("text")
          ? interaction.fields.getTextInputValue("text")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        const embed = createEmb.createEmbed({
          title: `${title}`,
          description: `${text !== null ? `${text}` : ` `}`,
          color: scripts.getColor(),
        });
        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        // create a action row to hold the button
        const actionRow = await createActRow.createActionRow({
          components: [downloadButton],
        });

        try {
          interaction.channel.send({
            content: `${
              role.length > 1
                ? `|| ${scripts_djs.getAlertEmoji()} ${role} ||`
                : ``
            }`,
            embeds: [embed],
            components: [actionRow],
            files: [file],
          });
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sent [ Snippet: ${songName} ]`,
              }),
            ],
          });
        } catch (error) {
          console.log(`Video Snippet Post error`, error);
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sorry But There was an Error Posting [ Snippet: ${songName} ]`,
              }),
            ],
          });
        }
      } else if (customID.includes(`post_leak_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const era = interaction.fields.getTextInputValue("era")
          ? interaction.fields.getTextInputValue("era")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const date = interaction.fields.getTextInputValue("date")
          ? interaction.fields.getTextInputValue("date")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          color: scripts.getColor(),
          author: {
            name: `New Leak`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (era !== null) {
          fields.push({
            name: `Era`,
            value: `${era}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (date !== null) {
          fields.push({
            name: `Date Leaked`,
            value: `${date}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow;
        let actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          console.log(`the action row is`, actionRow)

          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
              console.log(`the action row 2 is`, actionRow2)

          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Leak: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Leak Kraken (with attachment) Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Leak: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Leak: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Leak Kraken (no attachment) Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Leak: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          console.log(`the action row is`, actionRow)
          
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
              console.log(`the action row 2 is`, actionRow2)

          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Leak: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Leak Kraken (with attachment) Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Leak: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_ogfile_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const era = interaction.fields.getTextInputValue("era")
          ? interaction.fields.getTextInputValue("era")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const date = interaction.fields.getTextInputValue("date")
          ? interaction.fields.getTextInputValue("date")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          color: scripts.getColor(),
          author: {
            name: `New OG File`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (era !== null) {
          fields.push({
            name: `Era`,
            value: `${era}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (date !== null) {
          fields.push({
            name: `Date Leaked`,
            value: `${date}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ OG File: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`OG File Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ OG File: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ OG File: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`OG File Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ OG File : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow, actoinRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ OG File: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`OG File Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ OG File: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_studiosession_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const era = interaction.fields.getTextInputValue("era")
          ? interaction.fields.getTextInputValue("era")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const date = interaction.fields.getTextInputValue("date")
          ? interaction.fields.getTextInputValue("date")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          color: scripts.getColor(),
          author: {
            name: `New Studio Session`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (era !== null) {
          fields.push({
            name: `Era`,
            value: `${era}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (date !== null) {
          fields.push({
            name: `Date Leaked`,
            value: `${date}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Studio Session: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Studio Session Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Studio Session: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Studio Session: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Studio Session Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Studio Session : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Studio Session: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Studio Session Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Studio Session: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_instrumental_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const era = interaction.fields.getTextInputValue("era")
          ? interaction.fields.getTextInputValue("era")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const date = interaction.fields.getTextInputValue("date")
          ? interaction.fields.getTextInputValue("date")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          color: scripts.getColor(),
          author: {
            name: `New Instrumental`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (era !== null) {
          fields.push({
            name: `Era`,
            value: `${era}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (date !== null) {
          fields.push({
            name: `Date Leaked`,
            value: `${date}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Instrumental: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Instrumental Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Instrumental: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Instrumental: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Instrumental Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Instrumental : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Instrumental: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Instrumental Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Instrumental: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_acapella_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const era = interaction.fields.getTextInputValue("era")
          ? interaction.fields.getTextInputValue("era")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const date = interaction.fields.getTextInputValue("date")
          ? interaction.fields.getTextInputValue("date")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          color: scripts.getColor(),
          author: {
            name: `New Accapella`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (era !== null) {
          fields.push({
            name: `Era`,
            value: `${era}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (date !== null) {
          fields.push({
            name: `Date Leaked`,
            value: `${date}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Accapella: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Accapella Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Accapella: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Accapella: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Accapella Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Accapella : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Accapella: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Accapella Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Accapella: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_mixedsession_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const era = interaction.fields.getTextInputValue("era")
          ? interaction.fields.getTextInputValue("era")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const date = interaction.fields.getTextInputValue("date")
          ? interaction.fields.getTextInputValue("date")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          color: scripts.getColor(),
          author: {
            name: `New Mixed Session Edit`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (era !== null) {
          fields.push({
            name: `Era`,
            value: `${era}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (date !== null) {
          fields.push({
            name: `Date Leaked`,
            value: `${date}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Mixed Session Edit: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Mixed Session Edit Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Mixed Session Edit: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Mixed Session Edit: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Mixed Session Edit Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Mixed Session Edit : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Mixed Session Edit: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Mixed Session Edit Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Mixed Session Edit: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_snippet_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const era = interaction.fields.getTextInputValue("era")
          ? interaction.fields.getTextInputValue("era")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const date = interaction.fields.getTextInputValue("date")
          ? interaction.fields.getTextInputValue("date")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          color: scripts.getColor(),
          author: {
            name: `New Snippet`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (era !== null) {
          fields.push({
            name: `Era`,
            value: `${era}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (date !== null) {
          fields.push({
            name: `Date Leaked`,
            value: `${date}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              viewAttachmentButton,
              downloadButton,
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Snippet: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Snippet Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Snippet: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Snippet: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Snippet Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Snippet : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Snippet: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Snippet Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Snippet: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_remaster_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const text = interaction.fields.getTextInputValue("text")
          ? interaction.fields.getTextInputValue("text")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const producer = interaction.fields.getTextInputValue("producer")
          ? interaction.fields.getTextInputValue("producer")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          description: text ? text : null,
          color: scripts.getColor(),
          author: {
            name: `New Remaster`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (producer !== null) {
          fields.push({
            name: `Produced By:`,
            value: `${producer}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Remaster: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Remaster Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Remaster: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Remaster: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Remaster Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Remaster : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Remaster: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Remaster Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Remaster: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_stemedit_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const text = interaction.fields.getTextInputValue("text")
          ? interaction.fields.getTextInputValue("text")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const producer = interaction.fields.getTextInputValue("producer")
          ? interaction.fields.getTextInputValue("producer")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          description: text ? text : null,
          color: scripts.getColor(),
          author: {
            name: `New Remaster`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (producer !== null) {
          fields.push({
            name: `Produced By:`,
            value: `${producer}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Remaster: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Remaster Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Remaster: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Remaster: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Remaster Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Remaster : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Remaster: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Remaster Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Remaster: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_magicaledit_modal`)) {

randID = scripts_djs.extractID(customID);
        let data = await scripts_mongoDB.getPostData(randID);
        file = 

         user = interaction.user;
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          // file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        console.log(`the file is`, file)
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const text = interaction.fields.getTextInputValue("text")
          ? interaction.fields.getTextInputValue("text")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const producer = interaction.fields.getTextInputValue("producer")
          ? interaction.fields.getTextInputValue("producer")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;
        file = kraken ? await scripts_djs.krakenWebScraper(kraken) : null;
        console.log(`the file is`, file)
        let query = {file: file}
        await scripts_mongoDB.updatePostData(randID, query)

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          description: text ? text : null,
          color: scripts.getColor(),
          author: {
            name: `New Magical Edit`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (producer !== null) {
          fields.push({
            name: `Produced By:`,
            value: `${producer}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        console.log(`the kraken`, kraken)
        console.log(`the file`, file)
        console.log(`the decision`, kraken ? (file ? file : null) : (file ? file.attachment : null))

        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: kraken ? (file ? file : null) : (file ? file.attachment : null),
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : ``
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : ``
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : ``
                          } ||`
                        : ``
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Magical Edit: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Magical Edit Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Magical Edit: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Magical Edit: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Magical Edit Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Magical Edit : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            let str2 = 
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : ``
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : ``
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : ``
                          } ||`
                        : ``
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Magical Edit: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Magical Edit Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Magical Edit: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_slowreverb_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("name")
          ? interaction.fields.getTextInputValue("name")
          : null;
        const text = interaction.fields.getTextInputValue("text")
          ? interaction.fields.getTextInputValue("text")
          : null;
        const altname = interaction.fields.getTextInputValue("altname")
          ? interaction.fields.getTextInputValue("altname")
          : null;
        const producer = interaction.fields.getTextInputValue("producer")
          ? interaction.fields.getTextInputValue("producer")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          description: text ? text : null,
          color: scripts.getColor(),
          author: {
            name: `New Slowed & Reverb`,
            icon_url: scripts.getJuice(),
          },
        };

        let fields = [];
        if (producer !== null) {
          fields.push({
            name: `Produced By:`,
            value: `${producer}`,
            inline: true,
          });
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],actionRow2,
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Slowed & Reverb: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Slowed & Reverb Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Slowed & Reverb: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Slowed & Reverb: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Slowed & Reverb Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Slowed & Reverb : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    }${
                      altname !== null
                        ? `\nAlternate Name(s) : ${altname}`
                        : null
                    } ||`
                  : `${
                      file.name
                        ? `|| Song Name : ${file.name}${
                            altname !== null
                              ? `\nAlternate Name(s) : ${altname}`
                              : null
                          } ||`
                        : null
                    }`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Slowed & Reverb: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Slowed & Reverb Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Slowed & Reverb: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      } else if (customID.includes(`post_rando_audio_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        // console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
        } = data;
        const songName = interaction.fields.getTextInputValue("title")
          ? interaction.fields.getTextInputValue("title")
          : null;
        const text = interaction.fields.getTextInputValue("text")
          ? interaction.fields.getTextInputValue("text")
          : null;
        const kraken = interaction.fields.getTextInputValue("kraken")
          ? interaction.fields.getTextInputValue("kraken")
          : null;

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          color: scripts.getColor(),
          description: text ? text : null,
          author: {
            name: `New Audio File`,
            icon_url: scripts.getJuice(),
          },
        };
        if (kraken !== null) {
          embedObj.url = `${kraken}`;
          try {
            await scripts_mongoDB.updatePostData(randID, {
              kraken_url: kraken,
            });
            if (choice !== null) {
              await scripts_mongoDB.updatePostData(randID, { choice: choice });
            }
          } catch (error) {
            console.log(`error updating kraken url in database`, error);
          }
        }

        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: file ? file.attachment : null,
        });
        let krakenButton;
        if (kraken !== null) {
          krakenButton = await createBtn.createButton({
            label: `View on Kraken`,
            style: `link`,
            link: kraken,
          });
        }
        const viewAttachmentButton = await createBtn.createButton({
          label: `View Attachment`,
          style: "primary",
          customID: `view_attachment_${randID}`,
          emoji: "📁",
        });

        const directMessageButton = await createBtn.createButton({
          label: `Save via DM's`,
          style: "secondary",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow,actionRow2;
        if (choice === "yes") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    } ||`
                  : `${file.name ? `|| Song Name : ${file.name} ||` : null}`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Audio File: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Audio File Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Audio File: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
        if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    } ||`
                  : `${file.name ? `|| Song Name : ${file.name} ||` : null}`
              }`,
              embeds: [embed],
              components: [actionRow],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Audio File: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Audio File Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Audio File : ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              
            ],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [
              directMessageButton,
              viewAttachmentButton,
              ]});
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : null
                    } ||`
                  : `${file.name ? `|| Song Name : ${file.name} ||` : null}`
              }`,
              embeds: [embed],
              components: [actionRow,actionRow2],
              files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Audio File: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Audio File Post error`, error);
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sorry But There was an Error Posting [ Audio File: ${songName} ]`,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          }
        }
      }
    }

    if (interaction.isChatInputCommand()) {
      console.log(`Command`);
      if (interaction.commandName === `announce`) {
        scripts_djs.announce(interaction);
      }
      if (interaction.commandName === `sendselectroles`) {
        scripts_djs.selectRoleMenu(interaction);
      }
      // this the second listener but does nothing
    }
  });
  
}
