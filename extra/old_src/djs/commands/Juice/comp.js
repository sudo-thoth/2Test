const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require("discord.js");
  const createModal = require("../../functions/create/createModal.js");
  const client = require(`../../index.js`);
  const createEmbed = require("../../functions/create/createEmbed.js");
  const createActRow = require("../../functions/create/createActionRow.js");
  const createbtn = require("../../functions/create/createButton.js");
  const scripts = require("../../functions/scripts/scripts.js")
  const scripts_djs = require("../../functions/scripts/scripts_djs.js");
  const scripts_mongoDB = require("../../functions/scripts/scripts_mongoDB.js");
  const { timestamp } = require("rxjs");
  
  
  module.exports = {
    data: new SlashCommandBuilder()
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
      .setName("comp")
      .setDescription("Files must be less than server mb limit or posted via Kraken Link")
      .addStringOption((option) =>
              option
                .setName("link")
                .setDescription(
                  "Paste the Link to the Comp"
                )
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("title")
                .setDescription(
                  "Give the Comp a Title"
                )
                .setRequired(true)
            )
            .addStringOption((option) =>
              option
                .setName("password")
                .setDescription(
                  "IF the comp is decrypted, please enter the key here"
                )
                .setRequired(false)
            )
            .addStringOption((option) =>
              option
                .setName("info")
                .setDescription(
                  "Additional Info about the Comp"
                )
                .setRequired(false)
            ),
  
    async execute(interaction) {
      // try {
      await interaction.deferReply({ ephemeral: true });
      // } catch (error) {
      //   scripts.logError(error, `error deferring reply`);
      // }
      const { options } = interaction;
       const comp = options.getString("link");
  
       const domain = scripts.getDomain(comp);
       if (!domain) {
        await interaction.editReply({
          embeds: [createEmbed.createEmbed({color: scripts.getErrorColor(),
            title: "❗️ Invalid Link Entered",
            description: "Please enter a valid Link & Try Again",
            footer: {
              text: "If you think this is a mistake, please contact Steve Jobs",
            },
          })],
        });
        return;
      }
      let compHost;
      if (domain.includes("mega")){
        compHost = "mega";
      } else if (domain.includes("google")) {
        compHost = "google";
      } else {
        compHost = "unknown";
      } 
      const key = options.getString("password");
      const title = options.getString("title");
      const info = options.getString("info");
      const userId = interaction.user.id;
      const user = interaction.user;
      const channel = interaction.channel;
      let randID = `#${Math.floor(Math.random() * 90000) + 10000}`;
  
      const megaPfp = "https://media.discordapp.net/attachments/1071240376947572776/1078940016698474506/873133.png";
      const lockedmegaThumbnail = 'https://icons.iconarchive.com/icons/papirus-team/papirus-places/128/folder-red-private-icon.png'
      const megaThumbnail = "https://images-ext-1.discordapp.net/external/WPPhZ2SaES_kjPXVrEZAL7Id1bYEzIfNGTHERvAHCWE/https/icons.iconarchive.com/icons/papirus-team/papirus-places/128/folder-red-mega-icon.png";
      const gdrivePfp = "https://images-ext-1.discordapp.net/external/Hzj6r5PJAYtQJx5yoa_V6HglznoDDqjk7Niumo6cgoo/https/img.freepik.com/premium-vector/google-drive-logo_578229-303.jpg";
      const lockedgdriveThumbnail = 'https://icons.iconarchive.com/icons/papirus-team/papirus-places/128/folder-blue-private-icon.png'
      const gdriveThumbnail = "https://images-ext-1.discordapp.net/external/sxnbyZye5urkXOyfbykusArFOZqotGf5Km_dIfxJrLY/https/icons.iconarchive.com/icons/papirus-team/papirus-places/128/folder-blue-google-drive-icon.png";
      const unknownThumbnail = () => {
        let images = [''];
        return scripts.getRand(images)
      }
      // construct the embed objs for each a mega comp, google drive comp, and an unknown host comp
      // no button is present in the message unless there is a password aka key present, if so the button will be present : button action is an ephemeral response with the key in a neat black embed
      const megaEmbObj = {
        color: scripts.getErrorColor(),
        author: {
          name: `Mega Comp`,
          iconURL: megaPfp,
        },
        title: `${title}`,
        thumbnail:  !key ? megaThumbnail : lockedmegaThumbnail,
        description: !key ?  (info ? info : "") : (info ? `${info}\n> This comp is locked\n> View Key Below`  : "> This comp is locked\n> View Key Below"),
        url: comp,
        footer: {
          text: `Shared by ${user.username}`,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        },
        timestamp: new Date()
      }
      const gdriveEmbObj = {
        color: "Blue",
        author: {
          name: `Google Drive Comp`,
          iconURL: gdrivePfp,
        },
        title: `${title}`,
        thumbnail:  !key ? gdriveThumbnail : lockedgdriveThumbnail,
        description: !key ?  (info ? info : "") : (info ? `${info}\n> This comp is locked\n> View Key Below`  : "> This comp is locked\n> View Key Below"),
        url: comp,
        footer: {
          text: `Shared by ${user.username}`,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        },
        timestamp: new Date()
      }
  
      const unknownEmbObj = {
        color: scripts.getColor(),
        author: {
          name: `Comp`,
          iconURL: "https://media.discordapp.net/attachments/1071240376947572776/1078937185396477995/images.png",
        },
        title: `${title}`,
        thumbnail: "https://media.discordapp.net/attachments/1071240376947572776/1078937185203531946/preview_copy.png",
        description: !key ?  (info ? info : "") : (info ? `${info}\n> This comp is locked\n> View Key Below`  : "> This comp is locked\n> View Key Below"),
        url: comp,
        timestamp: new Date(),
        footer: {
          text: `Shared by ${user.username}`,
          iconURL: user.displayAvatarURL({ dynamic: true }),
        },
      }
      // construct the button obj for the key button
      const buttonObj = {
        customID: `comp_key${randID}`,
        label: "Key",
        style: "DANGER",
        emoji: `🔐`,
      };
      // construct the embed obj for the button
  
      let saveInfoObj = {
        comp: comp,
        title: title,
        info: info,
        key: key,
        userID: userId,
        username: user.username,
        user: user,
        randID: randID,
        buttonObj: buttonObj,
        embedObj: compHost === "mega" ? megaEmbObj : compHost === "google" ? gdriveEmbObj : unknownEmbObj,
        compHost: compHost,
      }
  
      try {
        await scripts_mongoDB.saveCompData(saveInfoObj);
      } catch (error) {
        await interaction.editReply({
          embeds: [createEmbed.createEmbed({
            title: `❗️ Error Occured - Share with Steve Jobs`,
            description:
                  `__While :__ \`Sharing Comp\`\n` +
                  "```js\n" +
                  error +
                  "```",
            color: scripts.getErrorColor(),
          })]
        });
      }
  
      const embed = compHost === "mega"? createEmbed.createEmbed(megaEmbObj) : compHost === "google"? createEmbed.createEmbed(gdriveEmbObj) : createEmbed.createEmbed(unknownEmbObj);
  
      const messageObj = !key ? { embeds: [embed] } : { embeds: [embed], components: [await createActRow.createActionRow({components: [await createbtn.createButton(buttonObj)]})] };
  try {
        await interaction.channel.send(messageObj);
  
        try {
          return await interaction.editReply({
            embeds: [createEmbed.createEmbed({
              title: `✅ Comp Shared Successfully`,
              color: scripts.getSuccessColor(),
            })]
          })
        } catch (error) {
          console.log(error);
        }
  } catch (error) {
    return await interaction.editReply({
      embeds: [createEmbed.createEmbed({
        title: `❗️ Error Occured - Share with Steve Jobs`,
        description:
              `__While :__ \`Sharing Comp\`\n` +
              "```js\n" +
              error +
              "\n```\n" +
              `Error Report Summary:` +
              "\n```js\n" +
              `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}\nMessage ID: ${interacton.message ?  interaction.message.id : `N/A`}\nCustom ID: ${interaction.customID}` +
              "\n```",
        color: scripts.getErrorColor(),
      })]
    })
  }
  
  
  
    },
  };
  