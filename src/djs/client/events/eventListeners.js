const client = require(`../../index.js`);
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require(`../../functions/scripts/scripts_djs.js`);
const scripts_mongoDB = require(`../../functions/scripts/scripts_mongoDB.js`);
const createEmb = require(`../../functions/create/createEmbed.js`);

// const index = require(`src/djs/index.js`)
// const client = index.getClient();
// console.log(client);
if (client) {
  // console.log(`The Client`, client);
  client.on("interactionCreate", async (interaction) => {
    // console.log(`the interaction`, interaction);
    const interactionObj = scripts_djs.getInteractionObj(interaction);
    const { id, channel, guild, userInfo, customID } = interactionObj;
    const { name, displayName, userId, avatar, role, roleID, roleName } =
      userInfo;
    let randID = 0;
    let doc, targetChannel, targetChannelID;
    if (!interaction.isChatInputCommand()) {
      randID = scripts_djs.extractID(customID);
      doc = await scripts_mongoDB.getData(randID);
      // scripts.cLog(`The Doc`, doc);
      // console.log(`HERE`);
      // console.log(doc);
      // console.log(`randID`, randID);
      targetChannel = doc.targetChannel;

      targetChannelID = targetChannel.replace(/[^0-9]/g, "");
      console.log(`the target channel`, targetChannelID);
    }

    // BUTTONS
    if (interaction.isButton()) {
      console.log(`Button Clicked`);
      if (customID.includes("newleak")) {
        // Launch New Leak Modal
        let modal = await scripts_djs.modal_NewLeak(randID);
        console.log(`interaction reply 10`)
        await interaction.showModal(modal);
      } else if (customID.includes("ogfile")) {
        // Launch OG File Modal
        let modal = await scripts_djs.modal_NewOGFile(randID);
        console.log(`interaction reply 11`)
        await interaction.showModal(modal);
      } else if (customID.includes("studiosession")) {
        // Launch Studio Session Modal
        let modal = await scripts_djs.modal_NewStudioSession(randID);
        console.log(`interaction reply 12`)
        await interaction.showModal(modal);
      } else if (customID.includes("snippet")) {
        // Launch Snippet Modal
        let modal = await scripts_djs.modal_NewSnippet(randID);
        console.log(`interaction reply 13`)
        await interaction.showModal(modal);
      } else if (customID.includes("groupbuybtn")) {
        // Launch Group Buy Hub {Embed}
      } else if (customID.includes("custom")) {
        // Launch Custom Modal
        let modal = await scripts_djs.modal_NewCustomAnnouncement(randID);
        try {
          console.log(`interaction reply 14`)
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
        console.log(`interaction reply 1`)
        await interaction.update({
          content: ``,
          components: [],
          embeds: [createEmb.createEmbed({ title: `Announcement Sent 👍🏼` })],
          ephemeral: true,
        });
      } else if (customID.includes("cancel")) {
        // delete the draft
        console.log(`interaction reply 2`)
        await interaction.update({
          content: ``,
          components: [],
          embeds: [
            createEmb.createEmbed({ title: `Announcement Cancelled 👍🏼` }),
          ],
          ephemeral: true,
        });
      } else if (customID.includes("view")) {
        console.log(`interaction reply 3`)
        await interaction.deferReply({ ephemeral: true });
        // TODO:

        let attachmentURL = doc.attachmentURL;

        let isFile = await scripts_djs.fileCheck(attachmentURL);

        if (isFile === true) {
          console.log(`should send reply with file`);

          try {
            console.log(`interaction reply 4`)
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
            console.log(`interaction reply 5`)
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
          let obj = await scripts_djs.createFinalAnnouncement(doc, randID, interaction);
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
          console.log(`interaction reply 66`)
          await interaction.update(obj);

        } else if (isFile === false) {
          user.send({ content: attachmentURL });
          let obj = await scripts_djs.createFinalAnnouncement(doc, randID, interaction);
          console.log(`interaction reply 66`)
          await interaction.update(obj);
        }
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
    }
    if (interaction.isChatInputCommand()) {
      console.log(`Command`);
      if (interaction.commandName === `announce`) {
        scripts_djs.announce(interaction);
      }
      if(interaction.commandName === `sendselectroles`){
        scripts_djs.selectRoleMenu(interaction);
      }
      // this the second listener but does nothing
    }
  });
}
