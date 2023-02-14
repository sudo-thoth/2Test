const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
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
let modal;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gb")
    .setDescription("post group buy")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
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
        // the user's action row is updated to only include the `GB Cancelled` button, `GB Complete` button, and `GB Postponed` button
            // the `GB Cancelled` button will change the embed color to red and change the title to `Group Buy Cancelled`, change the amount needed to `N/A`
            // the `GB Complete` button will change the embed color to green and change the title to `Group Buy Complete!`, change the amount needed to `0`, the percentage to `100%`
            // the `GB Postponed` button will change the embed color to yellow and change the title to `Group Buy Postponed`, change the amount needed to `N/A`
    

            // first step is to create the modal
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Create Modal
     modal = createModal.createModal({
        title: "New Group Buy",
        customID: `gb-post-modal${randID}`,
        inputFields: [
            {
                customID: "gb_p_name",
        label: "Name of the song",
        style: "TextInputStyle.Short",
        placeholder: "",
        required: false
            },
            {
                customID: "gb_p_price",
        label: "Price of the song",
        style: "TextInputStyle.Short",
        placeholder: "",
        required: true
            },
            {
                customID: "gb_p_current",
        label: "Amount of money raised",
        style: "TextInputStyle.Short",
        placeholder: "",
        required: false
            },
        ],
    })
    // Show the Modal to the user
    await interaction.showModal(modal);
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Second step is receive the client emitted event along with the data payload
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Receive Modal Data
    client.on("gb-post", async (obj) => {
const { name, price, amountPaid, channel, randID } = obj;
// after the modal is submitted a message composed of an embed and 1 button labeled `EDIT` (that only admin users can see and click) is sent to the channel the command was executed in

let percentage = Math.floor(amountPaid / price * 100);
percentage = `${percentage}%`;
let amountLeft = price - amountPaid;
// date that is a string with the amountPaid date and time like `Today at

        embed = createEmb.createEmbed({
            author: {
                name: name === `` ? `Total Paid` : `Total Paid • ${name} GB`,
            },
            fields: [
                {
                    name: `__Amount Paid__`,
                    value: amountPaid == `` ? `\`$\`\`0\`` : `\`$\`\`${amountPaid}\``,
                    inline: false
                },
                {
                    name: `__Song Price__`,
                    value: price == `` ? `\`$\`\`0\`` : `\`$\`\`${price}\``,
                    inline: false
                },
            ],
            footer: {
                text: `$${amountLeft} left • ${percentage}% complete`,
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
                    label: `EDIT`,
                    style: `ButtonStyle.Primary`,
                    disabled: false,
                }),
            ],
        });

        let message;
        try {
             message = await channel.send({ embeds: [embed], components: [actionRow] });
            let messageID = message.id;
            client.gb.set(randID, {
                message: message,
                channel: channel,
                messageID: messageID,
                channelID: channel.id,
                name: name,
                price: price,
                amountPaid: amountPaid,
                randID: randID,
            });

            try {
                await interaction.editReply({ embeds: [createEmb.createEmbed({
                    title: `Successfully updated the Group Buy embed`,
                    description: `**Actions Taken:** *Added* \`${num}\` to the *Amount Paid*\`\n\n\`Amount Paid:\` \`$${gbEmbedAmountPaid}\`\n\`Amount Left:\` \`$${amountLeft}\`\n\`Percent Left:\` \`${percentLeft}%\``,
                    color: scripts.getSuccessColor(),
                })]});
        
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
                await interaction.editReply({ embeds: [createEmb.createEmbed({
                    title: 'There was an error updating the group buy embed, please contact STEVE JOBS\n\n```js\n' + err + '```',
                    color: scripts.getErrorColor(),
                })]});
            } catch (error) {
                console.log(error);
                
            }
            }
        
});
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Receive Button Interactions
    client.on("gb-edit", async (interaction, randID) => {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
            console.log(`Edit Button Clicked by a non-admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);
            // reply with an ephemeral message saying that only admins can use this button
             await interaction.editReply({ embeds: [createEmb.createEmbed({
                title: `Only admins can use this button`,
                color: scripts.getErrorColor(),description: `Leave this button alone <@${interaction.user.id}>!\n\n\n**You do not have permission to use this button. You can only VIEW the group buy**.`,
                timestamp: true,
                thumbnail: {
                    url: interaction.user.displayAvatarURL({ dynamic: true }),
                },
             })]});
        }
        else {
            console.log(`Edit Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);
            // when the admin user clicks the `EDIT` button, another emphemeral action row with 3 buttons labeled `UPDATE`, `DELETE`, and `END` is shown

            let updateButton = await createButtn.createButton({
                customID: `gb_update${randID}`,
                label: `UPDATE`,
                style: `Primary`,
                disabled: false,
            });
            let deleteButton = await createButtn.createButton({
                customID: `gb_delete${randID}`,
                label: `DELETE`,
                style: `Danger`,
                disabled: false,
            });
            let endButton = await createButtn.createButton({
                customID: `gb_end${randID}`,
                label: `END`,
                style: `Secondary`,
                disabled: false,
            });
            actionRow = await createActRow.createActionRow({
                components: [updateButton, deleteButton, endButton],
            });
   try {
             await interaction.editReply({ embeds: [createEmb.createEmbed({
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
                     iconURL: interaction.client.user.displayAvatarURL({ dynamic: true }),
                 },
             })], components: [actionRow] });
   } catch (error) {
    console.log(`Error displaying the GB Edit Actions for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `, error)
    try{
        await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: `Error`,
            color: scripts.getErrorColor(),
            description: `There was an error displaying the GB Edit Actions for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: ${error}\n\n\n**CONTACT STEVE JOBS**`,
    })], components: [] });
    } catch (error) {
        console.log(`Error displaying the GB Edit Actions Error Message \nError:`);
        console.log(error);
    }    
   }

        }
    });

    client.on("gb-update", async (interaction, randID) => {
        await interaction.deferReply({ ephemeral: true });
            console.log(`Update Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);
            // when the admin user clicks the `EDIT` button, another emphemeral action row with 3 buttons labeled `UPDATE`, `DELETE`, and `END` is shown

            let updateAddButton = await createButtn.createButton({
                customID: `gb_update_add${randID}`,
                label: `+`,
                style: `SUCCESS`,
                disabled: false,
            });
            let updateSubtractButton = await createButtn.createButton({
                customID: `gb_update_minus${randID}`,
                label: `-`,
                style: `Danger`,
                disabled: false,
            });
            let editEmbedButton = await createButtn.createButton({
                customID: `gb_update_embed${randID}`,
                label: `Change Embed Info`,
                style: `Secondary`,
                disabled: false,
            });
            actionRow = await createActRow.createActionRow({
                components: [updateSubtractButton, editEmbedButton, updateAddButton],
            });
   try {

    // edit the action row to only show the new buttons
    await interaction.editReply({ embeds: [createEmb.createEmbed({
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
    })], components: [actionRow] });
    

             
   } catch (error) {
    console.log(`Error displaying the GB Update Actions for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}\nError: `, error)
    try{
        await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: `Error`,
            color: scripts.getErrorColor(),
            description: `There was an error displaying the GB Update Actions for admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`+'\n\n\n```js\n' + err + '```\n\n\n**CONTACT STEVE JOBS**',
    })], components: [] });
    } catch (error) {
        console.log(`Error displaying the GB Update Actions Error Message \nError:`);
        console.log(error);
    }    
   }

    });

    client.on("gb-add", async (interaction, randID) => {
            console.log(`Add Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);
            let gbInfo = client.gb.get(randID);
    let gbMessage = await interaction.channel.messages.fetch(gbInfo.messageID);
    let gbEmbed = gbMessage.embeds[0];
    let gbEmbedFields = gbEmbed.fields;
    let gbEmbedAmountPaidField = gbEmbedFields[0];
    let gbEmbedAmountPaid = gbEmbedAmountPaidField.value;
           // Create Modal
     modal = createModal.createModal({
        title: "Add to the Total Paid",
        customID: `gb-add-modal${randID}`,
        inputFields: [
            {
                customID: "gb_add",
        label: "Enter the amount you want to add to the total paid",
        style: "TextInputStyle.Short",
        placeholder: `${gbEmbedAmountPaid}`,
        required: true
            },
        ],
    })
    // Show the Modal to the user
    await interaction.showModal(modal);
    });

    client.on("gb-sub", async (interaction, randID) => {
        console.log(`Subtract Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);
        let gbInfo = client.gb.get(randID);
let gbMessage = await interaction.channel.messages.fetch(gbInfo.messageID);
let gbEmbed = gbMessage.embeds[0];
let gbEmbedFields = gbEmbed.fields;
let gbEmbedAmountPaidField = gbEmbedFields[0];
let gbEmbedAmountPaid = gbEmbedAmountPaidField.value;
       // Create Modal
 modal = createModal.createModal({
    title: "Subtract from Total Paid",
    customID: `gb-sub-modal${randID}`,
    inputFields: [
        {
            customID: "gb_sub",
    label: "Enter the amount you want to subtract to the total paid",
    style: "TextInputStyle.Short",
    placeholder: `${gbEmbedAmountPaid}`,
    required: true
        },
    ],
})
// Show the Modal to the user
await interaction.showModal(modal);
});

client.on("gb-embed", async (interaction, randID) => {
    console.log(`Update Embed Button Clicked by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);
    let gbInfo = client.gb.get(randID);
let gbMessage = await interaction.channel.messages.fetch(gbInfo.messageID);
let gbEmbed = gbMessage.embeds[0];
let gbEmbedFields = gbEmbed.fields;
let gbEmbedAmountPaidField = gbEmbedFields[0];
let gbEmbedAmountPaid = gbEmbedAmountPaidField.value;
   // Create Modal
   modal = createModal.createModal({
    title: "Edit the GB Embed",
    customID: `gb-reset${randID}`,
    inputFields: [
        {
            customID: "gb_update_name",
    label: `"Name of the song"`,
    style: "TextInputStyle.Short",
    placeholder: `${gbInfo.name}`,
    required: false
        },
        {
            customID: "gb_update_price",
    label: "Price of the song",
    style: "TextInputStyle.Short",
    placeholder: `${gbInfo.price}`,
    required: false
        },
        {
            customID: "gb_update_current",
    label: "Amount of money raised",
    style: "TextInputStyle.Short",
    placeholder: `${gbInfo.amountPaid}`,
    required: false
        },
    ],
})
// Show the Modal to the user
await interaction.showModal(modal);
});

    client.on("gb-addtototal", async (obj) => {
        await interaction.deferReply({ ephemeral: true });
            console.log(`Add Modal Submitted by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);

            let { randID, num } = obj;
            // remove anything thats not a number in the num string
            num = num.replace(/[^0-9]/g, '');
            // convert the num to an integer
            num = parseInt(num);

            let gbInfo = client.gb.get(randID);
    let gbMessage = await interaction.channel.messages.fetch(gbInfo.messageID);
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
    let footerNums = gbEmbedFooterText.match(`\$(\d+(?:\.\d+)?)\s+left\s+•\s+(\d+(?:\.\d+)?)%\s+complete`).splice(1, 2);
    let amountLeft = footerNums[0];
    // convert the amountLeft to an integer and round it to 2 decimal places
    amountLeft = Math.round(parseInt(amountLeft) * 100) / 100;
    
    let percentLeft = footerNums[1];
    // convert the percentLeft to an integer and round it to 1 decimal place
    percentLeft = Math.round(parseInt(percentLeft) * 10) / 10;

    // remove anything thats not a number in the gbEmbedAmountPaid string
    gbEmbedAmountPaid = gbEmbedAmountPaid.replace(/[^0-9]/g, '');
    // convert the gbEmbedAmountPaid to an integer
    gbEmbedAmountPaid = parseInt(gbEmbedAmountPaid);
    // remove anything thats not a number in the gbEmbedSongPrice string
    gbEmbedSongPrice = gbEmbedSongPrice.replace(/[^0-9]/g, '');
    // convert the gbEmbedSongPrice to an integer
    gbEmbedSongPrice = parseInt(gbEmbedSongPrice);
    // add the num to the gbEmbedAmountPaid
    gbEmbedAmountPaid = gbEmbedAmountPaid + num;
    // add the num to the gbEmbedAmountPaid
gbEmbedAmountPaid = gbEmbedAmountPaid - num;
// update the percentLeft with one decimal place and amountLeft with 2 decimals places
percentLeft = Math.round((gbEmbedAmountPaid / gbEmbedSongPrice) * 1000) / 10;
amountLeft = Math.round((gbEmbedSongPrice - gbEmbedAmountPaid) * 100) / 100;
// amountPaid is now updated, convert back to a string
gbEmbedAmountPaid = gbEmbedAmountPaid.toString();
// add the $ to the gbEmbedAmountPaid
gbEmbedAmountPaid = `\`$\`\`${gbEmbedAmountPaid}\``;

    // update the gbFooterText
gbEmbedFooterText = `$${amountLeft} left • ${percentage}% complete`;
    // update the gbEmbedAmountPaidField
    gbEmbedAmountPaidField = {
        name: gbEmbedAmountPaidName,
        value: gbEmbedAmountPaid,
        inline: gbEmbedAmountPaidInline
    };
// update the footer
    gbEmbedFooter = {
        text: gbEmbedFooterText,
        iconURL: gbEmbedFooter.iconURL
    };
    // update the gbEmbedFields
    gbEmbedFields = [gbEmbedAmountPaidField, gbEmbedSongPriceField];
    // update the gbEmbed
    gbEmbed = {
        title: gbEmbedTitle,
        description: gbEmbedDescription,
        color: gbEmbedColor,
        thumbnail: gbEmbedThumbnail ? gbEmbedThumbnail : '',
        footer: gbEmbedFooter,
        fields: gbEmbedFields,
        timestamp: gbEmbedTimestamp,
        author: gbEmbedAuthor,
    };
    // update the gbMessage
   try { 
    gbMessage = await gbMessage.edit({ embeds: [createEmb.createEmbed(gbEmbed)] });

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
    };
    // update the gbInfo
    client.gb.set(randID, gbInfo);

    try {
        await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: `Successfully updated the Group Buy embed`,
            description: `**Actions Taken:** *Added* \`${num}\` to the *Amount Paid*\`\n\n\`Amount Paid:\` \`$${gbEmbedAmountPaid}\`\n\`Amount Left:\` \`$${amountLeft}\`\n\`Percent Left:\` \`${percentLeft}%\``,
            color: scripts.getSuccessColor(),
        })]});

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
        await interaction.editReply({ embeds: [createEmb.createEmbed({
            title: 'There was an error updating the group buy embed, please contact STEVE JOBS\n\n```js\n' + err + '```',
            color: scripts.getErrorColor(),
        })]});
    } catch (error) {
        console.log(error);
        
    }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // New Ideas
    // can use the View Group Buys Button in the future to view all group buys in the database
    // View Group Buys (allows user to see all active group buys in the current server and all active group buys in the database that was created by their user id),
  });

  client.on("gb-subfromtotal", async (obj) => {
    await interaction.deferReply({ ephemeral: true });
        console.log(`Subtract Modal Submitted by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);

        let { randID, num } = obj;
        // remove anything thats not a number in the num string
        num = num.replace(/[^0-9]/g, '');
        // convert the num to an integer
        num = parseInt(num);

        let gbInfo = client.gb.get(randID);
let gbMessage = await interaction.channel.messages.fetch(gbInfo.messageID);
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
let footerNums = gbEmbedFooterText.match(`\$(\d+(?:\.\d+)?)\s+left\s+•\s+(\d+(?:\.\d+)?)%\s+complete`).splice(1, 2);
let amountLeft = footerNums[0];
// convert the amountLeft to an integer and round it to 2 decimal places
amountLeft = Math.round(parseInt(amountLeft) * 100) / 100;

let percentLeft = footerNums[1];
// convert the percentLeft to an integer and round it to 1 decimal place
percentLeft = Math.round(parseInt(percentLeft) * 10) / 10;

    
// remove anything thats not a number in the gbEmbedAmountPaid string
gbEmbedAmountPaid = gbEmbedAmountPaid.replace(/[^0-9]/g, '');
// convert the gbEmbedAmountPaid to an integer
gbEmbedAmountPaid = parseInt(gbEmbedAmountPaid);
// remove anything thats not a number in the gbEmbedSongPrice string
gbEmbedSongPrice = gbEmbedSongPrice.replace(/[^0-9]/g, '');
// convert the gbEmbedSongPrice to an integer
gbEmbedSongPrice = parseInt(gbEmbedSongPrice);
// add the num to the gbEmbedAmountPaid
gbEmbedAmountPaid = gbEmbedAmountPaid - num;
// update the percentLeft with one decimal place and amountLeft with 2 decimals places
percentLeft = Math.round((gbEmbedAmountPaid / gbEmbedSongPrice) * 1000) / 10;
amountLeft = Math.round((gbEmbedSongPrice - gbEmbedAmountPaid) * 100) / 100;
// amountPaid is now updated, convert back to a string
gbEmbedAmountPaid = gbEmbedAmountPaid.toString();
// add the $ to the gbEmbedAmountPaid
gbEmbedAmountPaid = `\`$\`\`${gbEmbedAmountPaid}\``;


    // update the gbFooterText
gbEmbedFooterText = `$${amountLeft} left • ${percentage}% complete`;
// update the gbEmbedAmountPaidField
gbEmbedAmountPaidField = {
    name: gbEmbedAmountPaidName,
    value: gbEmbedAmountPaid,
    inline: gbEmbedAmountPaidInline
};
// update the footer
gbEmbedFooter = {
    text: gbEmbedFooterText,
    iconURL: gbEmbedFooter.iconURL
};
// update the gbEmbedFields
gbEmbedFields = [gbEmbedAmountPaidField, gbEmbedSongPriceField];
// update the gbEmbed
gbEmbed = {
    title: gbEmbedTitle,
    description: gbEmbedDescription,
    color: gbEmbedColor,
    thumbnail: gbEmbedThumbnail ? gbEmbedThumbnail : '',
    footer: gbEmbedFooter,
    fields: gbEmbedFields,
    timestamp: gbEmbedTimestamp,
    author: gbEmbedAuthor,
};
// update the gbMessage
try { 
gbMessage = await gbMessage.edit({ embeds: [createEmb.createEmbed(gbEmbed)] });

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
};
// update the gbInfo
client.gb.set(randID, gbInfo);

try {
    await interaction.editReply({ embeds: [createEmb.createEmbed({
        title: `Successfully updated the Group Buy embed`,
        description: `**Actions Taken:** *Subtracted* \`${num}\` from the *Amount Paid*\`\n\n\`Amount Paid:\` \`$${gbEmbedAmountPaid}\`\n\`Amount Left:\` \`$${amountLeft}\`\n\`Percent Left:\` \`${percentLeft}%\``,
        color: scripts.getSuccessColor(),
    })]});

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
    await interaction.editReply({ embeds: [createEmb.createEmbed({
        title: 'There was an error updating the group buy embed, please contact STEVE JOBS\n\n```js\n' + err + '```',
        color: scripts.getErrorColor(),
    })]});
} catch (error) {
    console.log(error);
    
}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// New Ideas
// can use the View Group Buys Button in the future to view all group buys in the database
// View Group Buys (allows user to see all active group buys in the current server and all active group buys in the database that was created by their user id),
});


client.on("gb-reset", async (obj) => {
  await interaction.deferReply({ ephemeral: true });
      console.log(`Subtract Modal Submitted by an admin user:\nusername: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}`);

      const { name, price, amountPaid, randID } = obj;
      // remove anything thats not a number in the num string
      num = num.replace(/[^0-9]/g, '');
      // convert the num to an integer
      num = parseInt(num);

      let gbInfo = client.gb.get(randID);
let gbMessage = await interaction.channel.messages.fetch(gbInfo.messageID);
let gbEmbed = gbMessage.embeds[0];
let gbEmbedTitle = name !== '' ? `Total Paid • ${name} GB` : gbEmbed.title;
let gbEmbedDescription = gbEmbed.description;
let gbEmbedColor = gbEmbed.color;
let gbEmbedThumbnail = gbEmbed.thumbnail;
let gbEmbedFooter = gbEmbed.footer;
let gbEmbedFooterText = gbEmbedFooter.text;
let gbEmbedFields = gbEmbed.fields;
let gbEmbedTimestamp = gbEmbed.timestamp;
let gbEmbedAuthor = gbEmbed.author;
let gbEmbedAmountPaidField = gbEmbedFields[0];
let gbEmbedAmountPaid = amountPaid !== '' ? amountPaid : gbEmbedAmountPaidField.value;
let gbEmbedAmountPaidName = gbEmbedAmountPaidField.name;
let gbEmbedAmountPaidInline = gbEmbedAmountPaidField.inline;
let gbEmbedSongPriceField = gbEmbedFields[1];
let gbEmbedSongPrice = price !== '' ? price : gbEmbedSongPriceField.value;



let amountLeft = footerNums[0];
// convert the amountLeft to an integer and round it to 2 decimal places
amountLeft = Math.round(parseInt(amountLeft) * 100) / 100;

let percentLeft = footerNums[1];
// convert the percentLeft to an integer and round it to 1 decimal place
percentLeft = Math.round(parseInt(percentLeft) * 10) / 10;

  
// remove anything thats not a number in the gbEmbedAmountPaid string
gbEmbedAmountPaid = gbEmbedAmountPaid.replace(/[^0-9]/g, '');
// convert the gbEmbedAmountPaid to an integer
gbEmbedAmountPaid = parseInt(gbEmbedAmountPaid);
// remove anything thats not a number in the gbEmbedSongPrice string
gbEmbedSongPrice = gbEmbedSongPrice.replace(/[^0-9]/g, '');
// convert the gbEmbedSongPrice to an integer
gbEmbedSongPrice = parseInt(gbEmbedSongPrice);
// update the percentLeft with one decimal place and amountLeft with 2 decimals places
percentLeft = Math.round((gbEmbedAmountPaid / gbEmbedSongPrice) * 1000) / 10;
amountLeft = Math.round((gbEmbedSongPrice - gbEmbedAmountPaid) * 100) / 100;
// amountPaid is now updated, convert back to a string
gbEmbedAmountPaid = gbEmbedAmountPaid.toString();
// add the $ to the gbEmbedAmountPaid
gbEmbedAmountPaid = `\`$\`\`${gbEmbedAmountPaid}\``;


  // update the gbFooterText
gbEmbedFooterText = `$${amountLeft} left • ${percentage}% complete`;
// update the gbEmbedAmountPaidField
gbEmbedAmountPaidField = {
  name: gbEmbedAmountPaidName,
  value: gbEmbedAmountPaid,
  inline: gbEmbedAmountPaidInline
};
// update the footer
gbEmbedFooter = {
  text: gbEmbedFooterText,
  iconURL: gbEmbedFooter.iconURL
};
// update the gbEmbedFields
gbEmbedFields = [gbEmbedAmountPaidField, gbEmbedSongPriceField];
// update the gbEmbed
gbEmbed = {
  title: gbEmbedTitle,
  description: gbEmbedDescription,
  color: gbEmbedColor,
  thumbnail: gbEmbedThumbnail ? gbEmbedThumbnail : '',
  footer: gbEmbedFooter,
  fields: gbEmbedFields,
  timestamp: gbEmbedTimestamp,
  author: gbEmbedAuthor,
};
// update the gbMessage
try { 
gbMessage = await gbMessage.edit({ embeds: [createEmb.createEmbed(gbEmbed)] });

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
};
// update the gbInfo
client.gb.set(randID, gbInfo);

try {
  await interaction.editReply({ embeds: [createEmb.createEmbed({
      title: `<@${interaction.user.id}> You Have Successfully Updated the Group Buy Embed`,
      description: `\`Amount Paid:\` \`$${gbEmbedAmountPaid}\`\n\`Amount Left:\` \`$${amountLeft}\`\n\`Percent Left:\` \`${percentLeft}%\``,
      color: scripts.getSuccessColor(),
  })]});

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
  await interaction.editReply({ embeds: [createEmb.createEmbed({
      title: 'There was an error updating the group buy embed, please contact STEVE JOBS\n\n```js\n' + err + '```',
      color: scripts.getErrorColor(),
  })]});
} catch (error) {
  console.log(error);
  
}
}
});




},
};
