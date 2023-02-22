const {
  SlashCommandBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const createEmb = require("../../functions/create/createEmbed.js");
const createButtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");

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
        `${interaction.commandName ?`Command: \`${interaction.commandName}\`\n` : ""}`+
          "```js\n" +
          err +
          "\n```\n" +
          `Error occurred for admin user:` +
          "\n```js\n" +
          `username: ${interaction.member.user.username}\nID: ${interaction.member.user.id}\nGuild: ${interaction.guild.name}\nGuild ID: ${interaction.guild.id}\nChannel: ${interaction.channel.name}\nChannel ID: ${interaction.channel.id}${interaction.message ?`\nMessage ID: ${interaction.message.id}` : ""}${interaction.customID ?`\nCustom ID: ${interaction.customID}` : ""}` +
          "\n```",
        color: scripts.getErrorColor(),
        footer: {
          text: "Contact STEVE JOBS and Send the Error",
          iconURL: interaction.user.avatarURL(),
        },
      }),],
    });
  }
}
}
module.exports = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("role selection buttons")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    // await interaction.deferReply({ ephemeral: true });
    const randID = scripts_djs.getRandID();
    // upon execution of the command, the user is shown a modal that gathers the gb name, the total amount of price needed, the current amount of money raised
    // use #ffcb6b as the embed color

    const roleHubEmbed = createEmb.createEmbed({
      title: `${interaction.guild.name} Role Selection`,
      color: scripts.getColor(),
      // ...
    });
    const leaks = await createButtn.createButton({
      customID: `role_leaks_${interaction.guild.name}${randID}`,
      label: "Leaks",
      style: "primary",
      disabled: false,
      emoji: "🎶",
    });
    const ogfiles = await createButtn.createButton({
      customID: `role_ogfiles_${interaction.guild.name}${randID}`,
      label: "OG Files",
      style: "primary",
      disabled: false,
      emoji: "🎵",
    });
    const snippets = await createButtn.createButton({
      customID: `role_snippets_${interaction.guild.name}${randID}`,
      label: "Snippets",
      style: "primary",
      disabled: false,
      emoji: "🎞️",
    });
    const sessions = await createButtn.createButton({
      customID: `role_sessions_${interaction.guild.name}${randID}`,
      label: "Sessions",
      style: "primary",
      disabled: false,
      emoji: "💽",
    });
    const compupdates = await createButtn.createButton({
      customID: `role_compupdates_${interaction.guild.name}${randID}`,
      label: "Comp",
      style: "primary",
      disabled: false,
      emoji: "📁",
    });
    const news = await createButtn.createButton({
      customID: `role_news_${interaction.guild.name}${randID}`,
      label: "News",
      style: "primary",
      disabled: false,
      emoji: "📰",
    });
    const groupbuys = await createButtn.createButton({
      customID: `role_groupbuys_${interaction.guild.name}${randID}`,
      label: "Group Buys",
      style: "primary",
      disabled: false,
      emoji: "💰",
    });
    const chatrevive = await createButtn.createButton({
      customID: `role_chatrevive_${interaction.guild.name}${randID}`,
      label: "Chat Revive",
      style: "primary",
      disabled: false,
      emoji: "🫂",
    });
    const giveaways = await createButtn.createButton({
      customID: `role_giveaways_${interaction.guild.name}${randID}`,
      label: "Giveaways",
      style: "primary",
      disabled: false,
      emoji: "🎉",
    });
    const songoftheday = await createButtn.createButton({
      customID: `role_songoftheday_${interaction.guild.name}${randID}`,
      label: "Song Of The Day",
      style: "primary",
      disabled: false,
      emoji: "🎼",
    });

    const row1 = await createActRow.createActionRow({
      components: [leaks, ogfiles, sessions, snippets, groupbuys],
    });
    const row2 = await createActRow.createActionRow({
      components: [news, compupdates, chatrevive, giveaways, songoftheday],
    });

    const hub = {
      embeds: [roleHubEmbed],
      components: [row1, row2],
    };

    if (interaction.guild.id === "1072596593313853570") {

    try {
      try {
        await interaction.channel.send(hub);
      } catch (error) {
        await throwNewError("sending role selection hub", interaction, error);
      }
      await interaction.editReply({
        embeds: [
          createEmb.createEmbed({
            title: "Success",
            description: "Role Selection Hub Posted",
            color: scripts.getSuccessColor(),
          }),
        ],
      });
    } catch (error) {
      await throwNewError(
        "sending success message for role selection hub",
        interaction,
        error
      );
    }

  } else {
    try {
      throw new Error(`Command not executed in the correct server\nThe command is currently set for the WRLD Updates server`);
    } catch (error) {
    await throwNewError("executing roles command", interaction, error);
    }
  }

  },
};
