const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Collection
} = require("discord.js");
const createModal = require("../../functions/create/createModal.js");
const client = require(`../../index.js`);
const saveInteraction = require("../../functions/groupbuy/saveInteraction.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const createButtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");
const interactionCollection= new Collection();
const gbCollection = new Collection();
client.lastID = new Collection();
let embed,actionRow, embedObj;
const moment = require('moment');
const groupBuys = require("../../../MongoDB/db/schemas/schema_groupbuys.js");
const dbVars = require("../../functions/groupbuy/databaseVariables.js");
const mongoose = require("mongoose");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("groupbuy")
    .setDescription("Open the Group Buy Hub")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((opt) =>
    opt.setName("target-channel").setDescription("IF New GB, this is the channel where the GB will be posted").setRequired(false)
    )
    .addRoleOption((opt) =>
      opt.setName("role1").setDescription("Optional Additional roles to tag")
    )
    .addRoleOption((opt) =>
      opt.setName("role2").setDescription("Optional Additional roles to tag")
    ),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    // upon execution of the command, the interaction is sent to the database
    // SAVE INTERACTION VIA DB
    try {
      await saveInteraction(interaction);
    } catch (error) {
      console.log(`error saving interaction: ${error}`);
    }

    // SAVE INTERACTION OPTIONS & USER INFO VIA COLLECTION
      // INTERACTION INPUT
      const { options } = interaction;
      const target = options.getChannel("target-channel") ? options.getChannel("target-channel") : interaction.channel;
      const userId = interaction.user.id;
      const user = interaction.user;
  
      const role1 = options.getRole("role1");
      const role2 = options.getRole("role2");
      const roles = [role1 ? role1 : null, role2 ? role2 : null];
      client.lastID.set(userId, interaction.id);
     interactionCollection.set(interaction.id, {targetChannel: target, roles: roles, user: {id: userId, username: user.username, avatarURL: user.avatarURL()}});

 
// Creating the GB Hub Embed & Buttons
    // create the embed

    embed = createEmb.createEmbed({
      title: "Group Buy Hub",
      description: `Welcome to the Group Buy Hub! \`${interaction.user.username}\` Here you can create a group buy, edit a group buy, and end a group buy.`,
      color: scripts.getColor(),
      footer: {
        text: `${interaction.user.username}'s Group Buy Hub`,
        iconURL: `${interaction.user.avatarURL()}`,
      },
      author: {
        name: client.user.username,
        iconURL: `${client.user.avatarURL()}`,
      },
      // change the new Date() into a moment.js date
      timestamp: true,
    });
    // create the buttons
    const createBtn = await createButtn.createButton({
      label: "Create a Group Buy",
      style: "SUCCESS",
      customID: "groupbuy_create",
    });
    const editBtn = await createButtn.createButton({
      label: "Edit a Group Buy",
      style: "PRIMARY",
      customID: "groupbuy_edit",
    });
    const endBtn = await createButtn.createButton({
      label: "End a Group Buy",
      style: "DANGER",
      customID: "groupbuy_end",
    });
    // create the action row
    actionRow = await createActRow.createActionRow({
      components: [createBtn, editBtn, endBtn],
    });
  
   // then a message is sent with an embed that welcomes the user to the Group Buy Hub, it lays out how the hub works and what the user can do.
   
    try {
        // send the message
      await interaction.followUp({
        embeds: [embed],
        components: [actionRow],
        ephemeral: true,
      });
    } catch (error) {
      console.log(
        `error sending groupbuy hub message to ${interaction.user.username} in ${interaction.guild.name} Server`
      );
      console.log(error);
    }

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // LISTENING FOR GB COMMAND INTERACTIONS
    client.on("GroupBuyButton", async (interaction) => {
      switch (interaction.customId) {
        case "groupbuy_create":
           // Create a Group Buy (allows user to create a group buy),
             // the `Create a Group Buy` button will open a modal that allows the user to create a group buy. The modal will have a text input for the group buy name, a text input for the group buy description, a text input for the group buy total.
            const createGroupBuyModal = await createModal.createModal({
            customID: "groupbuy_m_create",
            title: "Create a Group Buy",
            inputFields: [
              {
                customID: "name",
                label: "Group Buy Name",
                placeholder: "Enter the name of the group buy",
                required: false,
              },
              // {
              //   customID: "description",
              //   label: "Group Buy Description",
              //   placeholder: "Enter the description of the group buy",
              //   required: false,
              // },
              {
                customID: "price",
                label: "Total Price",
                placeholder: "Enter the total price of the group buy",
                required: true,
              },
            ],
          });
          console.log(`the modal`,createGroupBuyModal)
          // send the modal
          await interaction.showModal(createGroupBuyModal);
          break;
        case "groupbuy_edit":
            // Edit a Group Buy (allows user to add to the money total, subtract from the money total, and change elements of the group buy embed),
          // code to execute when the `Edit a Group Buy` button is clicked
          break;
        case "groupbuy_end":
            // End Group Buy (if the user is the creator of the group buy, they can end the group buy and it will be removed from the database. There will then be a message sent to the group buy channel that the group buy has ended and a summary of the group buy is shared in the message. If the user is not the creator of the group buy, the user will be sent an ephemeral message that tells them that they do not have permission to end the group buy).
          // code to execute when the `End a Group Buy` button is clicked
          
          break;
          case "groupbuy_create_confirm":
          // This button will send the final Gb embed to the target channel and ALSO save the messageID of that message and save the group buy data along with a groupbuyID to the db
 

          // get the groubuy info from the collection
          let lastID = client.lastID.get(interaction.user.id); 

          let groupBuyObj = gbCollection.get(lastID);
          console.log(groupBuyObj)
          // get the target channel
          const targetChannel = groupBuyObj.targetChannel;
          // get the groupbuy roles
          let roles = groupBuyObj.roles;
          // get the groupbuy embed obj
          const gbEmbed = groupBuyObj.embed;

          let tag = ''
          // if theres a role in the roles array then add each role to the tag each role will be added to the tag with a space between each role
          if(roles.length > 0){
            roles.forEach(role => {
              if (role === null)return
              // get the role id of the role
              // let roleId = role.id
              tag += `${role} `
            })
          }
          // create the group buy embed
          const groupBuyEmbed = createEmb.createEmbed({
            title: gbEmbed.title,
            description: gbEmbed.description,
            color: scripts.getColor(),
            footer: {
              text: gbEmbed.footer? gbEmbed.footer.text : '',
              iconURL: gbEmbed.footer? gbEmbed.footer.iconURL : '',
            },
            author: {
              name: gbEmbed.author.name,
              iconURL: gbEmbed.author.iconURL,
            },
            fields: gbEmbed.fields,
            timestamp: gbEmbed.timestamp,
          });
          // create the message object
          const messageObj = {
            content: tag,
            embeds: [groupBuyEmbed],
          };

          // send the message to the target channel
          let message;
          try {
            message = await targetChannel.send(messageObj);
          } catch (error) {
            console.log(
              `error sending groupbuy embed to ${targetChannel.name} in ${interaction.guild.name} Server`
            );
            // send a reply to the user stating the error that occured and they must try again or start the command over
            await interaction.reply({
              embeds: [ createEmb.createEmbed({
                title: "An Error Occurred",
                description: `An error occurred while trying to send the group buy embed to ${targetChannel.name} in ${interaction.guild.name} Server. Please try again or start the command over.`,
                color: scripts.getErrorColor(),
                timestamp: true,
              })],
              ephemeral: true,
            });
            // the delete the message in 6 seconds
            setTimeout(async () => {
              await interaction.deleteReply();
            }, 6 * 1000);
          }
          // if a message save the new gb to db
          if (message) {
            // save the messageID and groupbuyID to the db
            const messageID = message.id;
            const groupBuyID = interaction.id;
            groupBuyObj.messageID = messageID;
            groupBuyObj.groupBuyID = groupBuyID;
  //        // convert roles to strings in an array
  console.log(groupBuyObj.roles)


  console.log(roles)
  


            console.log(interaction.member.roles)
            // for each role in member.roles convert to a string array
            let newRoles = []
            interaction.member.roles.cache.forEach(role => {
              if (role === null)return
              newRoles.push(role.toString())
            })
            console.log(newRoles)

            let dbMessageObj = dbVars.getMessageObj(interaction);

            console.log(dbMessageObj)
            

            roles = roles? roles.map(role => role!== null ? role.toString() : null) : [];
            let groupBuyDBObj = {
              _id: mongoose.Types.ObjectId(),
              targetChannelID: targetChannel.id,
              roles: roles,
              embed: gbEmbed,
              messageID: messageID,
              groupBuyID: groupBuyID,
              channel: {
                id: `${targetChannel.id}`,
                type: `${targetChannel.type}`,
                name: `${targetChannel.name}`,
              },
              guild: {
                id: interaction.guild.id,
                name: interaction.guild.name,
                icon: interaction.guild.icon,
                url: interaction.guild.url,
              },
              member: {
                nickname: interaction.member.nickname,
                roles: newRoles,
              },
              timestamp: Date.now(),
              date: `${moment(Date.now()).format("MMMM Do YYYY, h:mm:ss a")}`,
              user: {
                id: interaction.user.id,
                username: interaction.user.username,
                discriminator: interaction.user.discriminator,
                avatar: interaction.user.avatar,
                bot: interaction.user.bot,
                system: interaction.user.system,
                tag: interaction.user.tag,
              },
              message: dbMessageObj,
              amountPaid: 0,
              totalCost: 0,
              timeCreated: Date.now(),
              timeLastUpdate: Date.now(),
            };
            let savedtodb = false;
            // save the groupbuy object to the db
            try {
              await groupBuys.create(groupBuyDBObj);
              savedtodb = true;
            // save the group buy data to the
            } catch (error) {
              scripts.logError(`Was unable to save the groupbuy to the db`,error);
              console.log(`-----------------the error below--------------------------------------------------`)
              console.log(error);
              console.log(`-----------------the end--------------------------------------------------`)
            }

            if (savedtodb) {
              // then send a confirmation message to the user
              try{
                await interaction.reply({
                  embeds: [ createEmb.createEmbed({
                    title: "Group Buy Created",
                    description: `The group buy embed has been sent to ${targetChannel.name} in ${interaction.guild.name} Server.`,
                    color: scripts.getColor(),
                    timestamp: true,
                  })],
                  ephemeral: true,
                });
                // the delete the message in 6 seconds
                setTimeout(async () => {
                  await interaction.deleteReply();
                }, 6 * 1000);
              } catch (error) {
                console.log(error);
              }
            } else { 
              try{
                await interaction.reply({
                  embeds: [ createEmb.createEmbed({
                    title: "Group Buy Created",
                    description: `The group buy embed has been sent to ${targetChannel.name} in ${interaction.guild.name} Server.\n\n**Unfortunately Though the GB has not been saved to the database please contact** \`SteveJobs\``,
                    color: scripts.getErrorColor(),
                    timestamp: true,
                  })],
                  ephemeral: true,
                });
                // the delete the message in 6 seconds
                setTimeout(async () => {
                  await interaction.deleteReply();
                }, 6 * 1000);
              } catch (error) {
                console.log(error);
              }
            }

          }


          // add the message id to the groupbuy info object then save it to both the collection and db


          break;
          case "groupbuy_create_edit_confirm":
          // This button will send the final Gb embed to the target channel and ALSO save the messageID of that message and save the group buy data along with a groupbuyID to the db
          // code to execute when the `Edit a Group Buy` button is clicked
          break;
          case "groupbuy_create_edit_cancel":
          // This button will send the final Gb embed to the target channel and ALSO save the messageID of that message and save the group buy data along with a groupbuyID to the db
          // code to execute when the `Edit a Group Buy` button is clicked
          break;
          case "groupbuy_create_cancel":
      }
    });

    client.on("GroupBuyModal", async (interaction, customID) => {
      // code to execute when the emit is triggered
      console.log("GroupBuyModal");

      console.log(`the interaction`, interaction)

      console.log(`the interaction customID is ${interaction.customId}`)

      console.log(`the passed customID is ${customID}`)
      switch (interaction.customId) {
        case "groupbuy_m_create":
          // After the modal a preview of the group buy will be shown. Along with 2 buttons, one to confirm the creation, and one to cancel the creation.
          // The user will be able to click the `Confirm Group Buy` button to confirm the group buy. The user will be able to click the `Cancel` button to cancel the creation of the group buy.
          // get the name text input value from the modal
          console.log(`this far 1`)
          const name = interaction.fields.getTextInputValue("name");
          // const description = interaction.fields.getTextInputValue("description");
          let description = ``;
          let price = interaction.fields.getTextInputValue("price");
          // if price includes a '$' remove it
          if (price) {
            // remove anything that not a number in price string
            price = price.replace(/\D/g, "");
          }
          // get users last interaction id from the client.lastID = new Collection(); 
          let lastID = client.lastID.get(interaction.user.id);

          let iCollection = interactionCollection.get(lastID)
          console.log(iCollection)
          const targetChannel = iCollection.targetChannel;
          const targetChannelID = targetChannel.id;
          const roles = iCollection.roles;
          const user = interaction.user;
          const { id, username, avatarURL } = user;

          // create the buttons

          const confirmBtn = await createButtn.createButton({
            label: "Confirm Group Buy",
            style: "SUCCESS",
            customID: "groupbuy_create_confirm",
          });

          // create an edit button

          const editBtn = await createButtn.createButton({
            label: "Edit Group Buy",
            style: "PRIMARY",
            customID: "groupbuy_create_edit",
          });

          const cancelBtn = await createButtn.createButton({
            label: "Cancel",
            style: "DANGER",
            customID: "groupbuy_create_cancel",
          });
          // create the action row
          actionRow = await createActRow.createActionRow({
            components: [confirmBtn,editBtn, cancelBtn],
          });
          console.log(`this far 2`)
// I want to include an elapsed time on the embed
          // create the embed
          embedObj = {
            author: {
              name: `Price Update`,
              iconURL: `https://preview.redd.it/wwjqha4r8t941.jpg?auto=webp&s=98fd64e4741d3e4b69cdc4af9a476a1c34b9689e`,
            },
            color: scripts.getColor(),
            title: `${name ? name : `Fundraising Club`}`,
            description: description,
            fields: [
              {
                name: "Total Price",
                value: `\`$\` \`${price}\``,
                inline: true,
              },
              {
                name: `Paid`,
                value: `\`$\` \`0\``,
                inline: true,
              },
              {
                name: `Amount Left`,
                value: `\`$\` \`${price}\``,
                inline: true,
              }
            ],
            // footer: {
            //   text: `Last updated: \`Just now\``,
            //   iconURL: `https://preview.redd.it/wwjqha4r8t941.jpg?auto=webp&s=98fd64e4741d3e4b69cdc4af9a476a1c34b9689e`,
            // },
            timestamp: true,
          };
          embed = createEmb.createEmbed(embedObj);

          // save all components of the message to the groupbuy obj associated with the message in the database
          const groupBuyObj = {
            name: name,
            description: description,
            price: price,
            targetChannelID: targetChannelID,
            targetChannel: targetChannel,
            roles: roles,
            embed: embedObj,
          };
          let content = `<@${interaction.user.id}> Are you sure the Group Buy Info is correct?`;
          // can use this in the future to save the group buy obj to the database after the message id is established
          // // for each key and value pair create a query obj to pass into the saveGroupBuy function
          // const queries = [];
          // for (const [key, value] of Object.entries(groupBuyObj)) {
          //   const queryObj = {
          //     [key]: value,
          //   };
          //   queries.push(queryObj);
          // }
          gbCollection.set(lastID, groupBuyObj);
          // saved the group buy obj to Local Collection, only save to DB after confirmation

          await interaction.editReply({
            content: content,
            embeds: [embed],
            components: [actionRow],
          });
          break;

        case "groupbuy_m_edit":
          // code to execute when the `Edit a Group Buy` modal is submitted
          break;

        case "groupbuy_m_end":
          // code to execute when the `End a Group Buy` modal is submitted
          // fields to change: description of the embed
      }

    });
 


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // New Ideas
    // can use the View Group Buys Button in the future to view all group buys in the database
    // View Group Buys (allows user to see all active group buys in the current server and all active group buys in the database that was created by their user id),


  },
};
