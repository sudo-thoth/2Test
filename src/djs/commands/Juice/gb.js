const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Collection,
} = require("discord.js");
const createModal = require("../../functions/create/createModal.js");
const client = require(`../../index.js`);
const saveInteraction = require("../../functions/groupbuy/saveInteraction.js");
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const createEmb = require("../../functions/create/createEmbed.js");
const createButtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");
const interactionCollection = new Collection();
const gbCollection = new Collection();
client.gb = new Collection();
let embed, actionRow, embedObj;
const moment = require("moment");
const groupBuys = require("../../../MongoDB/db/schemas/schema_groupbuys.js");
const dbVars = require("../../functions/groupbuy/databaseVariables.js");
const mongoose = require("mongoose");
const gbdb = require("../../../MongoDB/db/schemas/schema_gb.js");
let modal;
async function throwNewError(interaction, err){
  try {
    await interaction.editReply({ embeds: [createEmb.createEmbed({
      title: "There was an Error , Share the Error w the Developer\n\n```js\n" +
      err +
      "```",
      description: "```js" +  `Error occurred for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\n\n\n__**STEVE JOBS**__` + "```",
          color: scripts.getErrorColor(),
  footer: {
    text: "Contact STEVE JOBS and Send the Error",
    iconURL: interaction.user.avatarURL(),
  },
    })]
    })
  } catch (error) {
    console.log(`error occurred when trying to send the user this Error: ${err}\n\n\nThe error that occurred when trying to send the user the error is: ${error}`)
    
  }

}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("gb")
    .setDescription("post group buy")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    // await interaction.deferReply({ ephemeral: true });
    const randID = scripts_djs.getRandID();
    // upon execution of the command, the user is shown a modal that gathers the gb name, the total amount of price needed, the current amount of money raised
    // use #ffcb6b as the embed color

    // after the modal is submitted a message composed of an embed and 1 button labeled `EDIT` (that only admin users can see and click) is sent to the channel the command was executed in

    // when the user clicks the `EDIT` button, another emphemeral action row with 3 buttons labeled `UPDATE`, `DELETE`, and `END` is shown
    // the user can edit the name, price, and amount raised
    // the modal is shown again with the previous values filled in as place holders, and all fields are optional. If the user would like to overwrite the previous values, they can do so and submit the modal again. If the user would like to keep the previous values, they can leave the fields blank and submit the modal again.
    // the message embed is updated with the new values
    // the user can also delete the group buy
    // the message is deleted from the channel
    // the user can end the group buy by clicking the `END` button
    // the user's action row is updated to only include the `GB canlelled` button, `GB Complete` button, and `GB Postponed` button
    // the `GB Cancelled` button will change the embed color to red and change the title to `Group Buy Cancelled`, change the amount needed to `N/A`
    // the `GB Complete` button will change the embed color to green and change the title to `Group Buy Complete!`, change the amount needed to `0`, the percentLeft to `100%`
    // the `GB Postponed` button will change the embed color to yellow and change the title to `Group Buy Postponed`, change the amount needed to `N/A`

    // first step is to create the modal
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create Modal
    //  modal = createModal.createModal({
    //     title: "New Group Buy",
    //     customID: `gb-post-modal${randID}`,
    //     inputFields: [
    //         {
    //             customID: "gb_p_name",
    //     label: "Name of the song",
    //     style: "TextInputStyle.Short",
    //     placeholder: "",
    //     required: false
    //         },
    //         {
    //             customID: "gb_p_price",
    //     label: "Price of the song",
    //     style: "TextInputStyle.Short",
    //     placeholder: "",
    //     required: true
    //         },
    //         {
    //             customID: "gb_p_current",
    //     label: "Amount of money raised",
    //     style: "TextInputStyle.Short",
    //     placeholder: "",
    //     required: false
    //         },
    //     ],
    // })
    let modal2 = new ModalBuilder()
      .setCustomId(`gb-post-modal${randID}`)
      .setTitle("New Group Buy");

    const field1 = new TextInputBuilder()
      .setCustomId("gb_p_name")
      .setLabel("Name of the song")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("")
      .setRequired(false);

    const field2 = new TextInputBuilder()
      .setCustomId("gb_p_price")
      .setLabel("Price of the song")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("")
      .setRequired(true);

    const field3 = new TextInputBuilder()
      .setCustomId("gb_p_current")
      .setLabel("Amount of money raised")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder("")
      .setRequired(false);

    const firstActionRow = new ActionRowBuilder().addComponents(field1);
    const secondActionRow = new ActionRowBuilder().addComponents(field2);
    const thirdActionRow = new ActionRowBuilder().addComponents(field3);

    modal2.addComponents(firstActionRow, secondActionRow, thirdActionRow);
    // Show the Modal to the user
    await interaction.showModal(modal2);

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Second step is receive the client emitted event along with the data payload
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // @binmalyi these are all the button and modal interactions that need to be taken out of the events and into the component collector
    // but in the gb-post part where the message is created, how do I format everything within the message.component collector so that the user can still go back and click on the button and have the interaction work even if I restart the since creation?
    // Receive Button Interactions
  },
  async runGB(obj, interaction) {
    const {
        randID,
        name,
        price,
        priceNumber,
        amountPaid,
        amountPaidNumber,
        channel,
      } = obj;
    // after the modal is submitted a message composed of an embed and 1 button labeled `EDIT` (that only admin users can see and click) is sent to the channel the command was executed in

    let percentLeft = Math.floor((amountPaid / price) * 100);
    percentLeft = `${percentLeft}`;
    let amountLeft = price - amountPaid;
    // date that is a string with the amountPaid date and time like `Today at

    embed = createEmb.createEmbed({
      author: {
        name: name === `` ? `Total Paid` : `Total Paid • ${name} GB`,
      },
      fields: [
        {
          name: `__Amount Paid__`,
          value: amountPaid == `` ? `\`$\` \`0\`` : `\`$\` \`${amountPaid}\``,
          inline: false,
        },
        {
          name: `__Song Price__`,
          value: price == `` ? `\`$\` \`0\`` : `\`$\` \`${price}\``,
          inline: false,
        },
      ],
      footer: {
        text: `$${amountLeft} left • ${percentLeft}% complete`,
        iconURL: `https://preview.redd.it/wwjqha4r8t941.jpg?auto=webp&s=98fd64e4741d3e4b69cdc4af9a476a1c34b9689e`,
      },
      timestamp: true,
      thumbnail: {
        url: channel.guild.iconURL({ dynamic: true }),
      },
    });

    actionRow = await createActRow.createActionRow({
      components: [
        await createButtn.createButton({
          customID: `gb_edit${randID}`,
          label: `♻️ Edit`,
          style: `secondary`,
          disabled: false,
        }),
      ],
    });

    let message;
    try {
      message = await channel.send({
        embeds: [embed],
        components: [actionRow],
      });
      let messageID = message.id;
    //   client.gb.set(randID, {
    //     message: message,
    //     channel: channel,
    //     messageID: messageID,
    //     channelID: channel.id,
    //     name: name,
    //     price: price,
    //     amountPaid: amountPaid,
    //     randID: randID,
    //   });
      let dbObj = {
          randID: randID,
              name: name,
              price: price,
              priceNumber: priceNumber,
              amountPaid: amountPaid,
              amountPaidNumber: amountPaidNumber,
              channelID: channel.id,
              guildID: interaction.guild.id,
              messageID: messageID,
              interactionID: randID,
      }
      try {
        await this.savetodb(randID, dbObj);
      } catch (error) {
        console.log(`There was an issue saving to the database: ${error}`);
        try {
            await interaction.reply({ content: `There was an issue saving to the database: ${error}`, ephemeral: true});  
        } catch (error) {
            console.log(`There was an issue sending the erorr message for not being able to save to the db`)
            console.log(error);

            
        }      
      }

      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Successfully Posted the Group Buy embed`,
              description: `\`Amount Paid:\` \`$\` \`${amountPaid}\`\n\`Amount Left:\` \`$\` \`${amountLeft}\`\n\`Percent Left:\` \`${percentLeft}\` \`%\``,
              color: scripts.getSuccessColor(),
            }),
          ],
        });

        // delete the interaction after 12 seconds
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 12000);
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      // reply to the user emphemerally saying there was an error updating the gb embed, please contact steve jobs
      try {
        await throwNewError(interaction, err)
      } catch (error) {
        console.log(error);
      }
    }
    // if(!message) return;
    // // create a component collector that will listen for the edit button to be clicked, ignore that

    // // const filter = (interaction) => interaction.customID === `gb_edit${randID}`; // not using, only for reference
    // const collector = message.createMessageComponentCollector({ idle: 120000});
    // collector.on('collect', async (interaction) => {
    //     try {
    //         await interaction.deferReply();

    //         /// MODALS
    //         if (customID.includes("gb_")){

    //             if (customID.includes("gb_edit")) {
    //               let randID = scripts_djs.extractID(customID);
    //               await gbedit(interaction, randID);
    //             }else if(customID.includes("gb_update")){
    //               let randID = scripts_djs.extractID(customID);
    //               if (customID.includes("add")) {
    //                 await gbadd(interaction, randID);
    //               } else if (customID.includes("minus")){
    //                 await gbsub(interaction, randID);
    //               } else if (customID.includes("embed")){
    //                 await gbembed(interaction, randID);
    //               } else {
    //                 await gbupdate(interaction, randID);
    //               }
    //             } else if (customID.includes("gb_delete")) {
    //               let randID = scripts_djs.extractID(customID);
    //               await gbdelete(interaction, randID);
    //             } else if (customID.includes("gb_end")) {
    //               let randID = scripts_djs.extractID(customID);
    //               await gbend(interaction, randID);
    //             }
    //             /// BUTTONS
    //             else if (customID.includes("gb-post")){
    //                 // extract the name, price, and current amount raised from the modal
    //                 const songName = interaction.fields.getTextInputValue("gb_p_name")
    //                   ? interaction.fields.getTextInputValue("gb_p_name")
    //                   : '';
    //                 let songPrice = interaction.fields.getTextInputValue("gb_p_price")
    //                   ? interaction.fields.getTextInputValue("gb_p_price") : '';
    //                   songPrice = songPrice ? songPrice.replace(/[^0-9]/g, '') : '';
    //                 let currentRaised = interaction.fields.getTextInputValue("gb_p_current") ? interaction.fields.getTextInputValue("gb_p_current") : '';
    //                 currentRaised = currentRaised ? currentRaised.replace(/[^0-9]/g, '') : '';
    //                 let channel = interaction.channel;
    //                 let randID = scripts_djs.extractID(customID);
    //                 let obj = {
    //                   randID: randID,
    //                   name: songName,
    //                   price: songPrice,
    //                   amountPaid: currentRaised,
    //                   channel: channel,
    //                 }
    //                 await gbpost(obj);
    //               } else if (customID.includes("gb-add")){
    //                 // extract the num from the modal
    //                 const num = interaction.fields.getTextInputValue("gb_add")
    //                   ? interaction.fields.getTextInputValue("gb_add")
    //                   : '';
    //                 let randID = scripts_djs.extractID(customID);
    //                 let obj = {
    //                   randID: randID,
    //                   num: num,
    //                 }
    //                 await gbaddtototal(obj);
    //               } else if (customID.includes("gb-minus")){
    //                 // extract the num from the modal
    //                 const num = interaction.fields.getTextInputValue("gb_sub")
    //                   ? interaction.fields.getTextInputValue("gb_sub")
    //                   : '';
    //                 let randID = scripts_djs.extractID(customID);
    //                 let obj = {
    //                   randID: randID,
    //                   num: num,
    //                 }
    //                 await gbsubfromtotal(obj);

    //               } else if (customID.includes("gb-reset")){
    //                 let name = interaction.fields.getTextInputValue("gb_update_name") ? interaction.fields.getTextInputValue("gb_update_name") : '';
    //                 let price = interaction.fields.getTextInputValue("gb_update_price") ? interaction.fields.getTextInputValue("gb_update_price") : '';
    //                 price = price ? price.replace(/[^0-9]/g, '') : '';
    //                 let current = interaction.fields.getTextInputValue("gb_update_current") ? interaction.fields.getTextInputValue("gb_update_current") : '';
    //                 current = current ? current.replace(/[^0-9]/g, '') : '';
    //                 let randID = scripts_djs.extractID(customID);
    //                 let obj = {
    //                   randID: randID,
    //                   name: name,
    //                   price: price,
    //                   amountPaid: current,
    //                 }
    //                 await gbreset(obj);
    //               }
    //             }

    //     } catch (error) {
    //         console.log(error);
    // }
    // }
    // );

    // collector.on('end', async (collected) => {
    //     if (collected.size === 0) {
    //         try {
    //             await interaction.editReply({ embeds: [createEmb.createEmbed({
    //                 title: `The Group Buy embed has been updated`,
    //                 description: `**Actions Taken:** *Added* \`${num}\` to the *Amount Paid*\`\n\n\`Amount Paid:\` \`$${gbEmbedAmountPaid}\`\n\`Amount Left:\` \`$${amountLeft}\`\n\`Percent Left:\` \`${percentLeft}%\``,
    //                 color: scripts.getSuccessColor(),
    //             })]});
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ur code from pages
    //         .createMessageComponentCollector({ componentType: ComponentType.Button, idle: 15000, filter: i => i.user.id === interaction.user.id })
    //     .on('collect', async (i) => {
    //     const index = data.findIndex(embed => embed.footer.text === i.message.embeds[0].footer.text);
    //     switch (i.customId) {
    //         case 'HOME':
    //             await i.update({ embeds: [new EmbedBuilder(data[0])] });
    //             break;
    //         case 'BACK':
    //             await i.update({ embeds: [new EmbedBuilder(index === 0 ? data[data.length - 1] : data[index - 1])] });
    //             break;
    //         case 'FORWARD':
    //             await i.update({ embeds: [new EmbedBuilder(index + 1 === data.length ? data[0] : data[index + 1])] });
    //             break;
    //     }
    //     ;
    // })
    //     .once('end', (collected) => console.log(collected));
  },
  async gbedit(interaction, randID) {
     await interaction.deferReply({ ephemeral: true });
    if (!interaction.memberPermissions.has("Administrator")) {
      console.log(
        `Edit Button Clicked by a non-admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
      );
      // reply with an ephemeral message saying that only admins can use this button
     try {
       await interaction.editReply({
         embeds: [
           createEmb.createEmbed({
             title: `Only admins can use this button`,
             color: scripts.getErrorColor(),
             description: `Leave this button alone <@${interaction.user.id}>!\n\n\n**You do not have permission to use this button. You can only VIEW the group buy**.`,
             timestamp: true,
             thumbnail: {
               url: interaction.user.displayAvatarURL({ dynamic: true }),
             },
           }),
         ],
       });
     } catch (error) {
      await throwNewError(interaction, error)
     }
    } else {
      console.log(
        `Edit Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
      );
      // when the admin user clicks the `EDIT` button, another emphemeral action row with 3 buttons labeled `UPDATE`, `DELETE`, and `END` is shown

      let updateButton = await createButtn.createButton({
        customID: `gb_update${randID}`,
        label: `UPDATE`,
        style: `primary`,
        disabled: false,
      });
      let deleteButton = await createButtn.createButton({
        customID: `gb_delete${randID}`,
        label: `DELETE`,
        style: `danger`,
        disabled: false,
      });
      let endButton = await createButtn.createButton({
        customID: `gb_end${randID}`,
        label: `END`,
        style: `secondary`,
        disabled: false,
      });
      actionRow = await createActRow.createActionRow({
        components: [updateButton, deleteButton, endButton],
      });
      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `GB Edit Actions`,
              color: scripts.getColor(),
              description: `\`FYI: only Admins can make use of this edit button\`\n\nClick one of the buttons below to perform an action on this group buy`,
              timestamp: true,
              fields: [
                {
                  name: `__Update__`,
                  value: `Click the \`UPDATE\` button to add to/subtract from \`Amount Paid\` the group buy along with any other changes you want to make to the GB Embed`,
                  inline: true,
                },
                {
                  name: `__Delete__`,
                  value: `Click the \`DELETE\` button to delete the group buy from the ${interaction.channel.name} channel`,
                  inline: true,
                },
                {
                  name: `__End__`,
                  value: `Click the \`END\` button to end the group buy due to either \`Completion\`, \`\Cancellation\`, or \`Postponement\``,
                  inline: true,
                },
              ],
              thumbnail: {
                url: interaction.user.displayAvatarURL({ dynamic: true }),
              },
              footer: {
                text: `GB ID: ${randID}`,
                iconURL: `${(interaction.client.user.displayAvatarURL({
                  dynamic: true,
                })).url}`,
              },
            }),
          ],
          components: [actionRow],
        });
      } catch (error) {
        console.log(
          `Error displaying the GB Edit Actions for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
          error
        );
        try {
          await throwNewError(interaction, error)
        } catch (error) {
          console.log(
            `Error displaying the GB Edit Actions Error Message \nError:`
          );
          console.log(error);
        }
      }
    }
  },

  async gbupdate(interaction, randID) {
    await interaction.deferReply({ ephemeral: true });
    console.log(
      `Update Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );
    // when the admin user clicks the `EDIT` button, another emphemeral action row with 3 buttons labeled `UPDATE`, `DELETE`, and `END` is shown

    let updateAddButton = await createButtn.createButton({
      customID: `gb_update_add${randID}`,
      label: `➕💲`,
      style: `SUCCESS`,
      disabled: false,
    });
    let updateSubtractButton = await createButtn.createButton({
      customID: `gb_update_minus${randID}`,
      label: `➖💲`,
      style: `danger`,
      disabled: false,
    });
    let editEmbedButton = await createButtn.createButton({
      customID: `gb_update_embed${randID}`,
      label: `♻️ Edit GB`,
      style: `secondary`,
      disabled: false,
    });
    actionRow = await createActRow.createActionRow({
      components: [updateSubtractButton, editEmbedButton, updateAddButton],
    });
    try {
      // edit the action row to only show the new buttons
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `GB Update Actions`,
            color: scripts.getColor(),
            description: `\`FYI: only Admins can make use of this edit button\`\n\nClick one of the buttons below to perform an action on this group buy`,
            timestamp: true,
            fields: [
              {
                name: `__Add__`,
                value: `Click the \`ADD\` button to add to the \`Total Paid\` for the group buy`,
                inline: true,
              },
              {
                name: `__Subtract__`,
                value: `Click the \`SUBTRACT\` button to subtract from the \`Total Paid\` for the group buy`,
                inline: true,
              },
              {
                name: `__Change Embed Info__`,
                value: `Click the \`CHANGE EMBED INFO\` button to change the information in the group buy embed (song name, total price, & current amount paid`,
                inline: true,
              },
            ],
          }),
        ],
        components: [actionRow],
      });
    } catch (error) {
      console.log(
        `Error displaying the GB Update Actions for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
        error
      );
      try {
        await throwNewError(interaction, error)
      } catch (error) {
        console.log(
          `Error displaying the GB Update Actions Error Message \nError:`
        );
        console.log(error);
      }
    }
  },

  async gbadd(interaction, randID) {

    console.log(
      `Add Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );

    // Create Modal
    //  modal = createModal.createModal({
    //     title: "",
    //     customID: `gb-add-modal${randID}`,
    //     inputFields: [
    //         {
    //             customID: "",
    //     label: "",
    //     style: "TextInputStyle.Short",
    //     placeholder: ,
    //     required:
    //         },
    //     ],
    // })

    let modal2 = new ModalBuilder()
      .setCustomId(`gb-add-modal${randID}`)
      .setTitle("Add to the Total Paid");

    const field1 = new TextInputBuilder()
      .setCustomId(`gb_add`)
      .setLabel("Enter # of $ to add to the total")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`300`)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(field1);

    modal2.addComponents(firstActionRow);
    // Show the Modal to the user
    await interaction.showModal(modal2);
  },

  async gbsub(interaction, randID) {
    // await interaction.deferReply({ ephemeral: true });
    console.log(
      `Subtract Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );

    // Create Modal
    //  modal = createModal.createModal({
    //     title: ,
    //     customID: ,
    //     inputFields: [
    //         {
    //             customID: ,
    //     label: ,
    //     style: "TextInputStyle.Short",
    //     placeholder: ,
    //     required: true
    //         },
    //     ],
    // })

    let modal2 = new ModalBuilder()
      .setCustomId(`gb-sub-modal${randID}`)
      .setTitle("Subtract from Total Paid");

    const field1 = new TextInputBuilder()
      .setCustomId("gb_sub")
      .setLabel("Enter # of $ to subtract to the total")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`25`)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(field1);

    modal2.addComponents(firstActionRow);
    // Show the Modal to the user
    await interaction.showModal(modal2);
  },

  async gbembed(interaction, randID) {
    // await interaction.deferReply({ ephemeral: true });
    console.log(
      `Update Embed Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );
    console.log(client.gb);
    let gbInfo = await this.getdbObjfromdb(randID);
    // fetch the message with the message id in gbInfo
    let gbMessage = await client.channels.cache.get(gbInfo.channelID).messages.fetch(gbInfo.messageID);
    let gbEmbed = gbMessage.embeds[0];
    let gbEmbedFields = gbEmbed.fields;
    let theEmbedTitle = gbEmbed.title;
    let songName =
      theEmbedTitle !== null ? `${theEmbedTitle.includes(`Total Paid`)
        ? `${theEmbedTitle.includes(`Total Paid • `) ? theEmbedTitle.split(`Total Paid • `)[1] : `Currently No Song Name`}`
        : `Currently No Song Name`}` : `Currently No Song Name`;
    songName =
      songName !== `Currently No Song Name`
        ? `${songName.split(` GB`)[0]}`
        : `Currently No Song Name`;
    let gbEmbedAmountPaidField = gbEmbedFields[0];
    let gbEmbedAmountPaid = gbEmbedAmountPaidField.value;
    let gbEmbedPriceField = gbEmbedFields[1];
    let gbEmbedPrice = gbEmbedPriceField.value;

    // Create Modal
    //    modal = createModal.createModal({
    //     title: "",
    //     customID: ``,
    //     inputFields: [
    //         {
    //             customID: "",
    //     label: `""`,
    //     style: "TextInputStyle.Short",
    //     placeholder: ,
    //     required: false
    //         },
    //         {
    //             customID: "",
    //     label: "",
    //     style: "TextInputStyle.Short",
    //     placeholder: ,
    //     required: false
    //         },
    //         {
    //             customID: "",
    //     label: "",
    //     style: "TextInputStyle.Short",
    //     placeholder: ,
    //     required: false
    //         },
    //     ],
    // })

    let modal2 = new ModalBuilder()
      .setCustomId(`gb-reset${randID}`)
      .setTitle("Edit the GB Embed");

    const field1 = new TextInputBuilder()
      .setCustomId("gb_update_name")
      .setLabel("Name of the song")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(songName)
      .setRequired(false);

    const field2 = new TextInputBuilder()
      .setCustomId("gb_update_price")
      .setLabel("Price of the song")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(`${gbInfo.price ? gbInfo.price : gbEmbedPrice}`)
      .setRequired(false);

    const field3 = new TextInputBuilder()
      .setCustomId("gb_update_current")
      .setLabel("Amount of money raised")
      .setStyle(TextInputStyle.Short)
      .setPlaceholder(
        `${gbInfo.amountPaid ? gbInfo.amountPaid : gbEmbedAmountPaid}`
      )
      .setRequired(false);

    const firstActionRow = new ActionRowBuilder().addComponents(field1);
    const secondActionRow = new ActionRowBuilder().addComponents(field2);
    const thirdActionRow = new ActionRowBuilder().addComponents(field3);

    modal2.addComponents(firstActionRow, secondActionRow, thirdActionRow);
    // Show the Modal to the user
    await interaction.showModal(modal2);
  },

  async gbaddtototal(num, randID,interaction) {
    // await interaction.deferReply({ ephemeral: true });
    console.log(
      `Add Modal Submitted by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );

    // remove anything thats not a number in the num string
    num = num.replace(/[^0-9]/g, "");
    // convert the num to an integer
    num = parseInt(num);

    let gbInfo = await this.getdbObjfromdb(randID);
    // fetch the message with the message id in gbInfo
    let gbMessage = await client.channels.cache.get(gbInfo.channelID).messages.fetch(gbInfo.messageID);
    let gbEmbed = gbMessage.embeds[0];
    let gbEmbedTitle = gbEmbed.title;
    let gbEmbedDescription = gbEmbed.description;
    let gbEmbedColor = gbEmbed.color;
    let gbEmbedThumbnail = gbEmbed.thumbnail;
    let gbEmbedFooter = gbEmbed.footer;
    let gbEmbedFooterText = gbEmbedFooter.text;
    let gbEmbedFields = gbEmbed.fields;
    let gbEmbedTimestamp = gbEmbed.timestamp;
    let gbEmbedAuthor = gbEmbed.author;
    let gbEmbedAmountPaidField = gbEmbedFields[0];
    let gbEmbedAmountPaid = gbEmbedAmountPaidField.value;
    let gbEmbedAmountPaidName = gbEmbedAmountPaidField.name;
    let gbEmbedAmountPaidInline = gbEmbedAmountPaidField.inline;
    let gbEmbedSongPriceField = gbEmbedFields[1];
    let gbEmbedSongPrice = gbEmbedSongPriceField.value;
    let footerNums = (gbEmbedFooterText) => {
           
        const dollarRegex = /(?<=\$)-?\d+/;
        const percentRegex = /-?\d+(?=%)/;
        
        const dollarAmount = Number(gbEmbedFooterText.match(dollarRegex)[0]).toFixed(2);
        const percentComplete = Number(gbEmbedFooterText.match(percentRegex)[0]).toFixed(2);
        
        return [dollarAmount, percentComplete];
    }
    let footerNumbers = footerNums(gbEmbedFooterText);
    let amountLeft = footerNumbers[0];
    // convert the amountLeft to an integer and round it to 2 decimal places
    amountLeft = Math.round(parseInt(amountLeft) * 100) / 100;

    let percentLeft = footerNumbers[1];
    // convert the percentLeft to an integer and round it to 1 decimal place
    percentLeft = Math.round(parseInt(percentLeft) * 10) / 10;

    // remove anything thats not a number in the gbEmbedAmountPaid string
    gbEmbedAmountPaid = gbEmbedAmountPaid.replace(/[^0-9]/g, "");
    // convert the gbEmbedAmountPaid to an integer
    gbEmbedAmountPaid = parseInt(gbEmbedAmountPaid);
    // remove anything thats not a number in the gbEmbedSongPrice string
    gbEmbedSongPrice = gbEmbedSongPrice.replace(/[^0-9]/g, "");
    // convert the gbEmbedSongPrice to an integer
    gbEmbedSongPrice = parseInt(gbEmbedSongPrice);
    // add the num to the gbEmbedAmountPaid
    gbEmbedAmountPaid = gbEmbedAmountPaid + num;
    // update the percentLeft with one decimal place and amountLeft with 2 decimals places
    percentLeft =
      Math.round((gbEmbedAmountPaid / gbEmbedSongPrice) * 1000) / 10;
    amountLeft = Math.round((gbEmbedSongPrice - gbEmbedAmountPaid) * 100) / 100;
    // amountPaid is now updated, convert back to a string
    gbEmbedAmountPaid = gbEmbedAmountPaid.toString();
    // add the $ to the gbEmbedAmountPaid
    gbEmbedAmountPaid = `\`$\` \`${gbEmbedAmountPaid}\``;

    // update the gbFooterText
    gbEmbedFooterText = `$${amountLeft} left • ${percentLeft}% complete`;
    // update the gbEmbedAmountPaidField
    gbEmbedAmountPaidField = {
      name: gbEmbedAmountPaidName,
      value: gbEmbedAmountPaid,
      inline: gbEmbedAmountPaidInline,
    };
    // update the footer
    gbEmbedFooter = {
      text: gbEmbedFooterText,
      iconURL: gbEmbedFooter.iconURL,
    };
    // update the gbEmbedFields
    gbEmbedFields = [gbEmbedAmountPaidField, gbEmbedSongPriceField];
    // update the gbEmbed
    gbEmbed = {
      title: gbEmbedTitle,
      description: gbEmbedDescription,
      color: gbEmbedColor,
      thumbnail: gbEmbedThumbnail ? gbEmbedThumbnail : "",
      footer: gbEmbedFooter,
      fields: gbEmbedFields,
      timestamp: gbEmbedTimestamp,
      author: gbEmbedAuthor,
    };
    // update the gbMessage
    try {
      gbMessage = await gbMessage.edit({
        embeds: [createEmb.createEmbed(gbEmbed)],
      });

      // update the gbInfo
      gbInfo = {
        randID: randID,
        interactionID: randID,
        messageID: gbMessage.id,
        channelID: gbMessage.channel.id,
        guildID: gbMessage.guild.id,
        name: gbEmbedTitle,
        price: gbEmbedSongPrice,
        amountPaid: gbEmbedAmountPaid,
        totalPaid: gbEmbedAmountPaid + gbEmbedSongPrice,
        amountLeft: amountLeft,
        percentLeft: percentLeft,
      };
      // update the gbInfo
      try {
        await this.savetodb(randID, gbInfo);
      } catch (error) {
        console.log(`There was an issue saving to the database: ${error}`);
        try {
            await interaction.reply({ content: `There was an issue saving to the database: ${error}`, ephemeral: true});  
        } catch (error) {
            console.log(`There was an issue sending the erorr message for not being able to save to the db`)
            console.log(error);

            
        }      
      }

      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Successfully updated the Group Buy embed`,
              description: `**Actions Taken:** *Added* \`${num}\` to the *Amount Paid*\n\n\`Amount Paid:\` ${gbEmbedAmountPaid}\n\`Amount Left:\` \`$\` \`${amountLeft}\`\n\`Percent Complete:\` \`${percentLeft}\` \`%\``,
              color: scripts.getSuccessColor(),
            }),
          ],
        });

        // delete the interaction after 12 seconds
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 12000);
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      // reply to the user emphemerally saying there was an error updating the gb embed, please contact steve jobs
      try {
        await throwNewError(interaction, error)
      } catch (error) {
        console.log(error);
      }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // New Ideas
    // can use the View Group Buys Button in the future to view all group buys in the database
    // View Group Buys (allows user to see all active group buys in the current server and all active group buys in the database that was created by their user id),
  },

  async gbsubfromtotal(num, randID, interaction) {
    // await interaction.deferReply({ ephemeral: true });
    console.log(
      `Subtract Modal Submitted by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );
    // remove anything thats not a number in the num string
    num = num.replace(/[^0-9]/g, "");
    // convert the num to an integer
    num = parseInt(num);

    let gbInfo = await this.getdbObjfromdb(randID);
    // fetch the message with the message id in gbInfo
    let gbMessage = await client.channels.cache.get(gbInfo.channelID).messages.fetch(gbInfo.messageID);
    let gbEmbed = gbMessage.embeds[0];
    let gbEmbedTitle = gbEmbed.title;
    let gbEmbedDescription = gbEmbed.description;
    let gbEmbedColor = gbEmbed.color;
    let gbEmbedThumbnail = gbEmbed.thumbnail;
    let gbEmbedFooter = gbEmbed.footer;
    let gbEmbedFooterText = gbEmbedFooter.text;
    let gbEmbedFields = gbEmbed.fields;
    let gbEmbedTimestamp = gbEmbed.timestamp;
    let gbEmbedAuthor = gbEmbed.author;
    let gbEmbedAmountPaidField = gbEmbedFields[0];
    let gbEmbedAmountPaid = gbEmbedAmountPaidField.value;
    let gbEmbedAmountPaidName = gbEmbedAmountPaidField.name;
    let gbEmbedAmountPaidInline = gbEmbedAmountPaidField.inline;
    let gbEmbedSongPriceField = gbEmbedFields[1];
    let gbEmbedSongPrice = gbEmbedSongPriceField.value;
    let footerNums = (gbEmbedFooterText) => {
           
        const dollarRegex = /(?<=\$)-?\d+/;
        const percentRegex = /-?\d+(?=%)/;
        
        const dollarAmount = Number(gbEmbedFooterText.match(dollarRegex)[0]).toFixed(2);
        const percentComplete = Number(gbEmbedFooterText.match(percentRegex)[0]).toFixed(2);
        
        return [dollarAmount, percentComplete];
    }
let footerNumbers = footerNums(gbEmbedFooterText);
    let amountLeft = footerNumbers[0];
    // convert the amountLeft to an integer and round it to 2 decimal places
    amountLeft = Math.round(parseInt(amountLeft) * 100) / 100;

    let percentLeft = footerNumbers[1];
    // convert the percentLeft to an integer and round it to 1 decimal place
    percentLeft = Math.round(parseInt(percentLeft) * 10) / 10;

    // remove anything thats not a number in the gbEmbedAmountPaid string
    gbEmbedAmountPaid = gbEmbedAmountPaid.replace(/[^0-9]/g, "");
    // convert the gbEmbedAmountPaid to an integer
    gbEmbedAmountPaid = parseInt(gbEmbedAmountPaid);
    // remove anything thats not a number in the gbEmbedSongPrice string
    gbEmbedSongPrice = gbEmbedSongPrice.replace(/[^0-9]/g, "");
    // convert the gbEmbedSongPrice to an integer
    gbEmbedSongPrice = parseInt(gbEmbedSongPrice);
    // add the num to the gbEmbedAmountPaid
    gbEmbedAmountPaid = gbEmbedAmountPaid - num;
    // update the percentLeft with one decimal place and amountLeft with 2 decimals places
    percentLeft =
      Math.round((gbEmbedAmountPaid / gbEmbedSongPrice) * 1000) / 10;
    amountLeft = Math.round((gbEmbedSongPrice - gbEmbedAmountPaid) * 100) / 100;
    // amountPaid is now updated, convert back to a string
    gbEmbedAmountPaid = gbEmbedAmountPaid.toString();
    // add the $ to the gbEmbedAmountPaid
    gbEmbedAmountPaid = `\`$\` \`${gbEmbedAmountPaid}\``;

    // update the gbFooterText
    gbEmbedFooterText = `$${amountLeft} left • ${percentLeft}% complete`;
    // update the gbEmbedAmountPaidField
    gbEmbedAmountPaidField = {
      name: gbEmbedAmountPaidName,
      value: gbEmbedAmountPaid,
      inline: gbEmbedAmountPaidInline,
    };
    // update the footer
    gbEmbedFooter = {
      text: gbEmbedFooterText,
      iconURL: gbEmbedFooter.iconURL,
    };
    // update the gbEmbedFields
    gbEmbedFields = [gbEmbedAmountPaidField, gbEmbedSongPriceField];
    // update the gbEmbed
    gbEmbed = {
      title: gbEmbedTitle,
      description: gbEmbedDescription,
      color: gbEmbedColor,
      thumbnail: gbEmbedThumbnail ? gbEmbedThumbnail : "",
      footer: gbEmbedFooter,
      fields: gbEmbedFields,
      timestamp: gbEmbedTimestamp,
      author: gbEmbedAuthor,
    };
    // update the gbMessage
    try {
      gbMessage = await gbMessage.edit({
        embeds: [createEmb.createEmbed(gbEmbed)],
      });

      // update the gbInfo
      gbInfo = {
        messageID: gbMessage.id,
        channelID: gbMessage.channel.id,
        guildID: gbMessage.guild.id,
        message: gbMessage,
        name: gbEmbedTitle,
        price: gbEmbedSongPrice,
        amountPaid: gbEmbedAmountPaid,
        totalPaid: gbEmbedAmountPaid + gbEmbedSongPrice,
        amountLeft: amountLeft,
        percentLeft: percentLeft,
        randID: randID,
        interactionID: randID
      };
      // update the gbInfo
      try {
        await this.savetodb(randID, gbInfo);
      } catch (error) {
        console.log(`There was an issue saving to the database: ${error}`);
        try {
            await interaction.reply({ content: `There was an issue saving to the database: ${error}`, ephemeral: true});  
        } catch (error) {
            console.log(`There was an issue sending the erorr message for not being able to save to the db`)
            console.log(error);

            
        }      
      }

      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Successfully updated the Group Buy embed`,
              description: `**Actions Taken:** *Subtracted* \`${num}\` from the *Amount Paid*\n\n\`Amount Paid:\` ${gbEmbedAmountPaid}\n\`Amount Left:\` \`$\` \`${amountLeft}\`\n\`Percent Complete:\` \`${percentLeft}\` \`%\``,
              color: scripts.getSuccessColor(),
            }),
          ],
        });

        // delete the interaction after 12 seconds
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 12000);
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      // reply to the user emphemerally saying there was an error updating the gb embed, please contact steve jobs
      try {
        await throwNewError(interaction, error)
      } catch (error) {
        console.log(error);
      }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // New Ideas
    // can use the View Group Buys Button in the future to view all group buys in the database
    // View Group Buys (allows user to see all active group buys in the current server and all active group buys in the database that was created by their user id),
  },

  async gbreset(obj, interaction) {
    // await interaction.deferReply({ ephemeral: true });
    console.log(
      `Change Embed Modal Submitted by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );

    const { name, price, amountPaid, randID } = obj;
    // remove anything thats not a number in the num string
    // num = num.replace(/[^0-9]/g, "");
    // // convert the num to an integer
    // num = parseInt(num);

    let gbInfo = await this.getdbObjfromdb(randID);
    // fetch the message with the message id in gbInfo
    let gbMessage = await client.channels.cache.get(gbInfo.channelID).messages.fetch(gbInfo.messageID);
    let gbEmbed = gbMessage.embeds[0];
    let gbEmbedTitle = gbEmbed.title;
    let gbEmbedDescription = gbEmbed.description;
    let gbEmbedColor = gbEmbed.color;
    let gbEmbedThumbnail = gbEmbed.thumbnail;
    let gbEmbedFooter = gbEmbed.footer;
    let gbEmbedFooterText = gbEmbedFooter.text;
    let gbEmbedFields = gbEmbed.fields;
    let gbEmbedTimestamp = gbEmbed.timestamp;
    let gbEmbedAuthor = gbEmbed.author;
    let gbEmbedAuthorName = gbEmbed.author.name;
    gbEmbedAuthorName = name !== "" ? `Total Paid • ${name} GB` : name !== "" ? `Total Paid • ${name} GB` : gbEmbed.title
    let gbEmbedAmountPaidField = gbEmbedFields[0];
    let gbEmbedAmountPaid =
      amountPaid !== "" ? amountPaid : gbEmbedAmountPaidField.value;
    let gbEmbedAmountPaidName = gbEmbedAmountPaidField.name;
    let gbEmbedAmountPaidInline = gbEmbedAmountPaidField.inline;
    let gbEmbedSongPriceField = gbEmbedFields[1];
    let gbEmbedSongPrice = price !== "" ? price : gbEmbedSongPriceField.value;
    let footerNums = (gbEmbedFooterText) => {
           
      const dollarRegex = /(?<=\$)-?\d+/;
      const percentRegex = /-?\d+(?=%)/;
      
      const dollarAmount = Number(gbEmbedFooterText.match(dollarRegex)[0]).toFixed(2);
      const percentComplete = Number(gbEmbedFooterText.match(percentRegex)[0]).toFixed(2);
      
      return [dollarAmount, percentComplete];
  }
  let footerNumbers = footerNums(gbEmbedFooterText);
    let amountLeft = footerNumbers[0];
    // convert the amountLeft to an integer and round it to 2 decimal places
    amountLeft = Math.round(parseInt(amountLeft) * 100) / 100;

    let percentLeft = footerNumbers[1];
    // convert the percentLeft to an integer and round it to 1 decimal place
    percentLeft = Math.round(parseInt(percentLeft) * 10) / 10;

    // remove anything thats not a number in the gbEmbedAmountPaid string
    gbEmbedAmountPaid = gbEmbedAmountPaid.replace(/[^0-9]/g, "");
    // convert the gbEmbedAmountPaid to an integer
    gbEmbedAmountPaid = parseInt(gbEmbedAmountPaid);
    // remove anything thats not a number in the gbEmbedSongPrice string
    gbEmbedSongPrice = gbEmbedSongPrice.replace(/[^0-9]/g, "");
    // convert the gbEmbedSongPrice to an integer
    gbEmbedSongPrice = parseInt(gbEmbedSongPrice);
    // update the percentLeft with one decimal place and amountLeft with 2 decimals places
    percentLeft =
      Math.round((gbEmbedAmountPaid / gbEmbedSongPrice) * 1000) / 10;
    amountLeft = Math.round((gbEmbedSongPrice - gbEmbedAmountPaid) * 100) / 100;
    // amountPaid is now updated, convert back to a string
    gbEmbedAmountPaid = gbEmbedAmountPaid.toString();
    // add the $ to the gbEmbedAmountPaid
    gbEmbedAmountPaid = `\`$\` \`${gbEmbedAmountPaid}\``;

    gbEmbedSongPrice = gbEmbedSongPrice.toString();
    gbEmbedSongPrice = `\`$\` \`${gbEmbedSongPrice}\``;

    // update the gbFooterText
    gbEmbedFooterText = `$${amountLeft} left • ${percentLeft}% complete`;
    // update the gbEmbedAmountPaidField
    gbEmbedAmountPaidField = {
      name: gbEmbedAmountPaidName,
      value: gbEmbedAmountPaid,
      inline: gbEmbedAmountPaidInline,
    };
    // update the song price field
    gbEmbedSongPriceField = {
      name: "Song Price",
      value: gbEmbedSongPrice,
      inline: true,
    };
    // update the footer
    gbEmbedFooter = {
      text: gbEmbedFooterText,
      iconURL: gbEmbedFooter.iconURL,
    };
    // update the gbEmbedFields
    gbEmbedFields = [gbEmbedAmountPaidField, gbEmbedSongPriceField];
    // update the gbEmbed
    gbEmbed = {
      title: gbEmbedTitle,
      description: gbEmbedDescription,
      color: gbEmbedColor,
      thumbnail: gbEmbedThumbnail ? gbEmbedThumbnail : "",
      footer: gbEmbedFooter,
      fields: gbEmbedFields,
      timestamp: gbEmbedTimestamp,
      author: gbEmbedAuthor,
    };
    // update the gbMessage
    try {
      gbMessage = await gbMessage.edit({
        embeds: [createEmb.createEmbed(gbEmbed)],
      });

      // update the gbInfo
      gbInfo = {
        messageID: gbMessage.id,
        channelID: gbMessage.channel.id,
        guildID: gbMessage.guild.id,
        name: gbEmbedTitle,
        price: gbEmbedSongPrice,
        amountPaid: gbEmbedAmountPaid,
        totalPaid: gbEmbedAmountPaid + gbEmbedSongPrice,
        amountLeft: amountLeft,
        percentLeft: percentLeft,
        randID: randID,
        interactionID: randID
      };
      // update the gbInfo
      try {
        await this.savetodb(randID, gbInfo);
      } catch (error) {
        console.log(`There was an issue saving to the database: ${error}`);
        try {
            await interaction.reply({ content: `There was an issue saving to the database: ${error}`, ephemeral: true});  
        } catch (error) {
            console.log(`There was an issue sending the erorr message for not being able to save to the db`)
            console.log(error);

            
        }      
      }

      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `${interaction.user.username} You Have Successfully Updated the Group Buy Embed`,
              description: `\`Amount Paid:\` ${gbEmbedAmountPaid}\n\`Amount Left:\` \`$\` \`${amountLeft}\`\n\`Percent Left:\` \`${percentLeft}\` \`%\``,
              color: scripts.getSuccessColor(),
            }),
          ],
        });

        // delete the interaction after 12 seconds
        setTimeout(async () => {
          await interaction.deleteReply();
        }, 12000);
      } catch (error) {
        console.log(error);
      }
    } catch (err) {
      // reply to the user emphemerally saying there was an error updating the gb embed, please contact steve jobs
      try {
        await throwNewError(interaction, error)
      } catch (error) {
        console.log(error);
      }
    }
  },
  async gbdelete(interaction, randID) {
     await interaction.deferReply({ ephemeral: true });
    console.log(
      `Delete Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );
    // when the admin user clicks the `EDIT` button, another emphemeral action row with 3 buttons labeled `UPDATE`, `DELETE`, and `END` is shown

    let deleteButton = await createButtn.createButton({
      customID: `gb_update_delete_confirm${randID}`,
      label: `Delete`,
      style: `danger`,
      disabled: false,
    });
        let deleteButton2 = await createButtn.createButton({
      customID: `gb_update_delete_confirm${randID}`,
      label: `to Delete`,
      style: `danger`,
      disabled: true,
    });

    let cancelDeleteButton = await createButtn.createButton({
      customID: `gb_update_delete_cancel${randID}`,
      label: `I changed my mind`,
      style: `secondary`,
      disabled: false,
    });
    let cancelDeleteButton2 = await createButtn.createButton({
        customID: `gb_update_delete_cancel${randID}`,
        label: `run command again`,
        style: `secondary`,
        disabled: true,
      });
    
    try {
      // edit the action row to only show the new buttons
      let thenewactionrow = await createActRow.createActionRow({
        components: [cancelDeleteButton2, deleteButton2],
      });
      actionRow = await createActRow.createActionRow({
        components: [cancelDeleteButton, deleteButton],
      });

      const maxTime = Date.now() + 12000;
      let timeLeft = Math.floor((maxTime) / 1000);
      timeLeft = `<t:${timeLeft}:R>`;
      
      
      
    const newmessage =   await interaction.editReply({
                embeds: [
                  createEmb.createEmbed({
                    title: `ARE YOU SURE YOU WANT TO DELETE THIS GROUP BUY?`,
                    color: scripts.getErrorColor(),
                    description: `\`this is permanent\`\n\nIf you are deleting due to : GB completion, cancelation, or postponement, **Use the \`END\` button instead** to customize the final GB embed\n\n**You have ${timeLeft} to delete**`,
                    timestamp: true,
                  }),
                ],
                components: [actionRow],
              });
      
      
      
      


const collector = newmessage.createMessageComponentCollector({ time: 12000});

collector.on('collect', async (i) => {
    console.log(`the interaction `,i)

    if (i.customID === `gb_update_delete_confirm${randID}`) {
        await this.gbconfirmdelete(interaction, randID);
    } else if (i.customID === `gb_update_delete_cancel${randID}`) {
        await interaction.deleteReply();
    } 
});

collector.on('end', async (collected) => {
          
    try {
        await interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `REQUEST TIMED OUT`,
                color: scripts.getErrorColor(),
                description: `\`this is permanent\`\n\nIf you are deleting due to : GB completion, cancelation, or postponement, **Use the \`END\` button instead** to customize the final GB embed\n\n**You should have made a choice ${timeLeft}**`,
                timestamp: true,
              }),
            ],
            components: [thenewactionrow],
          });
    
           await scripts.delay(6000);
          await interaction.deleteReply();
    } catch (error) {
        console.log(`the error`,error)
                console.log(`message already deleted`)
        
    }

});
    //   let interval = setInterval(async () => {
    //     if (timeLeft === 0) {
    //       clearInterval(interval);
    //       await interaction.editReply({
    //         embeds: [
    //           createEmb.createEmbed({
    //             title: `REQUEST TIMED OUT`,
    //             color: scripts.getErrorColor(),
    //             description: `\`this is permanent\`\n\nIf you are deleting due to : GB completion, cancelation, or postponement, **Use the \`END\` button instead** to customize the final GB embed\n\n**You have \`${timeLeft}\` seconds to delete**`,
    //             timestamp: true,
    //           }),
    //         ],
    //         components: [thenewactionrow],
    //       });
    //     } else {
    //       await interaction.editReply({
    //         embeds: [
    //           createEmb.createEmbed({
    //             title: `ARE YOU SURE YOU WANT TO DELETE THIS GROUP BUY?`,
    //             color: scripts.getErrorColor(),
    //             description: `\`this is permanent\`\n\nIf you are deleting due to : GB completion, cancelation, or postponement, **Use the \`END\` button instead** to customize the final GB embed\n\n**You have \`${timeLeft}\` seconds to delete**`,
    //             timestamp: true,
    //           }),
    //         ],
    //         components: [actionRow],
    //       });
    //       timeLeft--;
    //     }
    //   }, 1000);
    } catch (error) {
      console.log(
        `Error displaying the GB Delete Options for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
        error
      );
      try {
        await throwNewError(interaction, error)
      } catch (error) {
        console.log(
          `Error displaying the GB Delete Options Error Message \nError:`
        );
        console.log(error);
      }
    }
  },
  async gbconfirmdelete(interaction, randID) {
    await interaction.deferReply({ ephemeral: true });
    // this where the GB is actually deleted
    // the whole message is deleted

    // await interaction.deferReply({ ephemeral: true });
    console.log(
      `Delete Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );
    // when the admin user clicks the `EDIT` button, another emphemeral action row with 3 buttons labeled `UPDATE`, `DELETE`, and `END` is shown

    // get the gb info from db
    let gbInfo = await this.getdbObjfromdb(randID);
    // fetch the message with the message id in gbInfo
    let gbMessage;
    try {
        gbMessage = await client.channels.cache.get(gbInfo.channelID).messages.fetch(gbInfo.messageID);
    } catch (error) {
        console.log(`Error Deleteing GB Message`)
        await throwNewError(interaction, error);
        
    }
if (gbMessage) {
        try {
     // could delete the gb from db in the future
          // delete the GB message
          await gbMessage.delete();
          // reply to the user emphemerally saying the GB was deleted
          await interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `${interaction.user.username} You Have Successfully Deleted the Group Buy Embed`,
                color: scripts.getSuccessColor(),
              }),
            ],
          });
    
          // delete the interaction after 12 seconds
          setTimeout(async () => {
            await interaction.deleteReply();
          }, 12000);
        } catch (error) {
          console.log(
            `Error deleting the GB for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
            error
          );
          try {
            await interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Error`,
                  color: scripts.getErrorColor(),
                  description:
                    `There was an error deleting the GB for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}` +
                    "\n\n\n```js\n" +
                    error +
                    "```\n\n\n**CONTACT STEVE JOBS**",
                }),
              ],
              components: [],
            });
    
            // delete the interaction after 12 seconds
            setTimeout(async () => {
              await interaction.deleteReply();
            }, 12000);
          } catch (error) {
            console.log(`Error deleting the GB Error Message \nError:`);
            console.log(error);
          }
        }
}
  },
  // @binmalyi it goes from gbdelete(), where the button is displayed, to here where the button interaction causes this in gbcanceldelete()
  async gbcanceldelete(interaction) {
    // in here we delete the reply to the user and return the GB to the original state

    try {
      await interaction.deleteReply();
    } catch (error) {
    await throwNewError(interaction, error)
    }

    return;
  },
  async gbend(interaction, randID) {
    // when this button is clicked the user will get their reply edited to show an embed and a row of new buttons
    // a `Completed GB` button, a `Canceled GB` button, and a `Postponed GB` button
    // The embed will explain the choices, via 1 button per field,  and the buttons will be labeled `Completed`, `Canceled`, and `Postponed`

    await interaction.deferReply({ ephemeral: true });
    console.log(
      `End Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );

    const completedGbButton = await createButtn.createButton({
      label: `Completed`,
      style: `SUCCESS`,
      customID: `gb_completedgb${randID}`,
    });
    const canceledGbButton = await createButtn.createButton({
      label: `Canceled`,
      style: `DANGER`,
      customID: `gb_canceledgb${randID}`,
    });
    const postponedGbButton = await createButtn.createButton({
      label: `Postponed`,
      style: `PRIMARY`,
      customID: `gb_postponedgb${randID}`,
    });

    actionRow = await createActRow.createActionRow({
      components: [completedGbButton, canceledGbButton, postponedGbButton],
    });

    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Welcome to the End GB Hub`,
            color: scripts.getSuccessColor(),
            description: `Please select the status of the GB`,
            fields: [
              {
                name: `Completed`,
                value: `Click this button if the GB has been completed`,
                inline: true,
              },
              {
                name: `Canceled`,
                value: `Click this button if the GB has been canceled`,
                inline: true,
              },
              {
                name: `Postponed`,
                value: `Click this button if the GB has been postponed`,
                inline: true,
              },
            ],
          }),
        ],
        components: [actionRow],
      });
    } catch (error) {
      try {
        await throwNewError(interaction, error)
      } catch (error) {
        console.log(
          `Error sending error message for error about end hub for the  GB for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
          error
        );

        console.log(`Error creating the end button \nError:`);
        console.log(error);
      }
    }
  },
  async gbcompletedgb(interaction, randID) {
    await interaction.deferReply({ ephemeral: true });
    console.log(
      `Completed GB Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`
    );

    // get the gb info object from the collection
    let gbInfo = await this.getdbObjfromdb(randID);
    // fetch the message with the message id in gbInfo
    let gbmessage = await client.channels.cache.get(gbInfo.channelID).messages.fetch(gbInfo.messageID);
    let price = gbInfo.price;
    let name = gbInfo.name;
    let title = name ? `${name} GB` : `GB`;


    // create a new embed

    embed = createEmb.createEmbed({
      title: `${title} Completed`,
      color: scripts.getSuccessColor(),
      description: `${name ? `Song Name: ${name}\n` : ``}${
        price ? `Price: ${price}\n` : ``
      }`,
      author: {
        name: `Let's Fucking Go!`,
        iconURL: `https://you.com/proxy?url=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.26-WZbF7snUjbEi3GOrfZgHaHf%26h%3D690%26c%3D7%26pid%3DApi%26p%3D0`,
      },
      footer: {
        text: `Status: 100% Completed`,
        iconURL: `https://you.com/proxy?url=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.qwIfvvIjbe-cbku4QUSVZAHaHa%26w%3D690%26c%3D7%26pid%3DApi%26p%3D0`,
      },
      timestamp: new Date(),
    });

    // edit the gbmessage to show the new embed

    if (gbmessage) {
      try {
        await gbmessage.edit({ embeds: [embed], components: [] });
        try {
          await interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Success`,
                color: scripts.getSuccessColor(),
                description: `The GB has been marked as completed`,
              }),
            ],
            components: [],
          });
        } catch (error) {
          console.log(
            `Error sending SUCCESS gb completed message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
            error
          );
        }
      } catch (error) {
        try {
          await interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Error`,
                color: scripts.getErrorColor(),
                description:
                  `There was an error editing the GB message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}` +
                  "\n\n\n```js\n" +
                  error +
                  "```\n\n\n**CONTACT STEVE JOBS**",
              }),
            ],
            components: [],
          });
        } catch (error) {
          console.log(
            `Error sending error message for error about editing the GB message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
            error
          );
        }
      }
    } else {
      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Error`,
              color: scripts.getErrorColor(),
              description: `There was an error getting the GB message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: GB message not found`,
            }),
          ],
          components: [],
        });
      } catch (error) {
        console.log(
          `Error sending error message for error about getting the GB message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
          error
        );
        await throwNewError(interaction, error)
      }
    }
  },
  async gbcanceledgb_modal(interaction, randID) {
    // show a modal that allows the user to input why the gb was cancelled

    // await interaction.deferReply({ ephemeral: true });

    let modal2 = new ModalBuilder() ;
    modal2.setTitle("Why was the GB canceled?");
    modal2.setCustomId(`gb-canceledgb_modal2${randID}`);
    
    // textinput field
    let textinput = new TextInputBuilder();
    textinput.setCustomId("why");
    textinput.setPlaceholder("Why was the GB canceled?").setLabel("Enter why the GB was canceled").setStyle("Paragraph");

    const firstActionRow = new ActionRowBuilder().addComponents(textinput);

    modal2.addComponents(firstActionRow);

    await interaction.showModal(modal2);
   },
  async gbpostponedgb_modal(interaction, randID) {

    // await interaction.deferReply({ ephemeral: true });

    let modal2 = new ModalBuilder() ;
    modal2.setTitle("Why was the GB Postponed?");
    modal2.setCustomId(`gb-ppgb_modal2${randID}`);
    
    // textinput field
    let textinput = new TextInputBuilder();
    textinput.setCustomId("why");
    textinput.setPlaceholder("Why was the GB postponed?").setLabel("Enter the reason why the GB was postponed").setStyle("Paragraph");

    const firstActionRow = new ActionRowBuilder().addComponents(textinput);

    modal2.addComponents(firstActionRow);

    await interaction.showModal(modal2);

  },

  async gbcanceledgb(interaction, obj) {

    let {randID, reason} = obj

    let gbInfoObj = await this.getdbObjfromdb(randID);
    // fetch the message with the message id in gbInfo
    let gbmessage = await client.channels.cache.get(gbInfoObj.channelID).messages.fetch(gbInfoObj.messageID);
    let name = gbInfoObj.name;
    let title = name? `${name} GB` : `GB`;
    let price = gbInfoObj.price;
    let priceNumber = gbInfoObj.priceNumber;
    let amountPaid = gbInfoObj.amountPaid;
    let amountPaidNumber = gbInfoObj.amountPaidNumber;
    let amountLeftNumber = priceNumber - amountPaidNumber;
    // calculate the percentLeft left and percentLeft complete
    let percentageLeft = Math.round(amountLeftNumber / priceNumber * 100);
    let percentageComplete = Math.round(amountPaidNumber / priceNumber * 100);

    // create a new embed announcing & explaining why it was postponed if the user inputted a reason
    
    embed = createEmb.createEmbed({
        title: `${title} Cancelled`,
        color: scripts.getErrorColor(),
        description: `${name? `Song Name: \`${name}\`\n` : ``}${
          price? `Price: \`${price}\`\n` : ``
        }${amountPaid? `Amount Paid: \`${amountPaid}\`\n` : ``}${
          percentageLeft? `percentLeft Left: \`${percentageLeft}%\`\n` : ``}`,
        footer: {
          text: `Status: CANCELLED • ${percentageComplete}% Completed`
          ,
          iconURL: `https://you.com/proxy?url=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.fCqm1dxV-mNyu4yrOq3YIgHaHa%26w%3D690%26c%3D7%26pid%3DApi%26p%3D0`,
        },
        timestamp: new Date(),
      });

      // edit the gbmessage to show the new embed
      if (gbmessage) {
        try {
            await gbmessage.edit({ embeds: [embed] });
            try {
              await interaction.editReply({
                embeds: [
                  createEmb.createEmbed({
                    title: `Success`,
                    color: scripts.getSuccessColor(),
                    description: `The GB has been marked as canceled`,
                  }),
                ],
                components: [],
              });
            } catch (error) {
              console.log(
                `Error sending SUCCESS gb canceled message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
                error
              );
            }
          } catch (error) {
            try {
              await throwNewError(interaction, error)
            } catch (error) {
              console.log(
                `Error sending ERROR Marking the GB as Cancelled message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
                error
              );
            }
          }
        } else {
            try {
              await throwNewError(interaction, error)
            } catch (error) {
                console.log(
                `Error sending ERROR Marking the GB as Cancelled message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
                error
                );
            }
        }
  },
  async gbpostponedgb(interaction, obj) {

    let {randID, reason} = obj

    let gbInfoObj = await this.getdbObjfromdb(randID);
    // fetch the message with the message id in gbInfo
    let gbmessage = await client.channels.cache.get(gbInfoObj.channelID).messages.fetch(gbInfoObj.messageID);
    let name = gbInfoObj.name;
    let title = name? `${name} GB` : `GB`;
    let price = gbInfoObj.price;
    let priceNumber = gbInfoObj.priceNumber;
    let amountPaid = gbInfoObj.amountPaid;
    let amountPaidNumber = gbInfoObj.amountPaidNumber;
    let amountLeftNumber = priceNumber - amountPaidNumber;
    // calculate the percentLeft left and percentLeft complete
    let percentageLeft = Math.round(amountLeftNumber / priceNumber * 100);
    let percentageComplete = Math.round(amountPaidNumber / priceNumber * 100);

    // create a new embed announcing & explaining why it was postponed if the user inputted a reason
    
    embed = createEmb.createEmbed({
        title: `${title} postponed`,
        color: scripts.getErrorColor(),
        description: `${name? `Song Name: \`${name}\`\n` : ``}${
          price? `Price: \`${price}\`\n` : ``
        }${amountPaid? `Amount Paid: \`${amountPaid}\`\n` : ``}${
          percentageLeft? `percentLeft Left: \`${percentageLeft}%\`\n` : ``}${reason ? `\n\n**Reason:** ${reason}` : ``}`,
        footer: {
          text: `Status: POSTPONED • ${percentageComplete}% Completed`
          ,
          iconURL: `https://you.com/proxy?url=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.U4VEYZAfF9IiN0xAnNwX5wHaHa%26w%3D690%26c%3D7%26pid%3DApi%26p%3D0`,
        },
        timestamp: new Date(),
      });

      // edit the gbmessage to show the new embed
      if (gbmessage) {
        try {
            await gbmessage.edit({ embeds: [embed] });
            try {
              await interaction.editReply({
                embeds: [
                  createEmb.createEmbed({
                    title: `Success`,
                    color: scripts.getSuccessColor(),
                    description: `The GB has been marked as \`Postponed\``,
                  }),
                ],
                components: [],
              });
            } catch (error) {
              console.log(
                `Error sending SUCCESS gb postponed message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
                error
              );
            }
          } catch (error) {
            try {
              await throwNewError(interaction, error)
            } catch (error) {
              console.log(
                `Error sending ERROR Marking the GB as postponed message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
                error
              );
            }
          }
        } else {
            try {
              await throwNewError(interaction, error)
            } catch (error) {
                console.log(
                `Error sending ERROR Marking the GB as postponed message for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `,
                error
                );
            }
        }
  },
  async savetodb(randID, gbInfoObj) {
    console.log(`SAVING GB DATA`)
    
  if (!gbInfoObj) return;
  console.log(`randID: ${randID}`)
  console.log(`the collection: ${gbdb.collection}`, gbdb.collection.collection)
// search for the gb in the db to see if ti already exists, if it does just update the doc, otherwise create a new doc
  const gb = await gbdb.collection.findOne({
    "randID": randID
  });
  console.log(`gb: ${gb}`)
  let { name, price, priceNumber, amountPaid, amountPaidNumber, messageID, interactionID, channelID, guildID, totalPaid, amountLeft, percentLeft } = gbInfoObj;
  if (gb) {
try {
        await gbdb.replaceOne({ randID: randID }, gbInfoObj, { upsert: true });
        
        console.log(`saved to db`);
} catch (error) {
    scripts.logError(error, `Error updating in to db`)
    
}

    } else {
        
        try {
          await gbdb.create({
            _id: `${new mongoose.Types.ObjectId()}`,
          randID: randID,
              name: name,
              price: price,
              priceNumber: priceNumber,
              amountPaid: amountPaid,
              amountPaidNumber: amountPaidNumber,
              channelID: channelID,
              guildID: guildID,
              messageID: messageID,
              interactionID: interactionID,
              totalPaid: totalPaid ? totalPaid : amountPaid,
              amountLeft: amountLeft ? amountLeft : priceNumber - amountPaidNumber,
              percentLeft: percentLeft ? percentLeft : 100 - Math.round((amountPaidNumber / priceNumber) * 100),
          });
          console.log(`saved to db`);
        } catch (error) {
          scripts.cLog(gbInfoObj)
          scripts.logError(error)
          console.log(`not saved`);
        }
    }


  },

async getfromdb(randID) {
    console.log(`GETTING DATA`)
    console.log(`randID: ${randID}`)
    if (!randID) return; 
    let data;
    try {
        // data = announcementData.collection.find({ randID: randID })
        data = await gbdb.findOne({ randID: randID }).exec();
        // convert the data to an object
        // data = data.toObject();
        console.log(`data: ${data}`);
        return data;
    } catch (error) {
        console.log(`error: ${error}`);
        console.log(`not found`);
    }

},
async updatetodb(randID, gbInfoObj) {
    console.log(`UPDATING GB DATA`)

    if (!gbInfoObj) return;

    try {
        await gbdb.updateOne({ randID: randID }, gbInfoObj);
        console.log(`updated`);
    } catch (error) {
        console.log(`not updated`);
    }
},
async getdbObjfromdb(randID) {

    try {
        let thedata =  await this.getfromdb(randID)
        console.log(`the data`, thedata)
        // extract the data obj out of the data model and get the _doc
        let data = thedata._doc;
        console.log(`data`, data)
        // update the data model with the new data obj
        let newData = {
            name: data.name,
            price: data.price,
            priceNumber: data.priceNumber,
            amountPaid: data.amountPaid,
            amountPaidNumber: data.amountPaidNumber,
            channelID: data.channelID,
            guildID: data.guildID,
            messageID: data.messageID,
            interactionID: data.interactionID,
        };
        // send the message to the user
        return newData;

      } catch (error) {
        console.log(error);
      }
        // return the data obj
        
    },

};
