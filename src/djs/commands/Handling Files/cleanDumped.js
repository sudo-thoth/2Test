const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const createBtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");
const cleanDumpdb = require("../../../MongoDB/db/schemas/schema_cleanData.js");
const client = require("../../index.js");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clean-dumped")
    .setDescription(
      "Clean alr dumped messages, in a channel or all channels in a category" // Clean already dumped messages, in  a channel or all channels in a category, format as copyright free messages
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });
    } catch (error) {
      scripts.logError(error, `error deferring reply`);
    }
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
    const { options } = interaction;
    const target = options.getChannel("target-channel") || interaction.channel;
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `Request to clean <#${target.id}> Received`,
        }),
      ],
    });
    async function sendContent(interaction) {
      let interactionObj = scripts_djs.getInteractionObj(interaction);
      let { customID, user, channel } = interactionObj;
      if (customID.includes("clean_dump_") && interaction.isButton()) {
        try {
          await interaction.deferReply({ ephemeral: true });
        } catch (error) {
          if (error.message.includes(`Unknown interaction`)) {
            console.log(
              `An unknown Interaction was Logged\nInteraction User ${interaction?.user?.username}`
            ); // <:android:1083158839957921882>
            return;
          } else {
            return console.log(error);
          }
        }
        user = interaction.user
        let randID = scripts_djs.extractID(customID);
        try {
          let data = await cleanDumpdb.findOne({ randID: randID }).exec();
          if (data) {
            let { url, messageID, messageURL, channelID, serverID } = data;
            
            let guild = interaction.client.guilds.cache.get(serverID);
            let channel = guild.channels.cache.get(channelID);
            let message = await channel.messages.fetch(messageID);
            await user
              .send({
                embeds: [
                  createEmb.createEmbed({
                    author: {
                      name: `${user.username}#${user.discriminator}`,
                      iconURL: user.avatarURL(),
                    },
                    title: `Content from ${guild.name}`,
                    description: `\`OG Message:\`\n> ${message.content}\n\n`,
                    embeds: message?.embeds || [],
                    footer: {
                      name: interaction?.client?.user?.username,
                      iconURL: interaction?.client?.user?.avatarURL(),
                    },
                  }),
                ],
                components: message?.components || [],
              })
              .then(async () => {
                await interaction.editReply({
                  embeds: [
                    createEmb.createEmbed({
                      author: {
                        name: `${user.username}#${user.discriminator}`,
                        iconURL: user.avatarURL(),
                      },
                      title: labelT,
                      footer: {
                        name: interaction?.client?.user?.username,
                        iconURL: interaction?.client?.user?.avatarURL(),
                      },
                    }),
                  ],
                });
              });
          } else {
            await interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  author: {
                    name: `${user?.username}#${user?.discriminator}`,
                    iconURL: user.avatarURL(),
                  },
                  title: `There was No Data to send`,
                  footer: {
                    name: interaction?.client?.user?.username,
                    iconURL: interaction?.client?.user?.avatarURL(),
                  },
                }),
              ],
            });
          }
        } catch (error) {
          console.log(error);
          await interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                title: `An Error Occured: ${error.message}`,
                description: `\`\`\`js\n${error}\n\`\`\``,
              }),
            ],
            color: scripts.getErrorColor(),
          });
        }
      } else {
        return;
      }
    }

    client.on("interactionCreate", async (i) => {
      await sendContent(i);
    });

    function groupButtons(buttons, groupSize = 5) {
      let groupedButtons = [];
      for (let i = 0; i < buttons.length; i += groupSize) {
        groupedButtons.push(buttons.slice(i, i + groupSize));
      }
      return groupedButtons;
    }
    let testSave = async (link, randID, message) => {
      const cleanDumpSchema = new mongoose.Schema({
        _id: Schema.Types.ObjectId,
        customID: String,
        randID: { type: String, required: true },
        url: String,
        messageID: String,
        messageURL: String,
        channelID: String,
        serverID: String,
      });
      const cleanDumpdb2 = mongoose.model("CleanDump", cleanDumpSchema);

      // Replace this with your actual MongoDB connection code
      // mongoose.connect('mongodb+srv://Abyss:Logandisney123@datacluster.2g021uy.mongodb.net/2Test_bot')
      //   .then(() => console.log('Connected to MongoDB'))
      //   .catch(err => console.error('Error connecting to MongoDB:', err));
      // let obj = {
      //   _id: new mongoose.Types.ObjectId(),
      //   randID: randID,
      //   customID: `clean_dump_${randID}`,
      //   url: link,
      //   messageID: message.id,
      //   messageURL: message.url,
      //   channelID: message.channel.id,
      //   serverID: message.guild.id,
      // }
      // try {

      //   await cleanDumpdb2.create(obj);
      //   console.log(`The File [ MESSAGES BATCH id: ${batch_id} ] was JUST saved to the database`);
      //   console.log(`returning C`)
      //   return;
      // } catch (error) {
      //   console.log(`Error while trying to save [ MESSAGES BATCH id: ${batch_id} ] to the database: `, error);
      //   console.log(`returning D`)
      //   return;
      // }
      // Test the create function
      let result = await cleanDumpdb2.create({
        _id: new mongoose.Types.ObjectId(),
        randID: randID,
        customID: `clean_dump_${randID}`,
        url: link,
        messageID: message.id,
        messageURL: message.url,
        channelID: message.channel.id,
        serverID: message.guild.id,
      });
      if (result) {
        console.log("Document created:", result);
        return true;
      } else {
        console.error("Error creating document:", result);
        return false;
      }

      console.log(done);
    }; // Replace this with your actual schema and model definition

    let saveLink = async (link, randID, message) => {
      try {
        console.log("Before cleanDumpdb.create:", link, randID, message.id);
        cleanDumpdb
          .create({
            _id: new mongoose.Types.ObjectId(),
            randID: randID,
            customID: `clean_dump_${randID}`,
            url: link,
            messageID: message.id,
            messageURL: message.url,
            channelID: message.channel.id,
            serverID: message.guild.id,
          })
          .then((result) => {
            console.log("After cleanDumpdb.create:", link, randID, message.id);
            console.log("Result:", result);
            console.log(`saved`);
          })
          .catch((error) => {
            console.log("Error in cleanDumpdb.create:", error);
          });
      } catch (error) {
        console.log(`not saved`, error);
      }
    };

    async function redactLinksInChannel(channel) {
      let messagesWithLinks = [];
      async function handleLinks(links, message) {
        let buttons = [];
        await Promise.all(
          links.map(async (link) => {
            let randID = scripts_djs.getRandID();
            try {
              console.log("Before saveLink:", randID, link);
              await saveLink(link, randID, message);
              console.log("After saveLink:", randID, link);
              let button = await createBtn.createButton({
                style: "secondary",
                label: "content",
                customID: `clean_dump_${link}_1_${randID}`,
              });
              //links.push(link);
              buttons.push(button);
            } catch (error) {
              console.log(error);
            }
          })
        );
        console.log(
          `Created ${buttons.length} buttons for ${links.length} links.`
        );
        return buttons;
      }
      let messages = [];
      let lastId;

      const LINK_REGEX = /(https?:\/\/[^\s]+)/g;

      function hasEmbedWithURL(message) {
        return message.embeds.some((embed) => embed.url);
      }

      async function handleMessages(channel) {
        let fetchedMessages;

        do {
          fetchedMessages = await channel.messages.fetch({
            limit: 100,
            before: lastId,
          });

          messages.push(...Array.from(fetchedMessages.values()));
          lastId = fetchedMessages.last()?.id;
          await interaction.editReply(
            `So far we have found ${messages.length} messages.`
          ); // update the user
          console.log(`Fetched ${fetchedMessages.size} messages.`);
        } while (fetchedMessages.size > 0);

        let messagesWithLinks = messages.filter((message) => {
          console.log(
            !message.content === "" &&
              !message.content === null &&
              (LINK_REGEX.test(message.content) ||
                hasEmbedWithURL(message) ||
                message?.embeds?.some(
                  (embed) =>
                    embed?.description &&
                    /\[.*?\]\(https?:\/\/[^\s]+\)/g.test(embed?.description)
                ))
          );
          // delete if working
          //  message?.embeds?.some((embed) => {
          //   console.log(embed)
          //   console.log(embed.description)
          //   console.log(/\[.*?\]\(https?:\/\/[^\s]+\)/g.test(embed?.description))
          //   if(embed.description === "[ Rip Jah](https://krakenfiles.com/view/UquQ9y7sSf/file.html)"){
          //                 console.log(`here`)
          //                 console.log(embed)
          //     console.log(embed.description)
          //     console.log(/\[.*?\]\(https?:\/\/[^\s]+\)/g.test(embed?.description))
          //     console.log(`version 2`, /\[[^\[\]\n]+\]\([^()\s]+\)/g
          //     .test(embed?.description)
          //     )

          //  }

          //  if(embed.description === `[ Crystal
          //   Approved by <@342048735108268033>](https://krakenfiles.com/view/nZBIT77UXw/file.html)`){
          //                 console.log(`here`)
          //                 console.log(embed)
          //     console.log(embed.description)
          //     console.log(/\[.*?\]\(https?:\/\/[^\s]+\)/g.test(embed?.description))
          //     console.log(`version 2`,/\[[^\[\]\n]+\]\([^()\s]+\)/g
          //     .test(embed?.description)
          //     )

          //  }
          //   return embed?.description && /\[.*?\]\(https?:\/\/[^\s]+\)/g.test(embed?.description)
          // })
          console.log(
            `final`,
            !(message.content === "" || message.content === null) &&
              (LINK_REGEX.test(message.content) ||
                hasEmbedWithURL(message) ||
                message?.embeds?.some(
                  (embed) =>
                    embed?.description &&
                    /\[[^\[\]\n]+\]\([^()\s]+\)/g.test(embed?.description)
                ))
          );

          return (
            !(message.content === "" || message.content === null) &&
            (LINK_REGEX.test(message.content) ||
              hasEmbedWithURL(message) ||
              message?.embeds?.some(
                (embed) =>
                  embed?.description &&
                  /\[[^\[\]\n]+\]\([^()\s]+\)/g.test(embed?.description)
              ))
          );
        });

        let editedCount = 0;

        await Promise.all(
          messagesWithLinks.map(async (message) => {
            // run a check here so that if message.content === `` dont even bother with the regex in message content
            let redactedContent =
              message.content === ""
                ? ""
                : message.content.replace(LINK_REGEX, "`[*]`");
            let links = Array.from(message.content.matchAll(LINK_REGEX)).map(
              (match) => match[0]
            );

            console.log(message);
            console.log(links, `links`);
            console.log(redactedContent, `redactedContent`);

            let buttons = [];
            if (links.length > 0) {
              for (const link of links) {
                const button = await handleLinks([link], message);
                for (const b of button) {
                  buttons.push(b);
                }
              }
              buttons = buttons.flat();
            }

            let newEmbeds = await Promise.all(
              message.embeds.map(async (embed) => {
                let redactedEmbed;
                if (
                  embed.url ||
                  (embed?.description &&
                    /\[[^\[\]\n]+\]\([^()\s]+\)/g.test(embed?.description))
                ) {
                  // create redactedEmbed
                  console.log(`Embed url or description found`);
                  redactedEmbed = createEmb.createEmbed({
                    title: embed?.title || ``,
                    description: embed?.description || ``,
                    thumbnail: embed?.thumbnail?.url || "",
                    image: embed?.image?.url || "",
                    author: embed?.author
                      ? {
                          name: embed?.author?.name || ``,
                          iconURL: embed?.author?.iconURL || null,
                        }
                      : null,
                    footer: embed?.footer
                      ? {
                          text: embed?.footer?.text || ``,
                          iconURL: embed?.footer?.iconURL || null,
                        }
                      : null,
                  });

                  // handle description links
                  if (embed?.description) {
                    // replace [x](y) pattern in description
                    let matches = redactedEmbed?.description?.match(
                      /\[[^\[\]\n]+\]\([^()\s]+\)/g
                    );
                    if (matches) {
                      matches.forEach(async (match) => {
                        let parts = match.match(/\[(.*?)\]\((.*?)\)/);
                        let text = parts[1];
                        let link = parts[2];
                        redactedEmbed.description =
                          redactedEmbed?.description.replace(
                            match,
                            `${text} (link below)`
                          );
                        links.push(link);

                        // save link to db here
                        let randID = scripts_djs.getRandID();

                        try {
                          console.log("Before saveLink:", randID, link);
                          await saveLink(link, randID, message);
                          console.log("After saveLink:", randID, link);
                          let button = await createBtn.createButton({
                            style: "secondary",
                            label: "content",
                            customID: `clean_dump_${link}_2_${randID}`,
                          });
                          buttons.push(button);
                        } catch (error) {
                          console.log(error);
                        }
                      });
                    }
                  }

                  // handle embed url
                  if (embed?.url) {
                    let randID = scripts_djs.getRandID();
                    let link = embed.url;
                    try {
                      console.log("Before saveLink:", randID, link);
                      await saveLink(link, randID, message);
                      console.log("After saveLink:", randID, link);
                      let button = await createBtn.createButton({
                        style: "secondary",
                        label: "content",
                        customID: `clean_dump_${link}_3_${randID}`,
                      });
                      buttons.push(button);
                      buttons = buttons.flat();
                    } catch (error) {
                      console.log(error);
                    }
                  }
                }
                return redactedEmbed; // Add this return statement
              })
            );

            let actionRows = [];
            let groupedButtons = groupButtons(buttons);
            for (let group of groupedButtons) {
              let actionRow = await createActRow.createActionRow({
                components: group,
              });
              actionRows.push(actionRow);
            }
            actionRows = [...actionRows, ...message.components];
            while (actionRows.length > 5) {
              actionRows.shift();
            }

            await message
              .edit({
                content: redactedContent,
                embeds: newEmbeds,
                components: actionRows,
              })
              .then(async (message) => {
                editedCount++;
                await interaction.editReply(
                  `So far we have edited & filtered ${editedCount} messages with ${
                    messagesWithLinks.length - editedCount
                  } to go.\n\n${message.url}`
                );
                console.log(`Edited ${editedCount} messages so far.`);
              })
              .catch((error) => {
                console.log(error);
              });
          })
        );

        console.log(messagesWithLinks);

        return messagesWithLinks;
      }

      messagesWithLinks = await handleMessages(channel);
      console.log(messagesWithLinks);

      return messagesWithLinks;
    }

    redactLinksInChannel(target)
      .then(async (messagesWithLinks) => {
        console.log(`done`);
        await interaction.editReply(
          `${messagesWithLinks.length} messages have been cleaned and the command is now complete`
        );
      })
      .catch(async (error) => {
        console.log(error);
        await interaction.editReply(
          `An error occurred while cleaning \n\`\`\`js\n${error}\n\`\`\``
        );
      });
  },
};
