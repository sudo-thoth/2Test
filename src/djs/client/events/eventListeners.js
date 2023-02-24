const client = require(`../../index.js`);
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require(`../../functions/scripts/scripts_djs.js`);
const scripts_mongoDB = require(`../../functions/scripts/scripts_mongoDB.js`);
const createEmb = require(`../../functions/create/createEmbed.js`);
const createBtn = require(`../../functions/create/createButton.js`);
const createActRow = require(`../../functions/create/createActionRow.js`);
const gb = require(`../../commands/Juice/gb.js`);
const drflgif =
  "https://media.discordapp.net/attachments/981241396608532534/1078161086794174464/ezgif.com-gif-maker_4.gif";
const gbgrgif =
  "https://media.discordapp.net/attachments/981241396608532534/1078159688983654441/ezgif.com-optimize.gif";

const jw3gif = () => {
  let gifs = [
    "https://media.discordapp.net/attachments/981241396608532534/1078163296412246016/ezgif.com-optimize_2.gif",
    "https://media.discordapp.net/attachments/1070594771699118191/1078236873299861565/ezgif.com-optimize_3.gif",
  ];
  return gifs[Math.floor(Math.random() * gifs.length)];
};

const jtkgif =
  "https://media.discordapp.net/attachments/981241396608532534/1078161981086892153/ezgif.com-optimize_1.gif";
// const index = require(`src/djs/index.js`)
// const client = index.getClient();
// console.log(client);

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
      songofthedayrole;
    switch (currentServer) {
      case "WRLD Updates":
        leaksrole = await interaction.guild.roles.fetch("1077656315331084338");
        ogfilesrole = await interaction.guild.roles.fetch(
          "1077656318845919242"
        );
        snippetsrole = await interaction.guild.roles.fetch(
          "1077656316396445847"
        );
        sessionsrole = await interaction.guild.roles.fetch(
          "1077656317344366614"
        );
        compupdatesrole = await interaction.guild.roles.fetch(
          "1077785531645186088"
        );
        newsrole = await interaction.guild.roles.fetch("1077656323379961996");
        groupbuysrole = await interaction.guild.roles.fetch(
          "1077656322226536558"
        );
        chatreviverole = await interaction.guild.roles.fetch(
          "1077656319642828802"
        );
        giveawaysrole = await interaction.guild.roles.fetch(
          "1077656320980828220"
        );
        songofthedayrole = await interaction.guild.roles.fetch(
          "1077656324726341662"
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
      case "999 News":
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
          default:
            break;
        }
        break;
      default:
        await interaction.editReply({
          content: `error happened here\n the server name is ${currentServer}\nthe role is ${role}\nthe role name is ${roleName}`,
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
    let doc, targetChannel, targetChannelID;
    if (!interaction.isChatInputCommand()) {
      if (
        !customID.includes("post_") &&
        !customID.includes("view_attachment_") &&
        !customID.includes("direct_message_") &&
        !customID.includes("groupbuy_")
      ) {
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

      if (customID.includes("groupbuy_")) {
        console.log(`Group Buy Button Clicked`);
        client.emit("GroupBuyButton", interaction);
      } else if (customID.includes("role_")) {
        console.log(`a role selection Button Clicked`);
        await interaction.deferReply({ ephemeral: true });
        client.emit("role", interaction, customID);
        console.log(`after role emit`);
      } else if (customID.includes("gb_")) {
        if (customID.includes("gb_edit")) {
          let randID = scripts_djs.extractID(customID);
          await gb.gbedit(interaction, randID);
        } else if (customID.includes("gb_update")) {
          let randID = scripts_djs.extractID(customID);
          if (customID.includes("add")) {
            await gb.gbadd(interaction, randID);
          } else if (customID.includes("minus")) {
            await gb.gbsub(interaction, randID);
          } else if (customID.includes("embed")) {
            await gb.gbembed(interaction, randID);
          } else if (customID.includes("gb_update_delete_confirm")) {
            let randID = scripts_djs.extractID(customID);
            await gb.gbconfirmdelete(interaction, randID);
          } else if (customID.includes("gb_update_delete_cancel")) {
            await gb.gbcanceldelete(interaction);
          } else {
            await gb.gbupdate(interaction, randID);
          }
        } else if (customID.includes("gb_delete")) {
          let randID = scripts_djs.extractID(customID);
          await gb.gbdelete(interaction, randID);
        } else if (customID.includes("gb_end")) {
          let randID = scripts_djs.extractID(customID);
          await gb.gbend(interaction, randID);
        } else if (customID.includes("gb_completedgb")) {
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
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `This button has been redacted`,
              description: `please use the command \`/groupbuy\` to access the group buy hub`,
              color: scripts.getErrorColor(),
            }),
          ],
        });
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
        await fileProcessing(interaction);
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
        await fileProcessing(interaction);
        if (isFile === true) {
          try {
            user.send({ content: title, files: [attachmentURL] });
          } catch (error) {
            try {
              await user.send({
                embeds: [
                  createEmb.createEmbed({
                    title:
                      "There was an Error , Share the Error w the Developer",
                    description:
                      `__While :__ \`Dm'ing File\`\n` +
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
                        title:
                          "There was an Error , Share the Error w the Developer",
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
                      title:
                        "There was an Error, Share the Error w the Developer",
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
          try {
            user.send({ content: attachmentURL });
          } catch (error) {
            try {
              await user.send({
                embeds: [
                  createEmb.createEmbed({
                    title:
                      "There was an Error , Share the Error w the Developer",
                    description:
                      `__While :__ \`Dm'ing File\`\n` +
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
                        title:
                          "There was an Error , Share the Error w the Developer",
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
                      title:
                        "There was an Error, Share the Error w the Developer",
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

        // determine what boost tier the server is to determine how big the file can be sent

        let level = interaction.guild.premiumTier;
        let limit = 8;
        // if (level === "TIER_1" || level === 1) {
        //   limit = 8;
        // } else if (level === "TIER_2" || level === 2) {
        //   limit = 50;
        // } else if (level === "TIER_3" || level === 3) {
        //   limit = 100;
        // }

        scripts.cLog(`the limit is ${limit} MB`);
        randID = scripts_djs.extractID(customID);
        let data = await scripts_mongoDB.getPostData(randID);
        data = data._doc;
        let file = data.file;
        let nameOfFile = file.attachment.split("/").pop();
        let embedObj = data.embed;
        let era, producedby, dateleaked, alternatenames, otherinfo;
        // await interaction.channel.send({content:`\`\`\`js
        // \n${embedObj}\n\`\`\``})
        let title, description, color, fields, thumbnail;

        if (embedObj) {
          title = embedObj.title;
          description = embedObj.description;
          color = embedObj.color;
          fields = embedObj.fields;
          thumbnail = embedObj.thumbnail;
          // for every field get the value and key
          for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            let { name, value } = field;
            if (name.toLowerCase() === "era") {
              era = value;
            } else if (name.toLowerCase() === "alternate name(s)") {
              alternatenames = value;
            } else if (name.toLowerCase() === "date leaked") {
              dateleaked = value;
            } else if (name.toLowerCase() === "produced by") {
              producedby = value;
            }
          }
          if (description) {
            if (description.includes("Cover Art:")) {
              title = title.replace("Cover Art: ", "");
            } else if (description.includes("Snippet: ")) {
              title = title.replace("Snippet: ", "");
            } else {
              otherinfo = embedObj.description ? embedObj.description : "";
            }
          }
        }
        let fileInfoString = `${era ? `**Era:** ${era}\n` : ""}${
          producedby ? `**Produced By:** ${producedby}\n` : ""
        }${dateleaked ? `**Date Leaked:** ${dateleaked}\n` : ""}${
          alternatenames ? `**Alternate Name(s):** ${alternatenames}\n` : ""
        }${otherinfo ? `**Other Info:** ${otherinfo}\n` : ""}`;
        let fileTechnicalInfoString = `${`**File Name:** \`${nameOfFile}\``}${
          file.contentType ? `**Content Type:** ${file.contentType}\n` : ""
        }${
          (file.size ? (file.size
            ? `**File Size:** ${(file.size / 1048576).toFixed(2)} Mb\n`
            : "") === "NaN Mb\n" ? '' : (file.size
              ? `**File Size:** ${(file.size / 1048576).toFixed(2)} Mb\n`
              : "") : '')
        }`;
        let { name, url, attachment } = file;
        let size;
        console.log(`the attachment`, attachment);
        console.log(`the attachment size`, attachment.size);
        console.log(`the file attachment`, file.attachment);
        console.log(`the file attachment size`, file.size);
        if (file.name) {
          name = file.name;
        } else {
          name = await scripts_djs.krakenTitleFinder(url, interaction);
        }
        if (file.size) {
          size = file.size;
        } else {
          size = await scripts_djs.krakenFileSizeFinder(url, interaction);
          let isGB;
          file.size = size;
          data.file = file;
          await scripts_mongoDB.updatePostData(randID, data);
          if (typeof size === "string") {
            isGB = size.includes("GB");
          }
          size = parseFloat(size);

          if (isGB) {
            size *= 1024;
          }
          // attachment = url;
        }
        let user = interaction.user;
        // direct message the user the file
        // convert size from bytes to mb
        let sizeMB = size / 1000000;
        let isFile = sizeMB > limit ? false : true;
        if (size === 0) {
          isFile = false;
        }
        if (typeof attachment === "string") {
          if (attachment.includes("https://krakenfiles.com/view/")) {
            isFile = false;
          }
        }
        console.log(`the file`, file); // the file {name: 'This should work', attachment: 'https://s9download.krakenfiles.com/force-do…Rg6SPL1IHN94GKCqVcjN3ZEFDv7egua/qVDaXdn7lX', url: 'https://krakenfiles.com/view/qVDaXdn7lX/file.html', size: '53.27 MB'}
        console.log(
          `the type:`,
          await scripts_djs.krakenFileTypeFinder(file.url, interaction)
        );
        let newFile, attach;
        if (file) {
          if (file.url) {
            attach = {
              url:
                (await scripts_djs.krakenFileTypeFinder(
                  file.url,
                  interaction
                )) === "zip"
                  ? `${file.attachment}.zip`
                  : file.attachment,
              // filename: name,
              //description: `File was scraped from Kraken Files by Steve Jobs`
            };
            newFile = scripts_djs.createAttachment(attach);
          }
        }
        file = file.url ? newFile : file;
        console.log(`the file`, file); // the file AttachmentBuilder {attachment: 'https://s9download.krakenfiles.com/force-do…Rg6SPL1IHN94GKCqVcjN3ZEFDv7egua/qVDaXdn7lX', name: undefined, description: undefined}

        await fileProcessing(interaction);
        if (isFile === true) {
          try {
            user.send({
              embeds:
                nameOfFile === `music.m4a`
                  ? [
                      createEmb.createEmbed({
                        title: `${
                          (title ? title : `${name ? name : nameOfFile}`) ===
                          nameOfFile
                            ? ``
                            : `${title ? title : `${name ? name : nameOfFile}`}`
                        }`,
                        description:
                          fileInfoString || fileTechnicalInfoString
                            ? `**__File Information:__**\n\n${
                                fileInfoString ? `${fileInfoString}` : ``
                              }${
                                fileTechnicalInfoString
                                  ? `${fileTechnicalInfoString}`
                                  : ``
                              }`
                            : "",
                        url: file.url ? file.url : null,
                        color: scripts.getColor(),
                        thumbnail: thumbnail ? thumbnail : null,
                        footer: {
                          text: `${
                            file.url
                              ? `this file was scraped from Kraken Files by Steve Jobs`
                              : `Wok Bot provided by Steve Jobs`
                          }`,
                          iconURL: `https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2018/09/1200/675/youngstevo.jpg?ve=1&tl=1`,
                        },
                      }),
                      createEmb.createEmbed({
                        title: `:warning: caution`,
                        description: `\`\`\`js\nVulnerability Status : true\n\`\`\`\nThis File Was Pulled From The Kraken Link Provided Causing Manipulation\n\n\n:warning:  **Possible Manipulation:**\n\n🤒 \`File Name Manipulation :\` \`file name changed to\` \`music\`\n🤢 \`File Type Manipulation :\` \`file type changed to\` \`.m4a\`\n🤮 \`File Degradation :\` \`quality reduced to\` \`64 kb/s\`\n\n\n👀 **What You Can Do:**\n> *IF you just want to* __**LISTEN**__ : This file is more than sufficient to have a quick listen
                   \n
                  > *IF you would like to* ** __Retain the Highest Quality__** : I recommend viewing the link on Kraken and Downloading/Listening from there`,
                        url: embedObj ? embedObj.url : null,
                        color: "Yellow",
                        footer: {
                          text: `this file was scraped from Kraken Files by Steve Jobs`,
                          iconURL: `https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2018/09/1200/675/youngstevo.jpg?ve=1&tl=1`,
                        },
                      }),
                    ]
                  : [
                      createEmb.createEmbed({
                        title: `${
                          (title ? title : `${name ? name : nameOfFile}`) ===
                          nameOfFile
                            ? ``
                            : `${title ? title : `${name ? name : nameOfFile}`}`
                        }`,
                        description:
                          fileInfoString || fileTechnicalInfoString
                            ? `**__File Information:__**\n\n${
                                fileInfoString ? `${fileInfoString}` : ``
                              }${
                                fileTechnicalInfoString
                                  ? `${fileTechnicalInfoString}`
                                  : ``
                              }`
                            : "",
                        url: file.url ? file.url : null,
                        color: scripts.getColor(),
                        thumbnail: thumbnail ? thumbnail : null,
                        footer: {
                          text: `${
                            file.url
                              ? `this file was scraped from Kraken Files by Steve Jobs`
                              : `Wok Bot provided by Steve Jobs`
                          }`,
                          iconURL: `https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2018/09/1200/675/youngstevo.jpg?ve=1&tl=1`,
                        },
                      }),
                    ],
              files: [file],
            });
          } catch (error) {
            try {
              await user.send({
                embeds: [
                  createEmb.createEmbed({
                    title:
                      "There was an Error , Share the Error w the Developer",
                    description:
                      `__While :__ \`Dm'ing File\`\n` +
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
                        title:
                          "There was an Error , Share the Error w the Developer",
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
                      title:
                        "There was an Error, Share the Error w the Developer",
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
          try {
            user.send({
              content: `__**Visit :**__ ${attachment}`,
              embeds: [
                createEmb.createEmbed({
                  title: name,
                  description: `the file is too big to be sent as an attachment, visit the link with your web browser to download the file`,
                }),
              ],
            });
          } catch (error) {
            try {
              await user.send({
                embeds: [
                  createEmb.createEmbed({
                    title:
                      "There was an Error , Share the Error w the Developer",
                    description:
                      `__While :__ \`Dm'ing File\`\n` +
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
                        title:
                          "There was an Error , Share the Error w the Developer",
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
                      title:
                        "There was an Error, Share the Error w the Developer",
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
        // await interaction.channel.send({content:`\`\`\`js
        // \n${data}\n\`\`\``})
        // determine what boost tier the server is to determine how big the file can be sent

        let level = interaction.guild.premiumTier;
        let limit = 8;
        if (level === "TIER_1" || level === 1) {
          limit = 8;
        } else if (level === "TIER_2" || level === 2) {
          limit = 50;
        } else if (level === "TIER_3" || level === 3) {
          limit = 100;
        }
        let file = data.file;
        let nameOfFile = file.attachment.split("/").pop();
        let embedObj = data.embed;
        let era, producedby, dateleaked, alternatenames, otherinfo;
        // await interaction.channel.send({content:`\`\`\`js
        // \n${embedObj}\n\`\`\``})
        let title, description, color, fields, thumbnail;

        if (embedObj) {
          title = embedObj.title;
          description = embedObj.description;
          color = embedObj.color;
          fields = embedObj.fields;
          thumbnail = embedObj.thumbnail;
          // for every field get the value and key
          for (let i = 0; i < fields.length; i++) {
            let field = fields[i];
            console.log(`the field # ${i}`, field);

            let { name, value } = field;

            if (name.toLowerCase() === "era") {
              era = value;
            } else if (name.toLowerCase() === "alternate name(s)") {
              alternatenames = value;
            } else if (name.toLowerCase() === "date leaked") {
              dateleaked = value;
            } else if (name.toLowerCase() === "produced by") {
              producedby = value;
            }
          }
          if (description) {
            if (description.includes("Cover Art:")) {
              title = title.replace("Cover Art: ", "");
            } else if (description.includes("Snippet: ")) {
              title = title.replace("Snippet: ", "");
            } else {
              otherinfo = embedObj.description ? embedObj.description : "";
            }
          }
        }

        // interaction.channel.send({content:`the era : ${era}\nproducedby : ${producedby}\ndateleaked : ${dateleaked}\nalternatenames : ${alternatenames}\notherinfo : ${otherinfo}`})
        // console.log(`the embed obj`, embedObj)
        let fileInfoString = `${era ? `**Era:** ${era}\n` : ""}${
          producedby ? `**Produced By:** ${producedby}\n` : ""
        }${dateleaked ? `**Date Leaked:** ${dateleaked}\n` : ""}${
          alternatenames ? `**Alternate Name(s):** ${alternatenames}\n` : ""
        }${otherinfo ? `**Other Info:** ${otherinfo}\n` : ""}`;
        let fileTechnicalInfoString = `${`**File Name:** \`${nameOfFile}\`\n`}${
          file.contentType ? `**Content Type:** ${file.contentType}\n` : ""
        }${
          (file.size ? (file.size
            ? `**File Size:** ${(file.size / 1048576).toFixed(2)} Mb\n`
            : "") === "NaN Mb\n" ? '' : (file.size
              ? `**File Size:** ${(file.size / 1048576).toFixed(2)} Mb\n`
              : "") : '')
        }`;

        scripts.cLog(`the limit is ${limit} MB`);

        let { url, attachment } = file;
        let size, name;
        if (file.name) {
          name = file.name;
        } else {
          name = await scripts_djs.krakenTitleFinder(url, interaction);
        }
        if (file.size) {
          size = file.size;
        } else {
          size = await scripts_djs.krakenFileSizeFinder(url, interaction);
          let isGB;
          if (typeof size === "string") {
            isGB = size.includes("GB");
          }
          size = parseFloat(size);

          if (isGB) {
            size *= 1024;
          }
          url = attachment;
        }

        let user = interaction.user;
        // direct message the user the file

        // convert size from bytes to mb
        let sizeMB = size / 1000000;
        let isFile = sizeMB > limit ? false : true;
        if (size === 0) {
          isFile = false;
        }

        if (typeof attachment === "string") {
          if (attachment.includes("https://krakenfiles.com/view/")) {
            isFile = false;
          }
        }
        console.log(`the file`, file);
        let newFile, attach;
        if (file) {
          if (file.url) {
            attach = {
              url:
                (await scripts_djs.krakenFileTypeFinder(
                  file.url,
                  interaction
                )) === "zip"
                  ? `${file.attachment}.zip`
                  : file.attachment,
              // filename: name,
              //description: `File was scraped from Kraken Files by Steve Jobs`
            };
            newFile = scripts_djs.createAttachment(attach);
          }
        }
        file = file.url ? newFile : file;

        await fileProcessing(interaction);
        if (isFile === true) {
          try {
            await interaction.editReply({
              files: [file],
              embeds:
                nameOfFile === `music.m4a`
                  ? [
                      createEmb.createEmbed({
                        title: `${
                          (title ? title : `${name ? name : nameOfFile}`) ===
                          nameOfFile
                            ? ``
                            : `${title ? title : `${name ? name : nameOfFile}`}`
                        }`,
                        description:
                          fileInfoString || fileTechnicalInfoString
                            ? `**__File Information:__**\n\n${
                                fileInfoString ? `${fileInfoString}` : ``
                              }${
                                fileTechnicalInfoString
                                  ? `${fileTechnicalInfoString}`
                                  : ``
                              }`
                            : "",
                        url: file.url ? file.url : null,
                        color: scripts.getColor(),
                        thumbnail: thumbnail ? thumbnail : null,
                        footer: {
                          text: `${
                            file.url
                              ? `this file was scraped from Kraken Files by Steve Jobs`
                              : `Wok Bot provided by Steve Jobs`
                          }`,
                          iconURL: `https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2018/09/1200/675/youngstevo.jpg?ve=1&tl=1`,
                        },
                      }),
                      createEmb.createEmbed({
                        title: `:warning: caution`,
                        description: `\`\`\`js\nVulnerability Status : true\n\`\`\`\nThis File Was Pulled From The Kraken Link Provided Causing Manipulation\n\n\n:warning:  **Possible Manipulation:**\n\n🤒 \`File Name Manipulation :\` \`file name changed to\` \`music\`\n🤢 \`File Type Manipulation :\` \`file type changed to\` \`.m4a\`\n🤮 \`File Degradation :\` \`quality reduced to\` \`64 kb/s\`\n\n\n👀 **What You Can Do:**\n> *IF you just want to* __**LISTEN**__ : This file is more than sufficient to have a quick listen
                     \n
                    > *IF you would like to* ** __Retain the Highest Quality__** : I recommend viewing the link on Kraken and Downloading/Listening from there`,
                        url: embedObj ? embedObj.url : null,
                        color: "Yellow",
                        footer: {
                          text: `this file was scraped from Kraken Files by Steve Jobs`,
                          iconURL: `https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2018/09/1200/675/youngstevo.jpg?ve=1&tl=1`,
                        },
                      }),
                    ]
                  : [
                      createEmb.createEmbed({
                        title: `${
                          (title ? title : `${name ? name : nameOfFile}`) ===
                          nameOfFile
                            ? ``
                            : `${title ? title : `${name ? name : nameOfFile}`}`
                        }`,
                        description:
                          fileInfoString || fileTechnicalInfoString
                            ? `**__File Information:__**\n\n${
                                fileInfoString ? `${fileInfoString}` : ``
                              }${
                                fileTechnicalInfoString
                                  ? `${fileTechnicalInfoString}`
                                  : ``
                              }`
                            : "",
                        url: file.url ? file.url : null,
                        color: scripts.getColor(),
                        thumbnail: thumbnail ? thumbnail : null,
                        footer: {
                          text: `${
                            file.url
                              ? `this file was scraped from Kraken Files by Steve Jobs`
                              : `Wok Bot provided by Steve Jobs`
                          }`,
                          iconURL: `https://a57.foxnews.com/static.foxnews.com/foxnews.com/content/uploads/2018/09/1200/675/youngstevo.jpg?ve=1&tl=1`,
                        },
                      }),
                    ],
              content: "",
              components: [],
            });
          } catch (error) {
            console.log(
              `An Error occured when trying to reply to a Show File Button Request`,
              error
            );
            await throwNewError("sending file attachment", interaction, error);
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
            await throwNewError("sending file attachment", interaction, error);
          }
        }
      }
    }
    // MODALS
    if (interaction.isModalSubmit()) {
      console.log(`Modal Submitted`);
      // defer the interaction
      console.log(`interaction reply 8`);
      try {
        await interaction.deferReply({
          ephemeral: true,
        });
      } catch (error) {
        try {
          await interaction.reply({
            embeds: [
              createEmb.createEmbed({
                title: "Error",
                description:
                  `An Error occurred when trying to reply to a Modal Button Request\n**Please Contact Steve Jobs and allow him to look into the error below**\n*Do Not Forget To Tell Him What Your Actions That Were Taken Were*\n__Error Explained:__` +
                  "```js" +
                  `\n${error}\n` +
                  "```",
                color: scripts.getErrorColor(),
              }),
            ],
          });
        } catch (errr) {
          console.log(
            `The Original Error has something to do w the interaction`,
            error
          );
        }
      }

      let modalInput = null;
      let embed = null;
      if (customID.includes("groupbuy_")) {
        console.log(`Group Buy Modal Submitted`);
        console.log(`the interaction`, interaction);
        client.emit("GroupBuyModal", interaction, customID);
        console.log(`emitted modal submittion`);
      } else if (customID.includes("gb-post")) {
        // extract the name, price, and current amount raised from the modal
        const songName = interaction.fields.getTextInputValue("gb_p_name")
          ? interaction.fields.getTextInputValue("gb_p_name")
          : "";
        let price = interaction.fields.getTextInputValue("gb_p_price")
          ? interaction.fields.getTextInputValue("gb_p_price")
          : "";
        let current = interaction.fields.getTextInputValue("gb_p_current")
          ? interaction.fields.getTextInputValue("gb_p_current")
          : "0";
        // if price or current has no numbers and all alphabetical characters edit the reply telling the user if they put in an input, it must be a number in the price & current field, then return
        let priceNumber = price ? price.replace(/[^0-9]/g, "") : "0";
        const matches = price
          ? price.match(/\$?(\d+\.\d{2})|(\d+\.\d)|(\d+)/g)
          : ["0"];
        const transformedMatches = matches.map((match) => match);
        price = transformedMatches[0] ? transformedMatches[0] : price;

        let currentNumber = current ? current.replace(/[^0-9]/g, "") : "0";
        const currentMatches = current
          ? current.match(/\$?(\d+\.\d{2})|(\d+\.\d)|(\d+)/g)
          : ["0"];
        const transformedCurrentMatches = currentMatches.map((match) => match);
        current = transformedCurrentMatches[0]
          ? transformedCurrentMatches[0]
          : current;
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
        };
        await gb.runGB(obj, interaction);
      } else if (customID.includes("gb-add")) {
        // extract the num from the modal
        const num = interaction.fields.getTextInputValue("gb_add")
          ? interaction.fields.getTextInputValue("gb_add")
          : "";
        let randID = scripts_djs.extractID(customID);

        await gb.gbaddtototal(num, randID, interaction);
      } else if (customID.includes("gb-minus")) {
        // extract the num from the modal
        const num = interaction.fields.getTextInputValue("gb_sub")
          ? interaction.fields.getTextInputValue("gb_sub")
          : "";
        let randID = scripts_djs.extractID(customID);

        await gb.gbsubfromtotal(num, randID, interaction);
      } else if (customID.includes("gb-reset")) {
        let name = interaction.fields.getTextInputValue("gb_update_name")
          ? interaction.fields.getTextInputValue("gb_update_name")
          : "";
        let price = interaction.fields.getTextInputValue("gb_update_price")
          ? interaction.fields.getTextInputValue("gb_update_price")
          : "";
        let current = interaction.fields.getTextInputValue("gb_update_current")
          ? interaction.fields.getTextInputValue("gb_update_current")
          : "";
        let priceNumber = price ? price.replace(/[^0-9]/g, "") : "";
        const matches = price
          ? price.match(/\$?(\d+\.\d{2})|(\d+\.\d)|(\d+)/g)
          : "";
        const transformedMatches = matches ? matches.map((match) => match) : "";
        price = transformedMatches[0] ? transformedMatches[0] : price;

        let currentNumber = current ? current.replace(/[^0-9]/g, "") : "";
        const currentMatches = current
          ? current.match(/\$?(\d+\.\d{2})|(\d+\.\d)|(\d+)/g)
          : "";
        const transformedCurrentMatches = currentMatches
          ? currentMatches.map((match) => match)
          : "";
        current = transformedCurrentMatches[0]
          ? transformedCurrentMatches[0]
          : current;
        let randID = scripts_djs.extractID(customID);
        let obj = {
          randID: randID,
          name: name,
          price: price,
          priceNumber: priceNumber,
          amountPaid: current,
          amountPaidNumber: currentNumber,
        };
        await gb.gbreset(obj, interaction);
      } else if (customID.includes("gb-canceledgb_modal2")) {
        let reason = interaction.fields.getTextInputValue("why")
          ? interaction.fields.getTextInputValue("why")
          : "";

        let randID = scripts_djs.extractID(customID);

        let obj = {
          randID: randID,
          reason: reason,
        };

        await gb.gbcanceledgb(interaction, obj);
      } else if (customID.includes("gb-ppgb_modal")) {
        let reason = interaction.fields.getTextInputValue("why")
          ? interaction.fields.getTextInputValue("why")
          : "";

        let randID = scripts_djs.extractID(customID);

        let obj = {
          randID: randID,
          reason: reason,
        };

        await gb.gbpostponedgb(interaction, obj);
      } else if (customID.includes("gb-sub-modal")) {
        const num = interaction.fields.getTextInputValue("gb_sub")
          ? interaction.fields.getTextInputValue("gb_sub")
          : "";
        let randID = scripts_djs.extractID(customID);

        await gb.gbsubfromtotal(num, randID, interaction);
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
                title: `Sent [ Image: ${title ? title : "unnamed"} ]`,
              }),
            ],
          });
        } catch (error) {
          console.log(`Image Post error`, error);
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sorry But There was an Error Posting [ Image: ${
                  title ? title : "unnamed"
                } ]`,
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
          description: `${
            text !== null
              ? `${text}`
              : `${!title ? `Sent from ${interaction.user.username}` : ` `}`
          }`,

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
                title: `Sent [ Snippet: ${title ? title : "unnamed"} ]`,
              }),
            ],
          });
        } catch (error) {
          console.log(`Video Snippet Post error`, error);
          interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `Sorry But There was an Error Posting [ Snippet: ${
                  title ? title : "unnamed"
                } ]`,
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
          file_type,
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
          // add gif to embed thumbnail based on the era inputted

          if (
            era.toLowerCase() === "drfl" ||
            era.toLowerCase() === "death race for love" ||
            era.toLowerCase() === "death race"
          ) {
            embedObj.thumbnail = drflgif;
          } else if (
            era.toLowerCase() === "gbgr" ||
            era.toLowerCase() === "goodbye and good riddance" ||
            era.toLowerCase() === "goodbye & good riddance"
          ) {
            embedObj.thumbnail = gbgrgif;
          } else if (
            era.toLowerCase() === "jw3" ||
            era.toLowerCase() === "tpne" ||
            era.toLowerCase() === "outsider" ||
            era.toLowerCase() === "outsiders" ||
            era.toLowerCase() === "juice wrld 3" ||
            era.toLowerCase() === "juice wrld three" ||
            era.toLowerCase() === "lnd" ||
            era.toLowerCase() === "the party never ends" ||
            era.toLowerCase() === "legends never die" ||
            era.toLowerCase() === "fd" ||
            era.toLowerCase() === "fighting demons" ||
            era.toLowerCase() === "post-homous" ||
            era.toLowerCase() === "posthumous"
          ) {
            embedObj.thumbnail = jw3gif();
          } else if (
            era.toLowerCase() === "jtk" ||
            era.toLowerCase() === "juice the kidd"
          ) {
            embedObj.thumbnail = jtkgif;
          } else {
            embedObj.thumbnail = interaction.guild.iconURL();
          }
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }

        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow;
        let actionRow2;
        console.log(`choice: ${choice} typeOfFile: ${typeOfFile}`)
        
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          console.log(`the action row is`, actionRow);

          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          console.log(`the action row 2 is`, actionRow2);

          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Leak Kraken (with attachment) : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });
          console.log(`the action row is`, actionRow);
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Leak Kraken (with attachment) : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Leak Kraken (with attachment) : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          console.log(`the action row is`, actionRow);

          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          console.log(`the action row 2 is`, actionRow2);

          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Leak Kraken (with attachment) : ${songName} ]`,
              interaction,
              error
            );
          }
        }
      } else if (customID.includes(`post_ogfile_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        console.log(`the data`, data);

        data = data._doc;
        console.log(`the data`, data);
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
          file_type,
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
          // add gif to embed thumbnail based on the era inputted

          if (
            era.toLowerCase() === "drfl" ||
            era.toLowerCase() === "death race for love" ||
            era.toLowerCase() === "death race"
          ) {
            embedObj.thumbnail = drflgif;
          } else if (
            era.toLowerCase() === "gbgr" ||
            era.toLowerCase() === "goodbye and good riddance" ||
            era.toLowerCase() === "goodbye & good riddance"
          ) {
            embedObj.thumbnail = gbgrgif;
          } else if (
            era.toLowerCase() === "jw3" ||
            era.toLowerCase() === "tpne" ||
            era.toLowerCase() === "outsider" ||
            era.toLowerCase() === "outsiders" ||
            era.toLowerCase() === "juice wrld 3" ||
            era.toLowerCase() === "juice wrld three" ||
            era.toLowerCase() === "lnd" ||
            era.toLowerCase() === "the party never ends" ||
            era.toLowerCase() === "legends never die" ||
            era.toLowerCase() === "fd" ||
            era.toLowerCase() === "fighting demons" ||
            era.toLowerCase() === "post-homous" ||
            era.toLowerCase() === "posthumous"
          ) {
            embedObj.thumbnail = jw3gif();
          } else if (
            era.toLowerCase() === "jtk" ||
            era.toLowerCase() === "juice the kidd"
          ) {
            embedObj.thumbnail = jtkgif;
          } else {
            embedObj.thumbnail = interaction.guild.iconURL();
          }
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ OG File : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });

          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ OG File : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ OG File : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actoinRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ OG File : ${songName} ]`,
              interaction,
              error
            );
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
          file_type,
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
            name: `New Studio Files`,
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
          // add gif to embed thumbnail based on the era inputted

          if (
            era.toLowerCase() === "drfl" ||
            era.toLowerCase() === "death race for love" ||
            era.toLowerCase() === "death race"
          ) {
            embedObj.thumbnail = drflgif;
          } else if (
            era.toLowerCase() === "gbgr" ||
            era.toLowerCase() === "goodbye and good riddance" ||
            era.toLowerCase() === "goodbye & good riddance"
          ) {
            embedObj.thumbnail = gbgrgif;
          } else if (
            era.toLowerCase() === "jw3" ||
            era.toLowerCase() === "tpne" ||
            era.toLowerCase() === "outsider" ||
            era.toLowerCase() === "outsiders" ||
            era.toLowerCase() === "juice wrld 3" ||
            era.toLowerCase() === "juice wrld three" ||
            era.toLowerCase() === "lnd" ||
            era.toLowerCase() === "the party never ends" ||
            era.toLowerCase() === "legends never die" ||
            era.toLowerCase() === "fd" ||
            era.toLowerCase() === "fighting demons" ||
            era.toLowerCase() === "post-homous" ||
            era.toLowerCase() === "posthumous"
          ) {
            embedObj.thumbnail = jw3gif();
          } else if (
            era.toLowerCase() === "jtk" ||
            era.toLowerCase() === "juice the kidd"
          ) {
            embedObj.thumbnail = jtkgif;
          } else {
            embedObj.thumbnail = interaction.guild.iconURL();
          }
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Studio Session : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });

          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Studio Session : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Studio Session : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Studio Session : ${songName} ]`,
              interaction,
              error
            );
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
          file_type,
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
            name: `New Instrumental`,
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Instrumental : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Instrumental : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Instrumental : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Instrumental : ${songName} ]`,
              interaction,
              error
            );
          }
        }
      } else if (customID.includes(`post_accapella_modal`)) {
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
          file_type,
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
        const role = roleString(roles);
        let embedObj = {
          title: `${songName}`,
          description: text ? text : null,
          color: scripts.getColor(),
          author: {
            name: `New Accapella`,
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

        // const user = await client.users.fetch(userId);
        // const interaction = await client.rest.interactions(interactionID).get();

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Accapella : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });

          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Accapella : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Accapella : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Accapella : ${songName} ]`,
              interaction,
              error
            );
          }
        }
      } else if (customID.includes(`post_mixedsession_modal`)) {
        let data = await scripts_mongoDB.getPostData(randID);
        console.log(`the data is right here data`, data);
        let {
          //  userId,
          roles,
          //  type,
          //  format,
          file,
          //  interactionID,
          //  file_type,
          choice,
          file_type,
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
          // add gif to embed thumbnail based on the era inputted

          if (
            era.toLowerCase() === "drfl" ||
            era.toLowerCase() === "death race for love" ||
            era.toLowerCase() === "death race"
          ) {
            embedObj.thumbnail = drflgif;
          } else if (
            era.toLowerCase() === "gbgr" ||
            era.toLowerCase() === "goodbye and good riddance" ||
            era.toLowerCase() === "goodbye & good riddance"
          ) {
            embedObj.thumbnail = gbgrgif;
          } else if (
            era.toLowerCase() === "jw3" ||
            era.toLowerCase() === "tpne" ||
            era.toLowerCase() === "outsider" ||
            era.toLowerCase() === "outsiders" ||
            era.toLowerCase() === "juice wrld 3" ||
            era.toLowerCase() === "juice wrld three" ||
            era.toLowerCase() === "lnd" ||
            era.toLowerCase() === "the party never ends" ||
            era.toLowerCase() === "legends never die" ||
            era.toLowerCase() === "fd" ||
            era.toLowerCase() === "fighting demons" ||
            era.toLowerCase() === "post-homous" ||
            era.toLowerCase() === "posthumous"
          ) {
            embedObj.thumbnail = jw3gif();
          } else if (
            era.toLowerCase() === "jtk" ||
            era.toLowerCase() === "juice the kidd"
          ) {
            embedObj.thumbnail = jtkgif;
          } else {
            embedObj.thumbnail = interaction.guild.iconURL();
          }
        }
        if (altname !== null) {
          fields.push({
            name: `Alternate Name(s)`,
            value: `${altname}`,
            inline: true,
          });
        }
        if (producer !== null) {
          fields.push({
            name: `Mixed By:`,
            value: `${producer}`,
            inline: true,
          });
        }

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        console.log(`choice: ${choice} typeOfFile: ${typeOfFile}`)

        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Mixed Session Edit : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Mixed Session Edit : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Mixed Session Edit : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Mixed Session Edit : ${songName} ]`,
              interaction,
              error
            );
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
          file_type,
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
          // add gif to embed thumbnail based on the era inputted

          if (
            era.toLowerCase() === "drfl" ||
            era.toLowerCase() === "death race for love" ||
            era.toLowerCase() === "death race"
          ) {
            embedObj.thumbnail = drflgif;
          } else if (
            era.toLowerCase() === "gbgr" ||
            era.toLowerCase() === "goodbye and good riddance" ||
            era.toLowerCase() === "goodbye & good riddance"
          ) {
            embedObj.thumbnail = gbgrgif;
          } else if (
            era.toLowerCase() === "jw3" ||
            era.toLowerCase() === "tpne" ||
            era.toLowerCase() === "outsider" ||
            era.toLowerCase() === "outsiders" ||
            era.toLowerCase() === "juice wrld 3" ||
            era.toLowerCase() === "juice wrld three" ||
            era.toLowerCase() === "lnd" ||
            era.toLowerCase() === "the party never ends" ||
            era.toLowerCase() === "legends never die" ||
            era.toLowerCase() === "fd" ||
            era.toLowerCase() === "fighting demons" ||
            era.toLowerCase() === "post-homous" ||
            era.toLowerCase() === "posthumous"
          ) {
            embedObj.thumbnail = jw3gif();
          } else if (
            era.toLowerCase() === "jtk" ||
            era.toLowerCase() === "juice the kidd"
          ) {
            embedObj.thumbnail = jtkgif;
          } else {
            embedObj.thumbnail = interaction.guild.iconURL();
          }
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
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
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Snippet : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Snippet : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Snippet : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Snippet : ${songName} ]`,
              interaction,
              error
            );
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
          file_type,
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if (choice === "yes" && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Remaster : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });

          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Remaster : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Remaster : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Remaster : ${songName} ]`,
              interaction,
              error
            );
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
          file_type,
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
            name: `New Stem Edit`,
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Stem Edit: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Stem Edit Post error`, error);
            await throwNewError(
              `Posting [ Stem Edit: ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
            });
            interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  title: `Sent [ Stem Edit: ${songName} ]`,
                }),
              ],
            });
          } catch (error) {
            console.log(`Stem Edit Post error`, error);
            await throwNewError(
              `Posting [ Stem Edit: ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Remaster: ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Remaster: ${songName} ]`,
              interaction,
              error
            );
          }
        }
      } else if (customID.includes(`post_magicaledit_modal`)) {
        randID = scripts_djs.extractID(customID);
        let data = await scripts_mongoDB.getPostData(randID);
        file = user = interaction.user;
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
          file_type,
        } = data;
        console.log(`the file is`, file);
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
        const embed = createEmb.createEmbed(embedObj);

        // create a button to download the image
        console.log(`the kraken`, kraken);
        console.log(`the file`, file);
        console.log(
          `the decision`,
          kraken ? (file ? file : null) : file ? file.attachment : null
        );

        const downloadButton = await createBtn.createButton({
          label: `Download`,
          style: `link`,
          link: kraken ? (file ? file : null) : file ? file.attachment : null,
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : ``
                    }${
                      altname !== null ? `\nAlternate Name(s) : ${altname}` : ``
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
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Magical Edit: ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : ``
                    }${
                      altname !== null ? `\nAlternate Name(s) : ${altname}` : ``
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
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Magical Edit: ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Magical Edit: ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            // let str2 =
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      file.name ? `Song Name : ${file.name}` : ``
                    }${
                      altname !== null ? `\nAlternate Name(s) : ${altname}` : ``
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
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Magical Edit: ${songName} ]`,
              interaction,
              error
            );
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
          file_type,
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        if (fields.length > 0) {
          embedObj.fields = fields;
        }
        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],

              // files: [file],
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
            await throwNewError(
              `Posting [ Slowed & Reverb : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Slowed & Reverb : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
          // don't attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              krakenButton ? krakenButton : null,
              directMessageButton,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
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
            await throwNewError(
              `Posting [ Slowed & Reverb : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}` : ""}${
                file.name && file.name !== songName
                  ? `\nFile Name : ${file.name}`
                  : ""
              }${
                altname !== null ? `\nAlternate Name(s) : ${altname}` : ""
              } ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Slowed & Reverb : ${songName} ]`,
              interaction,
              error
            );
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
          file_type,
        } = data;
        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("title")
            ? interaction.fields.getTextInputValue("title")
            : "";
          let krakFile;
          try {
            krakFile = await scripts_djs.krakenWebScraper(
              krakLink,
              randID,
              interaction
            );
          } catch (error) {
            await throwNewError(
              "getting file from kraken link",
              interaction,
              error
            );
          }
          file = {
            name: theName,
            attachment: `${
              krakFile
                ? krakFile
                : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
            }`,
            url: `${krakLink ? krakLink : null}`,
          };
          // update the data obj file if the file is changed
          data.file = file;

          try {
            await scripts_mongoDB.updatePostData(randID, data);
          } catch (error) {
            await throwNewError(
              "updating the kraken file elements to the db",
              interaction,
              error
            );
          }
        }
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

        if (file_type === "kraken-link") {
          let krakLink = interaction.fields.getTextInputValue("kraken")
            ? interaction.fields.getTextInputValue("kraken")
            : null;
          let theName = interaction.fields.getTextInputValue("name")
            ? interaction.fields.getTextInputValue("name")
            : "";
          let krakFile;
          if (krakLink !== null) {
            try {
              krakFile = await scripts_djs.krakenWebScraper(
                krakLink,
                randID,
                interaction
              );
              file = {
                name: theName,
                attachment: `${
                  krakFile
                    ? krakFile
                    : `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`
                }`,
                url: `${krakLink ? krakLink : null}`,
              };
              // update the data obj file if the file is changed
              data.file = file;

              try {
                await scripts_mongoDB.updatePostData(randID, data);
              } catch (error) {
                await throwNewError(
                  "updating the kraken file elements to the db",
                  interaction,
                  error
                );
              }
            } catch (error) {
              await throwNewError(
                "getting file from kraken link",
                interaction,
                error
              );
            }
          }
          embedObj.url = krakLink ? krakLink : krakFile ? krakFile : null;
          typeOfFile = await scripts_djs.krakenFileTypeFinder(
            krakLink,
            interaction
          );
        } else {
          embedObj.url = file.attachment ? file.attachment : null;
        }

        await scripts_mongoDB.updatePostData(randID, { embed: embedObj });
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
          style: "success",
          customID: `direct_message_${randID}`,
          emoji: "📮",
        });
        // create a action row to hold the button
        let actionRow, actionRow2;
        if ((choice === "yes" || choice === null) && typeOfFile !== "zip") {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}\n` : ""}${
                file.name !== "" ? `File Name : ${file.name}\n` : ""
              }${text !== null ? `More Info : ${text}` : ""} ||`}`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Audio File : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (
          (choice === "yes" || choice === null) &&
          typeOfFile === "zip"
        ) {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [
              downloadButton,
              directMessageButton,
              krakenButton ? krakenButton : null,
            ],
          });
          try {
            interaction.channel.send({
              content: `${`|| ${
                role.length > 1
                  ? `${scripts_djs.getAlertEmoji()} ${role}\n`
                  : ""
              }${songName !== null ? `Song Name : ${songName}\n` : ""}${
                file.name !== "" ? `File Name : ${file.name}\n` : ""
              }${text !== null ? `More Info : ${text}` : ""} ||`}`,
              embeds: [embed],
              components: [actionRow],
              // files: [file],
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
            await throwNewError(
              `Posting [ Audio File : ${songName} ]`,
              interaction,
              error
            );
          }
        } else if (choice === "no") {
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
                      songName !== null ? `Song Name : ${songName}` : ""
                    }\n${file.name ? `File Name : ${file.name}` : null} ||`
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
            await throwNewError(
              `Posting [ Audio File : ${songName} ]`,
              interaction,
              error
            );
          }
        } else {
          // attach the file to the message
          actionRow = await createActRow.createActionRow({
            components: [downloadButton, krakenButton ? krakenButton : null],
          });
          actionRow2 = await createActRow.createActionRow({
            components: [directMessageButton, viewAttachmentButton],
          });
          try {
            interaction.channel.send({
              content: `${
                role.length > 1
                  ? `|| ${scripts_djs.getAlertEmoji()} ${role}\n${
                      songName !== null ? `Song Name : ${songName}` : ""
                    }\n${file.name ? `File Name : ${file.name}` : null} ||`
                  : `${file.name ? `|| Song Name : ${file.name} ||` : null}`
              }`,
              embeds: [embed],
              components: [actionRow, actionRow2],
              // files: [file],
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
            await throwNewError(
              `Posting [ Audio File : ${songName} ]`,
              interaction,
              error
            );
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
