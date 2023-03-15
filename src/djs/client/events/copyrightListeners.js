const client = require(`../../index.js`);
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require(`../../functions/scripts/scripts_djs.js`);
const scripts_mongoDB = require(`../../functions/scripts/scripts_mongoDB.js`);
const createEmb = require(`../../functions/create/createEmbed.js`);
const createBtn = require(`../../functions/create/createButton.js`);
const createActRow = require(`../../functions/create/createActionRow.js`);

// const index = require(`src/djs/index.js`)
// const client = index.getClient();
// console.log(client);
function isValidURL(string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}
async function fileProcessing(interaction) {
  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: "File Being Processed",
          description: "Please wait...",
          color: 0x00ff00,
        }),
      ],
      components: [],
    });
  } catch (error) {
    await throwNewError("Sending File Processing Update", interaction, error);
  }
}
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
async function throwNewError(
  action = action && typeof action === "string" ? action : null,
  interaction,
  err,
  i
) {
  console.log(`the action is`, action);
  console.log(`the interaction is`, interaction);
  console.log(`the error is`, err);
  console.log(`the index is`, i);
  try {
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: "There was an Error , Share the Error w the Developer",
          description:
            `__While :__ \`${action !== null ? action : "?"}\`\n` +
            "```js\n" +
            err +
            "\n```\n" +
            `Error Report Summary:` +
            "\n```js\n" +
            `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interaction.message.id}\nButton ID: ${interaction.customID}` +
            "\n```",
          color: scripts.getErrorColor(),
          footer: {
            text: "Contact STEVE JOBS and Send the Error",
            iconURL: interaction.user.avatarURL(),
          },
        }),
      ],
    });
  } catch (error) {
    if (i) {
      try {
        await i.editReply({
          embeds: [
            createEmb.createEmbed({
              title: "There was an Error , Share the Error w the Developer",
              description:
                "```js\n" +
                err +
                "\n```\n" +
                `Error Report Summary:` +
                "\n```js\n" +
                `username: ${i.member.user.username}\nID: ${i.member.user.id}\nGuild: ${i.guild.name}\nGuild ID: ${i.guild.id}\nChannel: ${i.channel.name}\nChannel ID: ${i.channel.id}\nMessage ID: ${i.message.id}\nButton ID: ${i.customID}` +
                "\n```",
              color: scripts.getErrorColor(),
              footer: {
                text: "Contact STEVE JOBS and Send the Error",
                iconURL: i.user.avatarURL(),
              },
            }),
          ],
        });
      } catch (errr) {
        console.log(
          `error occurred when trying to send the user this-> Error: ${err}\n\n\nThe error that occurred when trying to send the user the 2nd time -> error is: ${error}\n\n\nThe error that occurred when trying to send the user the 3rd time -> error is: ${errr}`
        );
      }
    } else {
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: "There was an Error, Share the Error w the Developer",
            description:
              `${
                interaction.commandName
                  ? `Command: \`${interaction.commandName}\`\n`
                  : ""
              }` +
              "```js\n" +
              err +
              "\n```\n" +
              `Error occurred for admin user:` +
              "\n```js\n" +
              `username: ${interaction.member.user.username}\nID: ${
                interaction.member.user.id
              }\nGuild: ${interaction.guild.name}\nGuild ID: ${
                interaction.guild.id
              }\nChannel: ${interaction.channel.name}\nChannel ID: ${
                interaction.channel.id
              }${
                interaction.message
                  ? `\nMessage ID: ${interaction.message.id}`
                  : ""
              }${
                interaction.customID
                  ? `\nCustom ID: ${interaction.customID}`
                  : ""
              }` +
              "\n```",
            color: scripts.getErrorColor(),
            footer: {
              text: "Contact STEVE JOBS and Send the Error",
              iconURL: interaction.user.avatarURL(),
            },
          }),
        ],
      });
    }
  }
}

if (client) {

  // we are going to any message in a channel if that channel is listed in the database as having the feature turned on
  // After checking the data base to see if the feature is on, If it is on we will filter
  // Filter meaning, for every message thats sent by any user except a bot user's message, the message will go through a filter proccess
  // The message will be checked to see if any active internet links were included in the content & check if any audio or video file is attached to the message
  // IF the message passes the filter and does not contain a link or an audio/video attachment, then nothing happens the message and the filter keeps listening for more messages
  // IF the message includes a link(s) -> First the message is saved to a variable then is deleted from the channel,then the link(s) will be extracted from the message content, the link(s) & original message data will be saved to the database under a unique id to access later, A button will be created with a title `DM Content`, secondary type, and a custom id that ends in the same unique id form the link, when this button is pressed it triggers an event that dm's the user who pressed it the link associated with the custom ID ending along with the original message content, author, etc., The original message content minus the link(s) that was extracted will be placed into an embed's description with a title of `Copyright Control` with an author being the original message's user info and avatarURL and with a footer being the og channel name, server name, & time stamp of the original messages time sent into the channel, then a message is sent into the same channel where the original message was pulled from, this message object is composed of the `Copyright Control` embed and the `DM Content` button, then the filter continues to listen for more messages
  // IF the message inlcudes an audio or video file(s) attachment -> First the message is saved to a variable then is deleted from the channel,then the File(s) will be extracted from the message object, the file(s) & original message data will be saved to the database under a unique id to access later, A button will be created with a title `DM Content`, secondary type, and a custom id that ends in the same unique id from the file, when this button is pressed it triggers an event that dm's the user who pressed it the file associated with the custom ID ending along with the original message content, author, etc., The original message content  will be placed into an embed's description with a title of `Copyright Control` with an author being the original message's user info and avatarURL and with a footer being the og channel name, server name, & time stamp of the original messages time sent into the channel, then a message is sent into the same channel where the original message was pulled from, this message object is composed of the `Copyright Control` embed and the `DM Content` button, then the filter continues to listen for more messages
  // IF the message inlcudes BOTH an audio or video file(s) attachment && a link(s) -> First the message is saved to a variable then is deleted from the channel,then the File(s) && Link(s) will be extracted from the message object and message content respectively, the file(s), link(s), & original message data will be saved to the database under a unique id to access later, A button will be created with a title `DM Content`, secondary type, and a custom id that ends in the same unique id from the file, when this button is pressed it triggers an event that dm's the user who pressed it the file(s) & link(s) associated with the custom ID ending along with the original message content, author, etc., The original message content  will be placed into an embed's description with a title of `Copyright Control` with an author being the original message's user info and avatarURL and with a footer being the og channel name, server name, & time stamp of the original messages time sent into the channel, then a message is sent into the same channel where the original message was pulled from, this message object is composed of the `Copyright Control` embed and the `DM Content` button, then the filter continues to listen for more messages

  client.on("messageCreate", async (i) => {
    const interactionObj = scripts_djs.getInteractionObj(interaction);
    const { id, channel, guild, userInfo, customID } = interactionObj;
    const { name, displayName, userId, avatar, role, roleID, roleName } =
      userInfo;
      randID = scripts_djs.extractID(customID);
  });

  
  let typeOfFile;
  client.on("role", async (interaction, customID) => {
    console.log(`emit recieved`);
    console.log(`original role is ${customID}`);
    let r = customID.split("role_")[1];
    //separate the custom id from teh rand id at the #
    r = r.split("#")[0];
    console.log(`the r is ${r}`);
    let roleName = r.split("_")[0];
    let currentServer = r.split("_")[1];
    const role = r;
    console.log(
      `the role name is ${roleName}\nthe current server is ${currentServer}`
    );

    console.log(`the role is ${role}`);
    // WRLD Updates Roles

    const updateRole = async (interaction, role) => {
      if (role) {
        const member = interaction.guild.members.cache.get(interaction.user.id);
        // get an array of the role names the user has
        const roleNames = member.roles.cache.map((role) => role.name);
        // if rolenames includes the role.name set toggle to true
        let toggle = false;
        if (roleNames.includes(role.name)) {
          toggle = true;
        }
        if (toggle) {
          try {
            try {
              member.roles.remove(role);
            } catch (error) {
              await throwNewError("removing leaks role", interaction, error);
            }
            await interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `${role.name} Role Removed`,
                  description: "role status updated successfully",
                  color: scripts.getErrorColor(),
                  author: {
                    name: member.user.tag,
                  },
                  thumbnail: member.user.displayAvatarURL({ dynamic: true }),
                }),
              ],
            });

            await scripts.delay(4444);
            await interaction.deleteReply();
          } catch (error) {
            await throwNewError(
              `sending updated role status for ${role.name} role`,
              interaction,
              error
            );
          }
        } else {
          try {
            try {
              member.roles.add(role);
            } catch (error) {
              await throwNewError("adding leaks role", interaction, error);
            }
            await interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `${role.name} Role Added`,
                  description: "role status updated successfully",
                  color: scripts.getSuccessColor(),
                  author: {
                    name: member.user.tag,
                  },
                  thumbnail: member.user.displayAvatarURL({ dynamic: true }),
                }),
              ],
            });

            await scripts.delay(4444);
            await interaction.deleteReply();
          } catch (error) {
            await throwNewError(
              `sending updated role status for ${role.name} role`,
              interaction,
              error
            );
          }
        }
      } else {
        try {
          try {
            await interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `🚫 Role Not Found`,
                  description:
                    "The Requested Role Was Not Found In The Current Server\nFailed to add role to user",
                  color: scripts.getErrorColor(),
                  author: {
                    name: interaction.user.tag,
                  },
                  thumbnail: interaction.user.displayAvatarURL({
                    dynamic: true,
                  }),
                }),
              ],
            });
          } catch (error) {
            await throwNewError(
              "sending error message for role not found",
              interaction,
              error
            );
          }
        } catch (error) {
          await throwNewError("executing roles command", interaction, error);
        }
      }
    };
    // set a servername variable to the role sliced at the '_' and everything after it is the server name
    let leaksrole,
      ogfilesrole,
      snippetsrole,
      sessionsrole,
      compupdatesrole,
      newsrole,
      groupbuysrole,
      chatreviverole,
      giveawaysrole,
      stemeditsrole,
      sessioneditsrole,
      songofthedayrole;
    switch (currentServer) {
      case "NLMB":
        leaksrole = await interaction.guild.roles.fetch("1080671948335501372");
        ogfilesrole = await interaction.guild.roles.fetch(
          "1080671951644803133"
        );
        snippetsrole = await interaction.guild.roles.fetch(
          "1080671949371494440"
        );
        sessionsrole = await interaction.guild.roles.fetch(
          "1080671950097096796"
        );
        // compupdatesrole = await interaction.guild.roles.fetch(
        //   "1077785531645186088"
        // );
        newsrole = await interaction.guild.roles.fetch("1080671956279492679");
        groupbuysrole = await interaction.guild.roles.fetch(
          "1080671955130261625"
        );
        chatreviverole = await interaction.guild.roles.fetch(
          "1080671952731111425"
        );
        giveawaysrole = await interaction.guild.roles.fetch(
          "1080671954165567568"
        );
        songofthedayrole = await interaction.guild.roles.fetch(
          "1080671957407780884"
        );
        switch (roleName) {
          // WRLD Updates Roles
          case "leaks":
            await updateRole(interaction, leaksrole);
            break;
          case "ogfiles":
            await updateRole(interaction, ogfilesrole);
            break;
          case "snippets":
            await updateRole(interaction, snippetsrole);
            break;
          case "sessions":
            await updateRole(interaction, sessionsrole);
            break;
          case "compupdates":
            await updateRole(interaction, compupdatesrole);
            break;
          case "news":
            await updateRole(interaction, newsrole);
            break;
          case "groupbuys":
            await updateRole(interaction, groupbuysrole);
            break;
          case "chatrevive":
            await updateRole(interaction, chatreviverole);
            break;
          case "giveaways":
            await updateRole(interaction, giveawaysrole);
            break;
          case "songoftheday":
            await updateRole(interaction, songofthedayrole);
            break;
          default:
            break;
        }
        break;
      case "WOK WRLD":
        break;
      case "Grailed":
        leaksrole = await interaction.guild.roles.fetch("1078117434898268171");
        ogfilesrole = await interaction.guild.roles.fetch(
          "1078202186703585310"
        );
        snippetsrole = await interaction.guild.roles.fetch(
          "1078202074724040735"
        );
        sessionsrole = await interaction.guild.roles.fetch(
          "1078202260779171881"
        );
        compupdatesrole = await interaction.guild.roles.fetch(
          "1078117450060677300"
        );
        newsrole = await interaction.guild.roles.fetch("1078117433145045072");
        groupbuysrole = await interaction.guild.roles.fetch(
          "1078117436521459722"
        );
        chatreviverole = await interaction.guild.roles.fetch(
          "1078117440464093244"
        );
        giveawaysrole = await interaction.guild.roles.fetch(
          "1078117442468982944"
        );
        stemeditsrole = await interaction.guild.roles.fetch("1080258387339640936")
        sessioneditsrole = await interaction.guild.roles.fetch("1080258549508219043")
        switch (roleName) {
          // WRLD Updates Roles
          case "leaks":
            await updateRole(interaction, leaksrole);
            break;
          case "ogfiles":
            await updateRole(interaction, ogfilesrole);
            break;
          case "snippets":
            await updateRole(interaction, snippetsrole);
            break;
          case "sessions":
            await updateRole(interaction, sessionsrole);
            break;
          case "compupdates":
            await updateRole(interaction, compupdatesrole);
            break;
          case "news":
            await updateRole(interaction, newsrole);
            break;
          case "groupbuys":
            await updateRole(interaction, groupbuysrole);
            break;
          case "chatrevive":
            await updateRole(interaction, chatreviverole);
            break;
            case "stemedits":
            await updateRole(interaction, stemeditsrole);
            break;
            case "sessionedits":
            await updateRole(interaction, sessioneditsrole);
            break;
          case "giveaways":
            await updateRole(interaction, giveawaysrole);
            break;
          default:
            break;
        }
        break;
      
        default:
        await interaction.editReply({
          content: `error happened here\n the server name is ${currentServer}\nthe role is ${role}\nthe role name is ${roleName}\nsend Steve Jobs the error report`,
        });

        break;
    }
  });
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
    let doc;


    // BUTTONS
    if (interaction.isButton()) {
      console.log(`Button Clicked`);

      if (customID.includes("copyright_content")) {
        
        // client.emit("GroupBuyButton", interaction);
      } 
    }

  });
}
