const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const createModal = require("../../functions/create/createModal.js");
const client = require(`../../index.js`);
const createEmb = require("../../functions/create/createEmbed.js");
const createActRow = require("../../functions/create/createActionRow.js");
const createBtn = require("../../functions/create/createButton.js");
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const mongoose = require("mongoose");
const postData = require("../../../MongoDB/db/schemas/schema_post.js");
const newPostDataButton = require("../../../MongoDB/db/schemas/schema_newPostButtons.js");
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
const roleString = (roles) => {
  // for every role in the array, add it to the string
  let string = ``;
  roles.forEach((role) => {
    string += `${role && role !== null ? `${role}\n` : ``}`;
  });
  return string;
};
async function savePostData(obj) {
  let obj1 = {
    _id: new mongoose.Types.ObjectId(),
    userId: obj.userId,
    user: obj.user,
    randID: obj.randID,
    roles: obj.roles,
    type: obj.type,
    format: obj.format,
    file: obj.file,
    interactionID: obj.interactionID,
    file_type: obj.file_type,
    kraken_url: obj.kraken_url,
  };
  try {
    console.log(`Saving a post from [ ${obj.user.username} ]`);
    await postData.create(obj1);
    console.log(`✅ [ ${obj.user.username} ] Saved a post SUCCESSFULLY`);
    return;
  } catch (error) {
    console.log(`Error while trying to save a post to the database: `, error);
    return;
  }
}

async function getPostData(randID) {
  console.log(`GETTING DATA`);
  console.log(`randID: ${randID}`);
  if (!randID) return;
  let data;

  try {
    data = await postData.findOne({ randID: randID }).exec();
  } catch (error) {
    console.log(
      `an error occurred while trying to get the data from the database: `,
      error
    );
  }
  if (data == null) {
    // console.log(data)
    console.log(`[ data ] NOT found in query`);
  } else {
    // console.log(data)
    console.log(`[ data ] found in query: `);
  }
  return data; // an array of docs found that matched the query
}

async function updatePostData(randID, obj) {
  console.log(`UPDATING DATA`);
  console.log(`randID: ${randID}`);
  if (!randID || !obj) return;

  const query = { randID: randID };
  const update = { $set: obj };
  console.log(`the query: `, query);
  console.log(`the update: `, update);
  try {
    await postData
      .findOneAndUpdate(query, update, { upsert: true }, (err, data) =>
        err
          ? console.log(
              `Ran into 
    some Errors while trying to find and update: `,
              err
            )
          : console.log(`found it and updated it successfully`)
      )
      .clone();
    console.log(`updated the data to the database w the query: `, query);
  } catch (error) {
    console.log(
      `an error occurred while trying to update the data to the database: `,
      error
    );
  }
  return;
}
let buttonEmojis = [
  "<a:suslook:929525675721895976>",
  "<a:loading:999005098153877616>",
  "<a:Dance:1027086599646871622>",
  "<a:ablobwave:607305059482468400>",
  "<a:999:1086670800704249919>",
  "<a:heartpoof:825065061617893376>",
  "<:chase_tele:1084267460930314341>",
  "<a:hmmthonk:812320213701754940>",
  "<a:hmm:962804016667050014>",
  "<a:neonthink:831210917772394546>",
  "<:musicfolder:1082336013201965137>",
  "<a:dumbpepetyping:1058900589225975898>",
  "<a:cuteblink:825285228112904192>",
  "<a:Skype_Thinking:870179836151337001>",
  "<a:emoji_500:988061635446997024>",
  "<a:happydance:1083256426249601084>",
  "<a:blobdance:1082904217586520144>",
  "<a:gonewhendemoted:1085693296996794398>",
  "<a:BlobBongoSpam:893861113861644328>",
  "<a:youtried:893859967470280734>",
  "<a:gx_Gunhands:817821051731443792>",
  "<a:announcements:1052611391858684015>",
  "<a:Notifbell:1052611366688669746>",
  "<a:Giveaways:1052611718519459850>",
  "<a:DiscordLoading:1075796965515853955>",
  "<:upscale_1:940147353879478324>",
  "<a:gx_MulticolorDustbin:747403256832983123>",
  "<a:KkirbyChillin:1033609090477334580>",
  "<a:YESSS:954133570010624030> ",
  "<a:schemein:958492006634618890>",
  "<a:lostwrld:1074769198670155806>",
  "<a:dance_monke:859562058097754133>",
  "<a:ahhh_vcy:1005725140274913291>",
  "<a:giftblob:960372456026165338>",
  "<a:M_OhShit:772700613670469642>",
  "<a:T_Google_AI:932060562668544000>",
  "<a:bananadance:837036207967436830>",
  "<a:thinkfast:811123249722818560>",
  "<a:blue_ribbon:1076384301232431115>",
  "<a:a_tada:740559067591737364>",
  "<a:tryitandsee:917474057048432680>",
  "<a:exiting:1022977820055580723>",
  "<a:egirls:961281622735487006>",
];
function getButtonEmoji() {
  let emoji = buttonEmojis[Math.floor(Math.random() * buttonEmojis.length)];
  return emoji;
}
// create a function that returns a button that takes teh place of downloadButton, wihtin teh function the buttno data is also saved with teh current id for easy access to the data upon the button interaction
async function createAndSaveDataButton(randID, file, interaction) {
  let label = `‎`;
  let emoji = getButtonEmoji();
  let style = `primary`;
  let customID = `post_new_data_button_${randID}`;
  let button = await createBtn.createButton({
    label: label,
    style: style,
    emoji: emoji,
    customID: customID,
  });
  let metaData = {
    datePosted: `${new Date().toISOString()}`,
    originChannel: interaction.channel.name,
    originChannelID: interaction.channel.id,
    originServer: interaction.guild.name,
    originServerID: interaction.guild.id,
    postedBy: interaction.user.username,
    requestedByID: interaction.user.id,
  };
  let obj = {
    _id: `${new mongoose.Types.ObjectId()}`,
    randID: randID,
    customID: customID,
    attachment: file,
    metaData: metaData,
  };

    await newPostDataButton
      .create(obj)
      .then(() => {
        console.log(`saved to db`);
        return button;
      })
      .catch(async (error) => {
        scripts.logError(error);
        console.log(`not saved`);
        try {
          return await interaction.editReply({embeds: [createEmb.createEmbed({title: `An Error Ocurred, try again`})]})
        } catch (error) {
          console.log(error)
        }
      });
      return button;
}

client.on("interactionCreate", async (interaction) => {
  // console.log(`the interaction`, interaction);
  const interactionObj = scripts_djs.getInteractionObj(interaction);
  const { id, channel, guild, userInfo, customID } = interactionObj;

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
    let randID = scripts_djs.extractID(customID);
    // The Post Command Modal Interaction Listeners
    if (customID.includes(`post_new_coverart_modal`)) {
      let data = await getPostData(randID);
      console.log(`the data is right here data`, data);
      let {
        userId,
        roles,
        type,
        format,
        file,
        interactionID,
        file_type,
        buttons,
      } = data;
      const songName = interaction.fields.getTextInputValue("name")
        ? interaction.fields.getTextInputValue("name")
        : null;
      const artist = interaction.fields.getTextInputValue("artist")
        ? interaction.fields.getTextInputValue("artist")
        : null;
      const artistsocial = interaction.fields.getTextInputValue("artistsocial")
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
       await interaction.channel.send({
          content: `${
            role.length > 1
              ? `|| ${scripts_djs.getAlertEmoji()} ${role} ||`
              : ``
          }`,
          embeds: [embed],
          components: [actionRow],
        });
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent Cover Art: ${songName}`,
            }),
          ],
        });
      } catch (error) {
        console.log(`cover art error`, error);
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sorry But There was an Error Posting [ Cover Art: ${songName} ]`,
              color: scripts.getErrorColor(),
            }),
          ],
        });
      }
    } else if (customID.includes(`post_new_rando_image_modal`)) {
      let data = await getPostData(randID);
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
       await interaction.channel.send({
          content: `${
            role.length > 1
              ? `|| ${scripts_djs.getAlertEmoji()} ${role} ||`
              : ``
          }`,
          embeds: [embed],
          components: [actionRow],
        });
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Image: ${title ? title : "unnamed"} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Image Post error`, error);
       await  interaction.editReply({
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
    } else if (customID.includes(`post_new_snippet_modal_vid`)) {
      let data = await getPostData(randID);
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
      // removing any buttons from snip vid post
      // // create a button to download the image
      // const downloadButton = await createAndSaveDataButton(
      //   randID,
      //   file,
      //   interaction
      // );
      // if (!downloadButton) return console.log(`no button`);
      // // create a action row to hold the button
      // const actionRow = await createActRow.createActionRow({
      //   components: [downloadButton],
      // });

      try {
       await interaction.channel.send({
          content: `${
            role.length > 1
              ? `|| ${scripts_djs.getAlertEmoji()} ${role} ||`
              : ``
          }`,
          embeds: [embed],
          components: [],
          files: [file],
        });
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Snippet: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Video Snippet Post error`, error);
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sorry But There was an Error Posting [ Snippet: ${songName} ]`,
              color: scripts.getErrorColor(),
            }),
          ],
        });
      }
    } else if (customID.includes(`post_new_rando_video_modal`)) {
      let data = await getPostData(randID);
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
        thumbnail: interaction.guild.iconURL(),
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
       await interaction.channel.send({
          content: `${
            role.length > 1
              ? `|| ${scripts_djs.getAlertEmoji()} ${role} ||`
              : ``
          }`,
          embeds: [embed],
          components: [actionRow],
          files: [file],
        });
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Snippet: ${title ? title : "unnamed"} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Video Snippet Post error`, error);
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sorry But There was an Error Posting [ Snippet: ${
                title ? title : "unnamed"
              } ]`,
            }),
          ],
        });
      }
    } else if (customID.includes(`post_new_leak_modal`)) {
      let data = await getPostData(randID);
      console.log(`the data`, data);

      data = data._doc;
      console.log(`the data`, data);
      let { roles, file, file_type } = data;
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

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
        author: {
          name: `New Leak File`,
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
 // dont need an embed url for anti copyright post command
     if (file_type === "kraken-link") {
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
        // embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      const actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });

      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Leak File: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Leak File Post error`, error);
      }
    } else if (customID.includes(`post_new_ogfile_modal`)) {
      let data = await getPostData(randID);
      console.log(`the data`, data);

      data = data._doc;
      console.log(`the data`, data);
      let { roles, file, file_type } = data;
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

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
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

 // dont need an embed url for anti copyright post command
     if (file_type === "kraken-link") {
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
        // embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      const actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });

      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ OG File: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`OG File Post error`, error);
      }
    } else if (customID.includes(`post_new_studiofiles_modal`)) {
      let data = await getPostData(randID);
      console.log(`the data`, data);

      data = data._doc;
      console.log(`the data`, data);
      let { roles, file, file_type } = data;
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

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
        author: {
          name: `New Studio File(s)`,
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

 // dont need an embed url for anti copyright post command
     if (file_type === "kraken-link") {
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
        // embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      const actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });

      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });
       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Studio Files File: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Studio Files File Post error`, error);
      }
    } else if (customID.includes(`post_new_instrumental_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        description: text || null,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
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
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
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
    } else if (customID.includes(`post_new_accapella_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        description: text || null,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
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

      if (file_type === "kraken-link") {
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
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
    } else if (customID.includes(`post_new_mixedsession_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        description: text || null,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
        author: {
          name: `New Mixed Studio Session`,
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
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Mixed Studio Session: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Mixed Studio Session Post error`, error);
        await throwNewError(
          `Posting [ Mixed Studio Session : ${songName} ]`,
          interaction,
          error
        );
      }
    } else if (customID.includes(`post_new_snippet_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const era = interaction.fields.getTextInputValue("era") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const date = interaction.fields.getTextInputValue("date") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
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
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = songName || "";
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
              await updatePostData(randID, data);
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

//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }

      await updatePostData(randID, { embed: embedObj });

      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });

      try {
        await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });
        await interaction.editReply({
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
    } else if (customID.includes(`post_new_master_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const era = interaction.fields.getTextInputValue("era") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
        author: {
          name: `New Master`,
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

      if (era !== null) {
        fields.push({
          name: `Era`,
          value: `${era}`,
          inline: true,
        });
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

      if (file_type === "kraken-link") {
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Master: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Master Post error`, error);
        await throwNewError(
          `Posting [ Master : ${songName} ]`,
          interaction,
          error
        );
      }
    } else if (customID.includes(`post_new_edit_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        description: text || null,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
        author: {
          name: `New Edit`,
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
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Edit: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Edit Post error`, error);
        await throwNewError(
          `Posting [ Edit : ${songName} ]`,
          interaction,
          error
        );
      }
    } else if (customID.includes(`post_new_remaster_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;

      const songName = interaction.fields.getTextInputValue("name") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        description: text || null,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
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
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Remaster: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Remaster Post error`, error);
        await throwNewError(
          `Posting [ Accapella : ${songName} ]`,
          interaction,
          error
        );
      }
    } else if (customID.includes(`post_new_stemedit_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        description: text || null,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
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
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Stem Edit: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Stem Edit Post error`, error);
        await throwNewError(
          `Posting [ Accapella : ${songName} ]`,
          interaction,
          error
        );
      }
    } else if (customID.includes(`post_new_magicaledit_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        description: text || null,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
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
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Magical Edit: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Magical Edit Post error`, error);
        await throwNewError(
          `Posting [ Accapella : ${songName} ]`,
          interaction,
          error
        );
      }
    } else if (customID.includes(`post_new_slowreverb_modal`)) {
      let data = await getPostData(randID);
      let { roles, file, file_type } = data;
      const songName = interaction.fields.getTextInputValue("name") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const altname = interaction.fields.getTextInputValue("altname") || null;
      const producer = interaction.fields.getTextInputValue("producer") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;

      const role = roleString(roles);
      let embedObj = {
        title: `${songName}`,
        description: text || null,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
        author: {
          name: `New Slowed & Reverb Edit`,
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
        let krakLink = interaction.fields.getTextInputValue("kraken") || null;
        let theName = interaction.fields.getTextInputValue("name") || "";
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
              await updatePostData(randID, data);
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
//        embedObj.url = krakFile ? krakFile : krakLink ? krakLink : null;
      } else {
//        embedObj.url = file.attachment || null;
      }

      if (fields.length > 0) {
        embedObj.fields = fields;
      }
      await updatePostData(randID, { embed: embedObj });
      const embed = createEmb.createEmbed(embedObj);

      const directMessageButton = await createBtn.createButton({
        label: `Save via DM's`,
        style: "success",
        customID: `direct_message_${randID}`,
        emoji: "📮",
      });

      let actionRow = await createActRow.createActionRow({
        components: [directMessageButton],
      });
      try {
       await interaction.channel.send({
          content: `${`|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName !== null ? `Song Name : ${songName}` : ""}${
            file.name && file.name !== songName
              ? `\nFile Name : ${file.name}`
              : ""
          }${altname !== null ? `\nAlternate Name(s) : ${altname}` : ""} ||`}`,
          embeds: [embed],
          components: [actionRow],
        });

       await  interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [ Slowed & Reverb Edit: ${songName} ]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Slowed & Reverb Edit Post error`, error);
        await throwNewError(
          `Posting [ Accapella : ${songName} ]`,
          interaction,
          error
        );
      }
    } else if (customID.includes(`post_new_rando_audio_modal`)) {
      const data = await getPostData(randID);
      const { roles, file, file_type } = data;

      if (file_type === "kraken-link") {
        const krakLink = interaction.fields.getTextInputValue("kraken");
        const theName = interaction.fields.getTextInputValue("title") || "";
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

        file.name = theName;
        file.attachment =
          krakFile ||
          `https://media4.giphy.com/media/8L0Pky6C83SzkzU55a/giphy.gif?cid=ecf05e47mactcs5z03dril6i1ffrxb7tfkukvayujqxuql2i&rid=giphy.gif&ct=g`;
        file.url = krakLink || null;

        try {
          await updatePostData(randID, { file });
        } catch (error) {
          await throwNewError(
            "updating the kraken file elements to the db",
            interaction,
            error
          );
        }
      }

      const songName = interaction.fields.getTextInputValue("title") || null;
      const text = interaction.fields.getTextInputValue("text") || null;
      const kraken = interaction.fields.getTextInputValue("kraken") || null;
      const role = roleString(roles);

      const embedObj = {
        title: songName,
        color: scripts.getColor(),
        thumbnail: interaction.guild.iconURL(),
        description: text,
        author: {
          name: "New Audio File",
          icon_url: scripts.getJuice(),
        },
        url: file.attachment,
      };

      await updatePostData(randID, { embed: embedObj });

      try {
        await interaction.channel.send({
          content: `|| ${
            role.length > 1 ? `${scripts_djs.getAlertEmoji()} ${role}\n` : ""
          }${songName ? `Song Name: ${songName}\n` : ""}${
            file.name ? `File Name: ${file.name}\n` : ""
          }${text ? `More Info: ${text}` : ""} ||`,
          embeds: [createEmb.createEmbed(embedObj)],
          components: [
            await createActRow.createActionRow({
              components: [
                await createBtn.createButton({
                  label: `Save via DM's`,
                  style: "success",
                  customID: `direct_message_${randID}`,
                  emoji: "📮",
                }),
              ],
            }),
          ],
        });

        await interaction.editReply({
          embeds: [
            createEmb.createEmbed({
              title: `Sent [Audio File: ${songName}]`,
            }),
          ],
        });
      } catch (error) {
        console.log(`Audio File Post error`, error);
        await throwNewError(
          `Posting [Audio File: ${songName}]`,
          interaction,
          error
        );
      }
    }
  }
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("new")
    .setDescription(
      "Files must be less than server mb limit or posted via Kraken Link"
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.AttachFiles)
    .addSubcommandGroup((group) =>
      group
        .setName("kraken-link")
        .setDescription("Choose the type of file you are posting")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("audio")
            .setDescription("Audio File Posted (via Kraken Link)")
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription(
                  "What category does this audio file fall under?"
                )
                .setRequired(true)
                .addChoices(
                  { name: "Leak", value: "leak" },
                  { name: "OG File", value: "ogfile" },
                  { name: "Master", value: "master" },
                  { name: "Instrumental", value: "instrumental" },
                  { name: "Accapella", value: "accapella" },
                  { name: "Edit", value: "edit" },
                  { name: "Mixed Studio Session", value: "mixedsession" },
                  { name: "Studio Files", value: "studiofiles" },
                  { name: "Snippet", value: "snippet" },
                  { name: "Remaster", value: "remaster" },
                  { name: "Stem Edit", value: "stemedit" },
                  { name: "Magical Edit", value: "magicaledit" },
                  { name: "Slowed & Reverb", value: "slowreverb" },
                  { name: "Random", value: "rando" }
                )
            )
            .addRoleOption((opt) =>
              opt
                .setName("role1")
                .setDescription("Optional Additional roles to tag")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role2")
                .setDescription("Optional Additional roles to tag")
            )
        )
    )
    .addSubcommandGroup((group) =>
      group
        .setName("attachment")
        .setDescription("Choose the type of file you are posting")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("audio")
            .setDescription("Audio File Posted (via attachment)")
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription(
                  "What category does this audio file fall under?"
                )
                .setRequired(true)
                .addChoices(
                  { name: "Leak", value: "leak" },
                  { name: "OG File", value: "ogfile" },
                  { name: "Master", value: "master" },
                  { name: "Instrumental", value: "instrumental" },
                  { name: "Accapella", value: "accapella" },
                  { name: "Edit", value: "edit" },
                  { name: "Mixed Studio Session", value: "mixedsession" },
                  { name: "Studio Files", value: "studiofiles" },
                  { name: "Snippet", value: "snippet" },
                  { name: "Remaster", value: "remaster" },
                  { name: "Stem Edit", value: "stemedit" },
                  { name: "Magical Edit", value: "magicaledit" },
                  { name: "Slowed & Reverb", value: "slowreverb" },
                  { name: "Random", value: "rando" }
                )
            )
            .addAttachmentOption((option) =>
              option
                .setName("attachment")
                .setDescription("The file to post")
                .setRequired(true)
            )
            .addRoleOption((opt) =>
              opt
                .setName("role1")
                .setDescription("Optional Additional roles to tag")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role2")
                .setDescription("Optional Additional roles to tag")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("video")
            .setDescription("Video File Posted (via attachment)")
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription("What type of Video are you sharing?")
                .setRequired(true)
                .addChoices(
                  { name: "Snippet", value: "snippet" },
                  { name: "Random", value: "rando" }
                )
            )
            .addAttachmentOption((option) =>
              option
                .setName("attachment")
                .setDescription("The file to post")
                .setRequired(true)
            )
            .addRoleOption((opt) =>
              opt
                .setName("role1")
                .setDescription("Optional Additional roles to tag")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role2")
                .setDescription("Optional Additional roles to tag")
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("image")
            .setDescription("Image File Posted (via attachment)")
            .addStringOption((option) =>
              option
                .setName("type")
                .setDescription("What type of Image are you sharing?")
                .setRequired(true)
                .addChoices(
                  { name: "Cover Art", value: "coverart" },
                  { name: "Random", value: "rando" }
                )
            )
            .addAttachmentOption((option) =>
              option
                .setName("attachment")
                .setDescription("The file to post")
                .setRequired(true)
            )
            .addRoleOption((opt) =>
              opt
                .setName("role1")
                .setDescription("Optional Additional roles to tag")
            )
            .addRoleOption((opt) =>
              opt
                .setName("role2")
                .setDescription("Optional Additional roles to tag")
            )
        )
    ),

  async execute(interaction) {
      //     try {
      //   await interaction.deferReply({ ephemeral: true });
      // } catch (error) {
      //   if (error.message.includes(`Unknown interaction`)) {
      //     console.log(
      //       `An unknown Interaction was Logged\nInteraction User ${interaction?.user?.username}`
      //     ); // <:android:1083158839957921882>
      //     return;
      //   } else {
      //     return console.log(error);
      //   }
      // }
    if (!client.connectedToMongoose) {

      return await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            description: `This command have been turned \`OFF\` Due to a disconnect with the Database Server\n\n\n**Run \`/reconnect\` to force a reconnection to the database**\nIf no luck after multiple attempts, Request Steve Jobs Restart the Bot to restore filtration abilities`,
          }),
        ],
      });
    }
    const { options } = interaction;
    const format = options.getSubcommand();
    const file_type = options.getSubcommandGroup();
    //   const target = options.getChannel("target-channel");
    const type = options.getString("type");
    const file = options.getAttachment("attachment");
    const userId = interaction.user.id;
    const user = interaction.user;
    const role1 = options.getRole("role1");
    const role2 = options.getRole("role2");
    const roles = [role1 ? role1 : null, role2 ? role2 : null];
    let modalObj, modal;
    let randID = scripts_djs.getRandID();
    if (file) {
      if (
        file.contentType === "application/zip" &&
        file_type !== "kraken-link"
      ) {
        // file.contentType = 'audio/mpeg' || 'application/zip' || 'video/mp4' || 'image/jpeg' || 'image/png' || 'image/gif'
        return await interaction.reply({
          ephemeral: true,
          embeds: [
            createEmb.createEmbed({
              color: scripts.getErrorColor(),
              title: "⚠️ Error",
              description:
                "In Order to Send a **__.Zip__** file, you need to send the zip file via a **Kraken Link Only**, Not an attachment\nAfter creating the link, redo the command and select the kraken link option as apposed to the attachment option\n> Do Not Use A WeTranser Link b/c the Bot is only setup for Kraken File Links",
              timestamp: new Date(),
            }),
          ],
        });
      }
    }
    // extract the file info and also determine if the file is over or under 8mb, then place all that info into an obj to use moving forward
    // let file, userId, user, type, format, file_type, interaction;
    const optionsObj = {
      file,
      userId,
      user,
      type, // leak, ogfile, master, instrumental, accapella, edit, mixedsession, studiofiles, snippet, remaster, stemedit, magicaledit, slowreverb, rand
      format,
      file_type, // kraken-link or attachment
      interaction,
      roles,
      randID,
    };
    // save the data to the db
    let obj = {
      file: optionsObj.file ? optionsObj.file : null,
      userId: optionsObj.userId ? optionsObj.userId : null,
      user: optionsObj.user ? optionsObj.user : null,
      type: optionsObj.type ? optionsObj.type : null,
      format: optionsObj.format ? optionsObj.format : null,
      file_type: optionsObj.file_type ? optionsObj.file_type : null,
      interactionID: optionsObj.interaction ? optionsObj.interaction : null,
      roles: optionsObj.roles ? optionsObj.roles : null,
      randID: optionsObj.randID ? optionsObj.randID : null,
    };

    savePostData(obj).then(async () => {
      switch (format) {
        case "image":
          if (type === "coverart") {
            // do cover art things
            // Modal Object that gets passed in below
            modalObj = {
              customID: `post_new_coverart_modal${randID}`,
              title: "Cover Art Post Survey",
              inputFields: [
                {
                  customID: "name",
                  label: "What song is this cover art for?",
                  style: "TextInputStyle.Short",
                  placeholder: "Song Name",
                  required: true,
                },
                {
                  customID: "artist",
                  label: "Who is the artist?",
                  style: "TextInputStyle.Short",
                  placeholder: "Artist Name",
                  required: false,
                },
                {
                  customID: "artistsocial",
                  label: "Artist's Social Media Link",
                  style: "TextInputStyle.Short",
                  placeholder: "instagram.com/artistname",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
                try {
       await interaction.showModal(modal);
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
          }

          if (type === "rando") {
            // do random image things
            // Modal Object that gets passed in below
            modalObj = {
              customID: `post_new_rando_image_modal${randID}`,
              title: "Post Random Image Survey",
              inputFields: [
                {
                  customID: "title",
                  label: "Whats the title of this image?",
                  style: "TextInputStyle.Short",
                  placeholder: "Song Name",
                  required: false,
                },
                {
                  customID: "text",
                  label: "Any additional text you want to add?",
                  style: "TextInputStyle.Long",
                  placeholder: "Extra Extra Read All About It!",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
                try {
       await interaction.showModal(modal);
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
          }
          // do image things

          break;
        case "video":
          if (type === "snippet") {
            // do video snippet things
            // Modal Object that gets passed in below
            modalObj = {
              customID: `post_new_snippet_modal_vid${randID}`,
              title: "Snippet Post Survey",
              inputFields: [
                {
                  customID: "name",
                  label: "What song is this snippet for?",
                  style: "TextInputStyle.Short",
                  placeholder: "Song Name",
                  required: true,
                },
                {
                  customID: "text",
                  label: "Other info about the snippet?",
                  style: "TextInputStyle.Long",
                  placeholder: "Recently discovered snippet from 2017",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
                try {
       await interaction.showModal(modal);
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
          }

          if (type === "rando") {
            // do random video things
            // Modal Object that gets passed in below
            modalObj = {
              customID: `post_new_rando_video_modal${randID}`,
              title: "Random Video Post Survey",
              inputFields: [
                {
                  customID: "title",
                  label: "Title for the video",
                  style: "TextInputStyle.Short",
                  placeholder: "video title",
                  required: false,
                },
                {
                  customID: "text",
                  label: "Other info about the video?",
                  style: "TextInputStyle.Long",
                  placeholder: "video of juice from his last concert in 2019",
                  required: false,
                },
              ],
            };
            // Create the modal
            modal = await createModal.createModal(modalObj);
            // Show the modal
                try {
       await interaction.showModal(modal);
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
          }
          // do video things
          break;
        case "audio":
          if (file_type === "attachment") {
            switch (type) {
              case "leak":
                // do leak things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_leak_modal_a${randID}`,
                  title: "New Leak Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "ogfile":
                // do og file things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_ogfile_modal_a${randID}`,
                  title: "New OG File Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "master":
                // do master things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_master_modal_a${randID}`,
                  title: "New Master Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "instrumental":
                // do instrumental things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_instrumental_modal_a${randID}`,
                  title: "Instrumental Survey",
                  inputFields: [
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Instrumental",
                      style: "TextInputStyle.Long",
                      placeholder:
                        "Special thanks to @lostleaks999 for the hi hats",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "accapella":
                // do acappella things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_accapella_modal_a${randID}`,
                  title: "Accapella Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "mixedsession":
                // do mixed studio session things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_mixedsession_modal_a${randID}`,
                  title: "New Mixed Studio Session Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "studiofiles":
                // do mixed studio session things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_studiofiles_modal_a${randID}`,
                  title: "New Studio Files Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;

              case "edit":
                // do mixed studio session things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_edit_modal_a${randID}`,
                  title: "New Edit Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Edit",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "snippet":
                // do snippet things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_snippet_modal_a${randID}`,
                  title: "New Snippet Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "remaster":
                // do remaster things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_remaster_modal_a${randID}`,
                  title: "Remaster Survey",
                  inputFields: [
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "stemedit":
                // do stem edit things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_stemedit_modal_a${randID}`,
                  title: "Stem Edit Survey",
                  inputFields: [
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "magicaledit":
                // do magical edit things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_magicaledit_modal_a${randID}`,
                  title: "Magical Edit Survey",
                  inputFields: [
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "slowreverb":
                // do slowed & reverb things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_slowreverb_modal_a${randID}`,
                  title: "Slowed & Reverb Survey",
                  inputFields: [
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "rando":
                // do random audio things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_rando_audio_modal_a${randID}`,
                  title: "Random Audio Post Survey",
                  inputFields: [
                    {
                      customID: "title",
                      label: "Title for the audio",
                      style: "TextInputStyle.Short",
                      placeholder: "Song Name",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Other info/text about the audio?",
                      style: "TextInputStyle.Long",
                      placeholder: "unreleased feature from Ally Lotti",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              default:
                // do default things
                break;
            }
          } else if (file_type === "kraken-link") {
            switch (type) {
              case "leak":
                // do leak things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_leak_modal${randID}`,
                  title: "New Leak Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "ogfile":
                // do og file things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_ogfile_modal${randID}`,
                  title: "New OG File Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "master":
                // do master things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_master_modal${randID}`,
                  title: "New Master Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "studiosession":
                // do studio session things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_studiosession_modal${randID}`,
                  title: "New Studio Session Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "instrumental":
                // do instrumental things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_instrumental_modal${randID}`,
                  title: "Instrumental Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Instrumental",
                      style: "TextInputStyle.Long",
                      placeholder:
                        "Special thanks to @lostleaks999 for the hi hats",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "accapella":
                // do acappella things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_accapella_modal${randID}`,
                  title: "Accapella Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "mixedsession":
                // do mixed studio session things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_mixedsession_modal${randID}`,
                  title: "New Mixed Studio Session Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "studiofiles":
                // do mixed studio session things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_studiofiles_modal${randID}`,
                  title: "New Studio Files Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;

              case "edit":
                // do mixed studio session things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_edit_modal${randID}`,
                  title: "New Edit Survey",
                  inputFields: [
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Edit",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "kraken",
                      label: "Optional: If you want to add the kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "snippet":
                // do snippet things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_snippet_modal${randID}`,
                  title: "New Snippet Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "era",
                      label: "What is the era of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "DRFL",
                      required: false,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight\nAdore U",
                      required: false,
                    },
                    {
                      customID: "date",
                      label: "What date was the song leaked?",
                      style: "TextInputStyle.Short",
                      placeholder: "Oct 25, 2021",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "remaster":
                // do remaster things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_remaster_modal${randID}`,
                  title: "Remaster Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "stemedit":
                // do stem edit things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_stemedit_modal${randID}`,
                  title: "Stem Edit Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "magicaledit":
                // do magical edit things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_magicaledit_modal${randID}`,
                  title: "Magical Edit Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "slowreverb":
                // do slowed & reverb things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_slowreverb_modal${randID}`,
                  title: "Slowed & Reverb Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "producer",
                      label: "Mixed By",
                      style: "TextInputStyle.Short",
                      placeholder: "@stevejobs",
                      required: false,
                    },
                    {
                      customID: "name",
                      label: "What is the name of the song?",
                      style: "TextInputStyle.Short",
                      placeholder: "Adore You",
                      required: true,
                    },
                    {
                      customID: "altname",
                      label: "Any alternate names for the song?",
                      style: "TextInputStyle.Long",
                      placeholder: "Dark Knight",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Additional Information About The Accapella",
                      style: "TextInputStyle.Long",
                      placeholder: "extra shit",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              case "rando":
                // do random audio things
                // Modal Object that gets passed in below
                modalObj = {
                  customID: `post_new_rando_audio_modal${randID}`,
                  title: "Random Audio Post Survey",
                  inputFields: [
                    {
                      customID: "kraken",
                      label: "Provide 1 kraken link",
                      style: "TextInputStyle.Short",
                      placeholder:
                        "https://krakenfiles.com/view/stevejobswashere.lol",
                      required: true,
                    },
                    {
                      customID: "title",
                      label: "Title for the audio",
                      style: "TextInputStyle.Short",
                      placeholder: "Song Name",
                      required: false,
                    },
                    {
                      customID: "text",
                      label: "Other info/text about the audio?",
                      style: "TextInputStyle.Long",
                      placeholder: "unreleased feature from Ally Lotti",
                      required: false,
                    },
                  ],
                };
                // Create the modal
                modal = await createModal.createModal(modalObj);
                // Show the modal
                    try {
       await interaction.showModal(modal);
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
                break;
              default:
                // do default things
                break;
            }
          }
          break;
        default:
          // do default
          break;
      }
    });
  },
};
