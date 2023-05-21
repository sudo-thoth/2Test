const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const groups = require("../../../MongoDB/db/schemas/schema_dynamicMessageGroup.js");
const mongoose = require("mongoose");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("manage-dynamic-message-group")
    .setDescription("A Dynamic group of messages reposted every 30 minutes")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption((option) =>
    option
      .setName("action")
      .setDescription("The action to perform")
      .setRequired(true)
      .addChoices(
        {name: "Create", value: "create"},
        {name: "Delete", value: "delete"},
        {name: "Groups List", value: "list"},
        )
      // .addChoice("Add Message", "add")
      // .addChoice("Remove Message", "remove")
      // .addChoice("List Messages", "list")
  )

    .addStringOption((option) =>
      option
        .setName("group-name")
        .setDescription("The Name of the Dynamic Message Group")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
        .setName("group-channel")
        .setDescription("The channel the group is located")
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
    const { options } = interaction;
    let groupName = options?.getString("group-name");
    let action = options?.getString("action");
    let groupChannel = options?.getChannel("group-channel");
if (action === "create") {
      try {
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Request to create the ${groupName} dynamic message group was received`,
              description: `<a:LoadingRed:1006206951602008104> \`loading\``,
              color: scripts.getColor(),
            }),
          ],
        });
      } catch (error) {
        console.log(error);
        try {
          await interaction.user.send({
            embeds: [
              createEmb.createEmbed({
                title: `Error: Request to create the ${groupName} dynamic message group was received`,
                description: `Error Log: \n\`\`\`js\n${error}\n\`\`\``,
                color: scripts.getErrorColor(),
              }),
            ],
          });
        } catch (err) {
          console.log(err);
        }
      }
      let group;
      try {
        group = await groups.findOne({
          channelId: groupChannel.id,
          groupName: groupName,
        });
      } catch (error) {
        scripts.logError(error, `error finding group in database`);
      }
      if (!group) {
        console.log(`group not found`);
        try {
          await interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: ``,
                description: `<a:LoadingRed:1006206951602008104> \`Creating the ${groupName} Dynamic Message Group\``,
                color: scripts.getColor(),
              }),
            ],
          });
        } catch (error) {
          console.log(error);
          try {
            await interaction.user.send({
              embeds: [
                createEmb.createEmbed({
                  title: `Error: Creating the ${groupName} Dynamic Message Group`,
                  description: `Error Log: \n\`\`\`js\n${error}\n\`\`\``,
                  color: scripts.getErrorColor(),
                }),
              ],
            });
          } catch (err) {
            console.log(err);
          }
        }
        let obj = {};
        obj._id = `${new mongoose.Types.ObjectId()}`;
        obj.messages = [];
        obj.groupName = groupName;
        obj.channelId = groupChannel.id;
        obj.serverId = groupChannel.guild.id;
        obj.groupID = scripts_djs.getRandID();
        obj.onlineStatus = false;
        try {
          await groups.create(obj);
          console.log(
            `The [ Group Name: ${obj.groupName} , Group id: ${obj.groupID} ] was JUST saved to the database`
          );
        } catch (error) {
          console.log(
            `Error while trying to save The [ Group Name: ${obj.groupName} , Group id: ${obj.groupID} ] to the database: `,
            error
          );
          return await interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Error Occurred`,
                description: `\`There was an error with the database, please try again\``,
                footer: { text: `If error persists, contact the Devs` },
                color: scripts.getColor(),
              }),
            ],
          });
        }
        console.log(`the group`, group);
        return await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `${groupName} Group Has Been Created`,
              color: scripts.getSuccessColor(),
              description: `**__TO ADD A MESSAGE__**\n> Run \`/add-Dynamic-Message\` to add a message to the group\n  OR\n> Right-click any message in the channel -> go to apps -> select \`Add to Dynamic Message Group\``,
            }),
          ],
        });
      } else {
        console.log(`group is already created with the same name found`);
        return await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Error Occurred`,
              description: `\`There is already a Group Registered to the #${groupChannel.id} channel, please try again with a Different Name\``,
            }),
          ],
        });
      }
} else if (action === 'delete'){

  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `Request to delete the ${groupName} dynamic message group was received`,
          description: `<a:LoadingRed:1006206951602008104> \`loading\``,
          color: scripts.getColor(),
        }),
      ],
    });
  } catch (error) {
    console.log(error);
    try {
      await interaction.user.send({
        embeds: [
          createEmb.createEmbed({
            title: `Error: Request to delete the ${groupName} dynamic message group was received`,
            description: `Error Log: \n\`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          }),
        ],
      });
    } catch (err) {
      console.log(err);
    }
  }
  let group;
  try {
    group = await groups.findOne({
      channelId: groupChannel.id,
      groupName: groupName,
    });
  } catch (error) {
    scripts.logError(error, `error finding group in database`);
  }
  if (group) {
    console.log(`group not found`);
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: ``,
            description: `<a:LoadingRed:1006206951602008104> \`Deleting the ${groupName} Dynamic Message Group\``,
            color: scripts.getColor(),
          }),
        ],
      });
    } catch (error) {
      console.log(error);
      try {
        await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `Error: Deleting the ${groupName} Dynamic Message Group`,
              description: `Error Log: \n\`\`\`js\n${error}\n\`\`\``,
              color: scripts.getErrorColor(),
            }),
          ],
        });
      } catch (err) {
        console.log(err);
      }
    }
    // delete the group from the database
    try {
      await groups.deleteOne({
        channelId: groupChannel.id,
        groupName: groupName,
      });
      console.log(
        `The [ Group Name: ${groupName} , Group id: ${group.groupID} ] was JUST deleted from the database`
      );
    } catch (error) {
      console.log(
        `Error while trying to delete The [ Group Name: ${groupName} , Group id: ${group.groupID} ] from the database: `,
        error
      );
      return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error Occurred`,
            description: `\`There was an error with the database, please try again\``,
            footer: { text: `If error persists, contact the Devs` },
            color: scripts.getErrorColor(),
          }),
        ],
      });
    }
    console.log(`the group`, group);
     await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `${groupName} Group Has Been Deleted`,
          color: scripts.getSuccessColor(),
         
        }),
      ],
    });
    await scripts.delay(5000)
    return await interaction.deleteReply()
  } else {
    console.log(`group is not found with the name`);
    let listOfValidGroups = []; 
    let allGroups = await groups.find({channelId: groupChannel.id})
    allGroups.forEach(group => {
      listOfValidGroups.push(group.groupName)
    })
    let listString = '';
    listOfValidGroups.forEach(group => {
      listString += `\`-\` \`${group}\`\n`
    })

    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `Error Occurred`,
          description: `\`There is no Group Registered to the #${groupChannel.id} channel with the name ${groupName}, please try again with a Different Name\`\n\n**The Available Groups Are:**\n${listString}`,
          color: scripts.getErrorColor(),
        }),
      ],
    });
    await scripts.delay(16000)
    return await interaction.deleteReply()
  }

} else if (action === 'list'){
  try {
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Request to list all dynamic message groups was received`,
            description: `<a:LoadingRed:1006206951602008104> \`loading\``,
            color: scripts.getColor(),
          }),
        ],
      });
    } catch (error) {
      console.log(error);
      try {
        await interaction.user.send({
          embeds: [
            createEmb.createEmbed({
              title: `Error: Request to list all dynamic message groups was received`,
              description: `**If Error Persists Contact the Developers**\n\nError Log: \n\`\`\`js\n${error}\n\`\`\``,
              color: scripts.getErrorColor(),
            }),
          ],
        });
      } catch (err) {
        console.log(err);
      }
    }

    let allGroups = await groups.find({channelId: groupChannel.id})
    let groupList = []; // array of objects {groupName: '', groupID: '', status: '', messageCount: '', lastUpdated: ''}
    let embedDescription = ``;
    for ( let i = 0; i < allGroups.length; i++){
      let group = allGroups[i]
      let groupObj = {
        groupName: group.groupName,
        groupID: group.groupID,
        status: group.onlineStatus,
        messageCount: group.messages?.length(),
        lastUpdated: group.cycleStartedAt, // <:22_offline:1107537293335597057>
        listString: `${group.onlineStatus ? `<:24_online:1093185822087458816>` : `<:22_offline:1107537293335597057>`} **__${group.groupName}__** - \`${group.messages?.length()}\` \`${group.messages?.length() !== 1 ? 'Groups' : 'Group'}\` **-** \`last update: ${group.cycleStartedAt}\` **-** \`id:${group.groupID}\` \n`
      }
      groupList.push(groupObj)
    }

     embedDescription += `${groupObj.listString}\n`;

     let embed = createEmb.createEmbed({title: `List of Dynamic Message Groups`, description: embedDescription, color: scripts.getColor()})
      try {
        await interaction.editReply({embeds: [embed]})
        await scripts.delay(15000)
        try {
          return await interaction.deleteReply()
         } catch (error) {
          return console.log(error);
         }
      } catch (error) {
        console.log(error);
        try {
           return await interaction.user.send({
            embeds: [
              createEmb.createEmbed({
                title: `Error: Request to list all dynamic message groups was received`,
                description: `**If Error Persists Contact the Developers**\n\nError Log: \n\`\`\`js\n${error}\n\`\`\``,
                color: scripts.getErrorColor(),
              }),
            ],
          });
        } catch (err) {
          return console.log(err);
        }
        
      }
       
  } catch (error) {
    console.log(error);
    try {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: `Error: Request to list all dynamic message groups was received`,
            description: `**If Error Persists Contact the Developers**\n\nError Log: \n\`\`\`js\n${error}\n\`\`\``,
            color: scripts.getErrorColor(),
          }),
        ],
      });
    } catch (err) {
      console.log(err);

  }
}
}
  },
};
