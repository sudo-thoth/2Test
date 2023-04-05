const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
require("dotenv").config({ path: "../../my.env" });
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");
const createBtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");
const cleanDumpdb = require("../../../MongoDB/db/schemas/schema_cleanData.js");
const client = require("../../index.js");
const mongoose = require("mongoose");
const { Schema, model } = require("mongoose");
async function sendContent(interaction) {
  let interactionObj = scripts_djs.getInteractionObj(interaction);
  let { customID, user, channel } = interactionObj;
  if (customID.includes("clean_dump_") && interaction.isButton()) {
    console.log(`clean dump button heard`);
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
    console.log(`clean dump after defer`);
    user = interaction.user;
    let randID = scripts_djs.extractID(customID);
    try {
      let data = await cleanDumpdb.findOne({ randID: randID }).exec();
      console.log(`clean dump after db search`);
      if (data) {
        console.log(`clean dump data found`);
        let { url, messageID, messageURL, channelID, serverID, ogContent } =
          data;

        let guild = interaction.client.guilds.cache.get(serverID);
        let channel = guild.channels.cache.get(channelID);
        let message = await channel.messages.fetch(messageID);
        await user
          .send({
            embeds: [
              ...message.embeds,
              createEmb.createEmbed({
                author: {
                  name: `${user.username}#${user.discriminator}`,
                  iconURL: user.avatarURL(),
                },
                url: messageURL,
                title: `Original Content from ${guild.name}`,
                description: `Button Linked : \`${url}\`\n${ogContent}`,
                footer: {
                  text: interaction?.client?.user?.username,
                  iconURL: interaction?.client?.user?.avatarURL(),
                },
              }),
            ],
            components: [
              await createActRow.createActionRow({
                components: [
                  await createBtn.createButton({
                    label: "Link",
                    style: "link",
                    link: `${url}`,
                  }),
                ],
              }),
            ],
          })
          .then(async () => {
            console.log(`clean dump after dm send`);
            await interaction.editReply({
              embeds: [
                createEmb.createEmbed({
                  author: {
                    name: `${user.username}#${user.discriminator}`,
                    iconURL: user.avatarURL(),
                  },
                  title: labelT,
                  footer: {
                    text: interaction?.client?.user?.username,
                    iconURL: interaction?.client?.user?.avatarURL(),
                  },
                }),
              ],
            });
          });
      } else {
        console.log(`clean dump no data found`);
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              author: {
                name: `${user?.username}#${user?.discriminator}`,
                iconURL: user.avatarURL(),
              },
              title: `There was No Data to send`,
              footer: {
                text: interaction?.client?.user?.username,
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
    console.log(`clean dump returning`);
    return;
  }
}

client.on("interactionCreate", async (i) => {
  if (i?.customId?.includes("clean_dump_") && i?.isButton()) {
    await sendContent(i);
  }
});

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

function extractDomain(url) {
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n?]+)/;

  const match = url?.match(regex);
  const domain = match && match[1];
  if (domain) {
    const domainParts = domain.split(".");
    return domainParts[domainParts.length - 2];
  }
  return null;
}
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

    const { options } = interaction;
    const target = options.getChannel("target-channel") || interaction.channel;
    await interaction.editReply({
      embeds: [
        createEmb.createEmbed({
          title: `Request to clean <#${target.id}> Received`,
        }),
      ],
    });

    function groupButtons(buttons, groupSize = 5) {
      let groupedButtons = [];
      for (let i = 0; i < buttons.length; i += groupSize) {
        groupedButtons.push(buttons.slice(i, i + groupSize));
      }
      return groupedButtons;
    }
    // let testSave = async (link, randID, message) => {
    //   const cleanDumpSchema = new mongoose.Schema({
    //     _id: Schema.Types.ObjectId,
    //     customID: String,
    //     randID: { type: String, required: true },
    //     url: String,
    //     messageID: String,
    //     messageURL: String,
    //     channelID: String,
    //     serverID: String,
    //   });
    //   const cleanDumpdb2 = mongoose.model("CleanDump", cleanDumpSchema);

    //   // Replace this with your actual MongoDB connection code
    //   // mongoose.connect('mongodb+srv://Abyss:Logandisney123@datacluster.2g021uy.mongodb.net/2Test_bot')
    //   //   .then(() => console.log('Connected to MongoDB'))
    //   //   .catch(err => console.error('Error connecting to MongoDB:', err));
    //   // let obj = {
    //   //   _id: new mongoose.Types.ObjectId(),
    //   //   randID: randID,
    //   //   customID: `clean_dump_${randID}`,
    //   //   url: link,
    //   //   messageID: message.id,
    //   //   messageURL: message.url,
    //   //   channelID: message.channel.id,
    //   //   serverID: message.guild.id,
    //   // }
    //   // try {

    //   //   await cleanDumpdb2.create(obj);
    //   //   console.log(`The File [ MESSAGES BATCH id: ${batch_id} ] was JUST saved to the database`);
    //   //   console.log(`returning C`)
    //   //   return;
    //   // } catch (error) {
    //   //   console.log(`Error while trying to save [ MESSAGES BATCH id: ${batch_id} ] to the database: `, error);
    //   //   console.log(`returning D`)
    //   //   return;
    //   // }
    //   // Test the create function
    //   let result = await cleanDumpdb2.create({
    //     _id: new mongoose.Types.ObjectId(),
    //     randID: randID,
    //     // customID: `clean_dump_${randID}`,
    //     url: link,
    //     messageID: message.id,
    //     messageURL: message.url,
    //     channelID: message.channel.id,
    //     serverID: message.guild.id,
    //     ogContent: message.content,
    //   });
    //   if (result) {
    //     console.log("Document created:", result);
    //     return true;
    //   } else {
    //     console.error("Error creating document:", result);
    //     return false;
    //   }

    //   console.log(done);
    // }; // Replace this with your actual schema and model definition

    let saveLink = async (link, randID, message) => {
      let numAttempts = 0;
      const maxAttempts = 5;
      let isConnected = false;

      while (numAttempts < maxAttempts && !isConnected) {
        try {
          if (!mongoose.connection.readyState) {
            // Connect to the database if not already connected
            await mongoose.connect(process.env.MongoDB_Token_2Test_bot);
          }
          isConnected = true; // Set flag to true if successful connection
          console.log(`Connected to MongoDB on attempt ${numAttempts + 1}`);
          // Save the link to the database
          const result = await cleanDumpdb.create({
            _id: new mongoose.Types.ObjectId(),
            randID: randID,
            // customID: `clean_dump_${randID}`,
            url: link,
            messageID: message.id,
            messageURL: message.url,
            channelID: message.channel.id,
            serverID: message.guild.id,
            ogContent: message.content,
          });
          console.log("Result:", result);
          console.log(`Saved link ${link} to database`);
        } catch (error) {
          numAttempts++;
          console.log(
            `Error in cleanDumpdb.create on attempt ${numAttempts}:`,
            error
          );
        }
      }

      if (!isConnected) {
        console.error(
          `Failed to connect to MongoDB after ${maxAttempts} attempts`
        );
      }
    };
    function trimNonAlphanumeric(str) {
      // Remove non-alphanumeric characters (excluding slashes) from the beginning of the string
      str = str?.replace(/^[^\w/]+/, '');
    
      // Remove non-alphanumeric characters (excluding slashes) from the end of the string
      str = str?.replace(/[^\w/]+$/, '');
    
      return str;
    }

    async function redactLinksInChannel(channel) {
      let messagesWithLinks = [];
      async function handleLinks(links, message) {
        let buttons = [];
        await Promise.all(
          links.map(async (link) => {
link =  trimNonAlphanumeric(link)
            let randID = scripts_djs.getRandID();
            let button = await createBtn.createButton({
              style: "primary",
              label: `${extractDomain(link)} content`,
              customID: `clean_dump_1_${randID}`,
            });
            //links.push(link);
            buttons.push(button);
            buttons = buttons.flat();
            try {
              console.log("Before saveLink:", randID, link);
              await saveLink(link, randID, message);
              console.log("After saveLink:", randID, link);
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
        return message?.embeds?.some((embed) => embed.url);
      }
      function hasEmbedWithFieldURL(message) {
        return message?.embeds?.some((embed) => {
          return Object.values(embed.fields).some((field) => {
            return (
              /\[.*?\]\(https?:\/\/[^\s]+\)/g.test(field.name) ||
              /\[.*?\]\(https?:\/\/[^\s]+\)/g.test(field.value) ||
              /https?:\/\/[^\s]+/g.test(field.name) ||
              /https?:\/\/[^\s]+/g.test(field.value) || 
              /\[([\s\S]*?)\]\(https?:\/\/[^\s]+\)/g.test(field.name) ||
              /\[([\s\S]*?)\]\(https?:\/\/[^\s]+\)/g.test(field.value)
            );
          });
        });
      }

      function redactEmbedFields(embed) {
        const regex = /\[([\s\S]*?)\]\((https?:\/\/[^\s]+)\)/g;
        const links2 = [];
        let redactedEmbed2 = embed?.data || embed;
      
        // Return early if there are no fields
        if (!redactedEmbed2?.fields?.length) {
          return { redactedEmbed2, links2 };

        }
      
        redactedEmbed2.fields?.forEach((field) => {
          const patterns = [
            /\[([\s\S]*?)\]\(https?:\/\/[^\s]+\)/g,
            /https?:\/\/[^\s]+/g,
          ];
      
          patterns.forEach((pattern) => {
            ["name", "value"].forEach((property) => {
              let matches = field[property].match(pattern);
              if (matches) {
                matches.forEach((match) => {
                  let parts = match.match(regex) || [
                    null,
                    null,
                    match,
                  ];
                  let text = parts[1] || match;
                  let link = parts[2];
                  link = trimNonAlphanumeric(link)
                  field[property] = field[property].replace(
                    match,
                    `${text} (link below)`
                  );
                  links2.push(link);
                });
              }
            });
          });
        });
      
        return {
          redactedEmbed2,
          links2,
        };
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
          await interaction.editReply({
            embeds: [
              createEmb.createEmbed({
                author: {
                  name: `${user.username}#${user.discriminator}`,
                  iconURL: user.avatarURL(),
                },
                title: `Gathering messages in ${channel.name}`,
                description: `So far we have found \`${messages.length}\` messages.`,
                footer: {
                  text: interaction?.client?.user?.username,
                  iconURL: interaction?.client?.user?.avatarURL(),
                },
              }),
            ],
          }); // update the user
          console.log(`Fetched ${fetchedMessages.size} messages.`);
        } while (fetchedMessages.size > 0);
        const patterns = [
          /\[([\s\S]*?)\]\(https?:\/\/[^\s]+\)/g,
          /https?:\/\/[^\s]+/g,
        ];

        function hasEmbedWithFieldURLPattern(message) {
          return message?.embeds?.some((embed) => {
            return embed.fields.some((field) => {
              console.log(message);

              return ["name", "value"].some((property) => {
                return patterns.some((pattern) => {
                  return pattern.test(field[property]);
                });
              });
            });
          });
        }

        function hasLink(message) {
          let withLink = false;

          if (
            LINK_REGEX.test(
              !message.content === "" && !message.content === null
                ? message.content
                : ``
            )
          ) {
            withLink = true;
          }

          if (hasEmbedWithURL(message)) {
            withLink = true;
          }

          if (
            message?.embeds?.some(
              (embed) =>
                (embed?.description &&
                  /\[[^\[\]\n]+\]\([^()\s]+\)/g.test(embed?.description)) ||
                  /\[([\s\S]*?)\]\(https?:\/\/[^\s]+\)/g.test(embed?.description) ||
                hasEmbedWithFieldURL(message) ||
                message?.attachments.length > 0
            )
          ) {
            withLink = true;
          }

          if (message?.content?.match(/https?:\/\/[^\s]+/g)?.length > 0) {
            withLink = true;
          }

          if (hasEmbedWithFieldURLPattern(message)) {
            withLink = true;
          }
          if (
            (!message.content || message.content === ``) &&
            message.embeds.length > 0
          ) {
            console.log(message.embeds[0]?.fields?.length);
            if (message.embeds[0]?.fields.length > 0) {
              
              if (message?.embeds?.some((embed) => embed.fields?.length > 0)) {
                console.log(message);
                console.log(`withLink at this point`, withLink);
                console.log("here");
              }
            }
          }

          return withLink;
        }

        let messagesWithLinks = messages.filter((message) => hasLink(message));

        let editedCount = 0;
        console.log(messagesWithLinks, `the messages w links`);
        //         console.log(messages_1, `the messages_1`)
        // console.log(messages_2, `the messages_2`)
        // messagesWithLinks = [...messagesWithLinks, ...messages_2]
        await Promise.all(
          messagesWithLinks.map(async (message) => {
            // run a check here so that if message.content === `` dont even bother with the regex in message content


            let redactedContent =
              message?.content === "" || message?.content === null
                ? ""
                : message.content.replace(LINK_REGEX, "`[*]`");
            let links = Array.from(message.content.matchAll(LINK_REGEX)).map(
              (match) => match[0]
            );

            console.log(message);
            console.log(links, `links`);
            console.log(redactedContent, `redactedContent`);
            links = Array.from(new Set(links));
            let buttons = [];
            if (links.length > 0) {
              for (let link of links) {
                link = trimNonAlphanumeric(link)
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
                    /\[[^\[\]\n]+\]\([^()\s]+\)/g.test(embed?.description)) ||
                    /\[([\s\S]*?)\]\(https?:\/\/[^\s]+\)/g.test(embed?.description) ||
                  hasEmbedWithFieldURL(message) ||
                  message?.attachments.length > 0 ||
                  message?.content?.match(/https?:\/\/[^\s]+/g)
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
                  let content = message.content;

                  if (content.match(/https?:\/\/[^\s]+/g)) {
                    if (
                      message.content.includes(
                        `https://leaked.cx/threads/juice-wrld-fadeaway-scars-master.88358/`
                      ) ||
                      message.content.includes(
                        `https://onlyfiles.cc/f2/iMAVg_V73SqJX5l/`
                      ) ||
                      message.content.includes(
                        `https://onlyfiles.cc/f2/6nEt5h9_azADI9R/`
                      )
                    ) {
                      console.log(`should flagg this message`);
                      console.log(message.content);
                      console.log(
                        `total check`,
                        LINK_REGEX.test(
                          !message.content === "" && !message.content === null
                            ? message.content
                            : ``
                        ) ||
                          hasEmbedWithURL(message) ||
                          message?.embeds?.some(
                            (embed) =>
                              (embed?.description &&
                                /\[.*?\]\(https?:\/\/[^\s]+\)/g.test(
                                  embed?.description
                                )) ||
                              hasEmbedWithFieldURL(message) ||
                              message?.attachments.length > 0 ||
                              message?.content?.match(/https?:\/\/[^\s]+/g)
                          )
                      );

                      console.log(
                        `link check`,
                        message?.content?.match(/https?:\/\/[^\s]+/g)
                      );

                      console.log(`done`);
                    }

                    // replace any link in content
                    let matches = redactedContent.match(/https?:\/\/[^\s]+/g);
                    if (matches) {
                      matches.forEach(async (match) => {

                        let link = match;
                        let domain = extractDomain(link);
                        redactedContent = redactedContent.replace(
                          match,
                          `\`[${domain} link below]\``
                        );
                        links.push(link);

                        // save link to db here
                        let randID = scripts_djs.getRandID();
                        let button = await createBtn.createButton({
                          style: "primary",
                          label: `${extractDomain(link)} content`,
                          customID: `clean_dump_2_${randID}`,
                        });
                        buttons.push(button);
                        buttons = buttons.flat();
                        try {
                          console.log("Before saveLink:", randID, link);
                          await saveLink(link, randID, message);
                          console.log("After saveLink:", randID, link);
                        } catch (error) {
                          console.log(error);
                        }
                      });
                    } else {
                      console.log(matches, content);
                      console.log("no matches");
                    }
                  }

                  console.log(redactedContent, `redactedContent`);

                  if (
                    message.content.includes(
                      `https://leaked.cx/threads/juice-wrld-fadeaway-scars-master.88358/`
                    ) ||
                    message.content.includes(
                      `https://onlyfiles.cc/f2/iMAVg_V73SqJX5l/`
                    ) ||
                    message.content.includes(
                      `https://onlyfiles.cc/f2/6nEt5h9_azADI9R/`
                    )
                  ) {
                    console.log(`should flagg this message`);
                    console.log(message.content);
                    console.log(
                      `total check`,
                      LINK_REGEX.test(
                        !message.content === "" && !message.content === null
                          ? message.content
                          : ``
                      ) ||
                        hasEmbedWithURL(message) ||
                        message?.embeds?.some(
                          (embed) =>
                            (embed?.description &&
                              /\[.*?\]\(https?:\/\/[^\s]+\)/g.test(
                                embed?.description
                              )) ||
                            hasEmbedWithFieldURL(message) ||
                            message?.attachments.length > 0 ||
                            message?.content?.match(/https?:\/\/[^\s]+/g)
                        )
                    );
                    console.log(redactedContent, `redactedContent`);
                    console.log(
                      `link check`,
                      message?.content?.match(/https?:\/\/[^\s]+/g)
                    );

                    console.log(`done`);
                  }
                  // handle description links
                  if (embed?.description) {
                    // replace [x](y) pattern in description
                    let matches = redactedEmbed?.data?.description?.match(
                      /\[([\s\S]*?)\]\(https?:\/\/[^\s]+\)/g
                    );
                    if (matches) {
                      matches.forEach(async (match) => {
                        let parts = match.match(/\[([\s\S]*?)\]\((https?:\/\/[^\s]+)\)/);
                        let text = parts[1];
                        let link = parts[2];
                        link = trimNonAlphanumeric(link);
                        redactedEmbed.data.description = redactedEmbed?.data?.description.replace(
                          match,
                          `${text} (link below)`
                        );
                  
                        links.push(link);
                  
                        // save link to db here
                        let randID = scripts_djs.getRandID();
                        let button = await createBtn.createButton({
                          style: "primary",
                          label: `${extractDomain(link)} content`,
                          customID: `clean_dump_22_${randID}`,
                        });
                        buttons.push(button);
                        buttons = buttons.flat();
                        try {
                          console.log("Before saveLink:", randID, link);
                          await saveLink(link, randID, message);
                          console.log("After saveLink:", randID, link);
                        } catch (error) {
                          console.log(error);
                        }
                      });
                    } else {
                      console.log(matches, embed?.description);
                      console.log(`no matches`);
                    }
                  }
                  

                  // handle embed url
                  if (embed?.url) {
                    let randID = scripts_djs.getRandID();
                    let link = embed.url;
                    let button = await createBtn.createButton({
                      style: "primary",
                      label: `${extractDomain(link)} content`,
                      customID: `clean_dump_3_${randID}`,
                    });
                    buttons.push(button);
                    buttons = buttons.flat();
                    try {
                      console.log("Before saveLink:", randID, link);
                      await saveLink(link, randID, message);
                      console.log("After saveLink:", randID, link);
                    } catch (error) {
                      console.log(error);
                    }
                  }

                  let convertFiles = async (message) => {
                    let buttons = [];
                    for (const attachment of message.attachments.values()) {
                      let randID = scripts_djs.getRandID();
                      let button = await createBtn.createButton({
                        style: "primary",
                        label: "attachment",
                        customID: `clean_dump_4_${randID}`,
                      });
                      buttons.push(button);
                      buttons = buttons.flat();
                      try {
                        console.log("Before saveLink:", randID, attachment.url);
                        await saveLink(attachment.url, randID, message);
                        console.log("After saveLink:", randID, attachment.url);
                      } catch (error) {
                        console.log(error);
                      }
                    }
                    return buttons;
                  };
                  let moreButtons = await convertFiles(message);
                  for (const b of moreButtons) {
                    buttons.push(b);
                  }
                  buttons = buttons.flat();

                  let { redactedEmbed2, links2 } =
                    redactEmbedFields(redactedEmbed);
                  links = [...links, ...links2];
                  redactedEmbed = createEmb.createEmbed({
                    title: redactedEmbed2?.title || ``,
                    description: redactedEmbed2?.description || ``,
                    thumbnail: redactedEmbed2?.thumbnail?.url || "",
                    image: redactedEmbed2?.image?.url || "",
                    author: redactedEmbed2?.author
                      ? {
                          name: redactedEmbed2?.author?.name || ``,
                          iconURL: redactedEmbed2?.author?.iconURL || null,
                        }
                      : null,
                    footer: redactedEmbed2?.footer
                      ? {
                          text: redactedEmbed2?.footer?.text || ``,
                          iconURL: redactedEmbed2?.footer?.iconURL || null,
                        }
                      : null,
                  });
                  if (links2.length > 0) {
                    const button = await handleLinks(links2, message);
                    for (const b of button) {
                      buttons.push(b);
                    }
                    buttons = buttons.flat();
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
                user = interaction.user;
                await interaction.editReply({
                  embeds: [
                    createEmb.createEmbed({
                      author: {
                        name: `${user.username}#${user.discriminator}`,
                        iconURL: user.avatarURL(),
                      },
                      title: `Redacting links in ${channel.name}`,
                      url: message.url,
                      description: `So far we have edited & filtered ${editedCount} messages with ${
                        messagesWithLinks.length - editedCount
                      } to go.\n\n${message.url}`,
                      footer: {
                        text: interaction?.client?.user?.username,
                        iconURL: interaction?.client?.user?.avatarURL(),
                      },
                    }),
                  ],
                });
                console.log(`Edited ${editedCount} messages so far.`);
              })
              .catch((error) => {
                // if error is , tDiscordAPIError[50027]: Invalid Webhook Token then get the relevant message with
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
    let user = interaction.user;
    redactLinksInChannel(target)
      .then(async (messagesWithLinks) => {
        console.log(`done`);
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              author: {
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.avatarURL(),
              },
              color: scripts.getSuccessColor(),
              title: `Complete in ${interaction.channel.name}`,
              // url: message.url,
              description: `\`${messagesWithLinks.length}\` messages have been cleaned and the command is now complete`,
              footer: {
                text: interaction?.client?.user?.username,
                iconURL: interaction?.client?.user?.avatarURL(),
              },
            }),
          ],
        });
      })
      .catch(async (error) => {
        console.log(error);
        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              author: {
                name: `${user.username}#${user.discriminator}`,
                iconURL: user.avatarURL(),
              },
              color: scripts.getErrorColor(),
              title: `Error in ${interaction.channel.name}`,
              // url: message.url,
              description: `An error occurred while cleaning \n\`\`\`js\n${error}\n\`\`\``,
              footer: {
                text: interaction?.client?.user?.username,
                iconURL: interaction?.client?.user?.avatarURL(),
              },
            }),
          ],
        });
      });
  },
};
