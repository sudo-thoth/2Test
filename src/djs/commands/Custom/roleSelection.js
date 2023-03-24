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
    .setName("role-selection")
    .setDescription("role selection buttons")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    // await interaction.deferReply({ ephemeral: true });
    const randID = scripts_djs.getRandID();
    // upon execution of the command, the user is shown a modal that gathers the gb name, the total amount of price needed, the current amount of money raised
    // use #ffcb6b as the embed color

    const roleHubEmbed = createEmb.createEmbed({
      title: `Juice WRLD Role Selection`,
      color: `#7d1702`,
      image: `https://media.tenor.com/7a89EbuwecMAAAAC/juice-wrld-ewaste999.gif`
      // ...
    });    
    const zzzroleHubEmbed = createEmb.createEmbed({
      title: `Zzz. Role Selection`,
      color: `#8034eb`,
      image: `https://media.discordapp.net/attachments/1088348924575744060/1088665026421854228/ezgif.com-video-to-gif.gif`
      // ...
    });




    if (interaction.guild.id === "1074125896698581104") { // Biscotti
      const leaks = await createButtn.createButton({ // 
        customID: `role_999leaks_${interaction.guild.name}${randID}`,
        label: "Leaks",
        style: "secondary",
        disabled: false,
        emoji: "<a:yyhooddiscordmusic:1005733546608046140>",
      });
      const ogfiles = await createButtn.createButton({
        customID: `role_999ogfiles_${interaction.guild.name}${randID}`,
        label: "OG Files",
        style: "secondary",
        disabled: false,
        emoji: "<:12413807531579155689128:1086967253368586300> ",
      });
      const snippets = await createButtn.createButton({
        customID: `role_999snippets_${interaction.guild.name}${randID}`,
        label: "Snippets",
        style: "secondary",
        disabled: false,
        emoji: "<:999snips:1088658998892449873> ",
      });
      const sessions = await createButtn.createButton({
        customID: `role_999sessions_${interaction.guild.name}${randID}`,
        label: "Sessions",
        style: "secondary",
        disabled: false,
        emoji: "<:999sessions:1088658303975952534>",
      });
      const compupdates = await createButtn.createButton({
        customID: `role_999compupdates_${interaction.guild.name}${randID}`,
        label: "Comp",
        style: "secondary",
        disabled: false,
        emoji: "<:999comp:1088656060568588378>",
      });
      const news = await createButtn.createButton({
        customID: `role_999news_${interaction.guild.name}${randID}`,
        label: "News",
        style: "secondary",
        disabled: false,
        emoji: "<:news:1088654777702961213>",
      });
      const groupbuys = await createButtn.createButton({
        customID: `role_gbupdates_${interaction.guild.name}${randID}`,
        label: "Group Buys",
        style: "secondary",
        disabled: false,
        emoji: "<:MoneyBag:1056781474516455504>",
      });
      const releases = await createButtn.createButton({
        customID: `role_999officialreleases_${interaction.guild.name}${randID}`,
        label: "Official Releases",
        style: "secondary",
        disabled: false,
        emoji: "<:IconAppleMusic:1072792802250985522> ",
      });
      const chatrevive = await createButtn.createButton({
        customID: `role_chatrevive_${interaction.guild.name}${randID}`,
        label: "Chat Revive",
        style: "secondary",
        disabled: false,
        emoji: "<:ppl:1088655139495231568>",
      });
      const giveaways = await createButtn.createButton({
        customID: `role_giveaways_${interaction.guild.name}${randID}`,
        label: "Giveaways",
        style: "secondary",
        disabled: false,
        emoji: "<a:Giveaways:1052611718519459850>",
      });


      // Zzz. /////////////////////////////////////////////
      const z_leaks = await createButtn.createButton({ // 
        customID: `role_zzzleaks_${interaction.guild.name}${randID}`,
        label: "Leaks",
        style: "secondary",
        disabled: false,
        emoji: "<:music:1070063741913276447> ",
      });
      const z_snippets = await createButtn.createButton({
        customID: `role_zzzsnippets_${interaction.guild.name}${randID}`,
        label: "Snippets",
        style: "secondary",
        disabled: false,
        emoji: "<:zzzsnips:1088658993028792360>",
      });
      const z_sessions = await createButtn.createButton({
        customID: `role_zzzsessions_${interaction.guild.name}${randID}`,
        label: "Sessions",
        style: "secondary",
        disabled: false,
        emoji: "<:zzzsessions:1088658302918983701> ",
      });
      const z_compupdates = await createButtn.createButton({
        customID: `role_zzzcompupdates_${interaction.guild.name}${randID}`,
        label: "Comp",
        style: "secondary",
        disabled: false,
        emoji: "<:zzzcomp:1088656058261721261>",
      });
      const z_news = await createButtn.createButton({
        customID: `role_zzznews_${interaction.guild.name}${randID}`,
        label: "News",
        style: "secondary",
        disabled: false,
        emoji: "<:news:1088654777702961213>",
      });
      const z_releases = await createButtn.createButton({
        customID: `role_zzzofficialreleases_${interaction.guild.name}${randID}`,
        label: "Official Releases",
        style: "secondary",
        disabled: false,
        emoji: "<:Spotify:1074720594182025216>",
      });

      /////////////////////////////////////////////
      const row1 = await createActRow.createActionRow({
        components: [leaks, ogfiles, sessions, snippets],
      });
      const row2 = await createActRow.createActionRow({
        components: [compupdates, releases, groupbuys, news],
      });
      const row3 = await createActRow.createActionRow({
        components: [ giveaways, chatrevive],
      });
  
      const hub = {
        embeds: [roleHubEmbed],
        components: [row1, row2],
      };
      const serverhub = {
        embeds: [],
        components: [row3],
      };
      const z_row1 = await createActRow.createActionRow({
        components: [z_leaks,z_snippets, z_sessions],
      });
      const z_row2 = await createActRow.createActionRow({
        components: [z_compupdates, z_releases, z_news],
      });

  
      const z_hub = {
        embeds: [zzzroleHubEmbed],
        components: [z_row1, z_row2],
      };
    try {

        await interaction.channel.send(z_hub);
      } catch (error) {
        await throwNewError("sending role selection Zzz. hub", interaction, error);
      }

      try {
        await interaction.channel.send(hub);
      } catch (error) {
        await throwNewError("sending role selection hub", interaction, error);
      }
      try {

          await interaction.channel.send(serverhub);
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
      } else if (interaction.guild.id === "1080667995287867484") { // NLMB
      const leaks = await createButtn.createButton({
        customID: `role_leaks_${interaction.guild.name}${randID}`,
        label: "Leaks",
        style: "danger",
        disabled: false,
        emoji: "🎶",
      });
      const ogfiles = await createButtn.createButton({
        customID: `role_ogfiles_${interaction.guild.name}${randID}`,
        label: "OG Files",
        style: "danger",
        disabled: false,
        emoji: "🎵",
      });
      const snippets = await createButtn.createButton({
        customID: `role_snippets_${interaction.guild.name}${randID}`,
        label: "Snippets",
        style: "success",
        disabled: false,
        emoji: "🎞️",
      });
      const sessions = await createButtn.createButton({
        customID: `role_sessions_${interaction.guild.name}${randID}`,
        label: "Sessions",
        style: "danger",
        disabled: false,
        emoji: "💽",
      });
      // const compupdates = await createButtn.createButton({
      //   customID: `role_compupdates_${interaction.guild.name}${randID}`,
      //   label: "Comp",
      //   style: "primary",
      //   disabled: false,
      //   emoji: "📁",
      // });
      const news = await createButtn.createButton({
        customID: `role_news_${interaction.guild.name}${randID}`,
        label: "News",
        style: "success",
        disabled: false,
        emoji: "📰",
      });
      const groupbuys = await createButtn.createButton({
        customID: `role_groupbuys_${interaction.guild.name}${randID}`,
        label: "Group Buys",
        style: "success",
        disabled: false,
        emoji: "💰",
      });
      const chatrevive = await createButtn.createButton({
        customID: `role_chatrevive_${interaction.guild.name}${randID}`,
        label: "Chat Revive",
        style: "secondary",
        disabled: false,
        emoji: "🫂",
      });
      const giveaways = await createButtn.createButton({
        customID: `role_giveaways_${interaction.guild.name}${randID}`,
        label: "Giveaways",
        style: "secondary",
        disabled: false,
        emoji: "🎉",
      });
      const songoftheday = await createButtn.createButton({
        customID: `role_songoftheday_${interaction.guild.name}${randID}`,
        label: "Song Of The Day",
        style: "secondary",
        disabled: false,
        emoji: "🎼",
      });
      const row1 = await createActRow.createActionRow({
        components: [leaks, ogfiles, sessions],
      });
      const row2 = await createActRow.createActionRow({
        components: [snippets, groupbuys, news],
      });
      const row3 = await createActRow.createActionRow({
        components: [ giveaways, chatrevive, songoftheday],
      });
  
      const hub = {
        embeds: [roleHubEmbed],
        components: [row1, row2, row3],
      };
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

      } else       if (interaction.guild.id === "1078060342439059476") { // Grailed
        const leaks = await createButtn.createButton({
          customID: `role_leaks_${interaction.guild.name}${randID}`,
          label: "Leaks",
          style: "danger",
          disabled: false,
          emoji: "🎶",
        });
        const ogfiles = await createButtn.createButton({
          customID: `role_ogfiles_${interaction.guild.name}${randID}`,
          label: "OG Files",
          style: "danger",
          disabled: false,
          emoji: "🎵",
        });
        const snippets = await createButtn.createButton({ // 1078202074724040735
          customID: `role_snippets_${interaction.guild.name}${randID}`,
          label: "Snippets",
          style: "danger",
          disabled: false,
          emoji: "🎞️",
        });
        const sessions = await createButtn.createButton({
          customID: `role_sessions_${interaction.guild.name}${randID}`,
          label: "Sessions",
          style: "danger",
          disabled: false,
          emoji: "💽",
        });
        const compupdates = await createButtn.createButton({
          customID: `role_compupdates_${interaction.guild.name}${randID}`,
          label: "Comp",
          style: "danger",
          disabled: false,
          emoji: "📁",
        });
        const news = await createButtn.createButton({
          customID: `role_news_${interaction.guild.name}${randID}`,
          label: "News",
          style: "danger",
          disabled: false,
          emoji: "📰",
        });
        const groupbuys = await createButtn.createButton({
          customID: `role_groupbuys_${interaction.guild.name}${randID}`,
          label: "Group Buys",
          style: "danger",
          disabled: false,
          emoji: "💰",
        });
        const chatrevive = await createButtn.createButton({
          customID: `role_chatrevive_${interaction.guild.name}${randID}`,
          label: "Chat Revive",
          style: "danger",
          disabled: false,
          emoji: "🫂",
        });
        const giveaways = await createButtn.createButton({
          customID: `role_giveaways_${interaction.guild.name}${randID}`,
          label: "Giveaways",
          style: "danger",
          disabled: false,
          emoji: "🎉",
        });
        const stemedits =  await createButtn.createButton({
          customID: `role_stemedits_${interaction.guild.name}${randID}`,
          label: "Stem Edits",
          style: "danger",
          disabled: false,
          emoji: "🎚️",
        });
        const sessionedits =  await createButtn.createButton({
          customID: `role_sessionedits_${interaction.guild.name}${randID}`,
          label: "Full Session Edits",
          style: "danger",
          disabled: false,
          emoji: "🎛️",
        });
        const row1 = await createActRow.createActionRow({
          components: [leaks, ogfiles, sessions, snippets],
        });
        const row2 = await createActRow.createActionRow({
          components: [ sessionedits, stemedits, groupbuys],
        });
        const row3 = await createActRow.createActionRow({
          components: [compupdates, news, giveaways, chatrevive,],
        });

        const hub = {
          embeds: [roleHubEmbed],
          components: [row1, row2, row3],
        };
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

      }else if (interaction.guild.id === "1067192024907927562"){ // Vlone Thugs
        
        const leaks = await createButtn.createButton({
          customID: `role_leaks_${interaction.guild.name}${randID}`,
          label: "Leaks",
          style: "danger",
          disabled: false,
          emoji: "🎶",
        });
        // const ogfiles = await createButtn.createButton({
        //   customID: `role_ogfiles_${interaction.guild.name}${randID}`,
        //   label: "OG Files",
        //   style: "danger",
        //   disabled: false,
        //   emoji: "🎵",
        // });
        const snippets = await createButtn.createButton({ // 1078202074724040735
          customID: `role_snippets_${interaction.guild.name}${randID}`,
          label: "Snippets",
          style: "danger",
          disabled: false,
          emoji: "🎞️",
        });
        // const sessions = await createButtn.createButton({
        //   customID: `role_sessions_${interaction.guild.name}${randID}`,
        //   label: "Sessions",
        //   style: "danger",
        //   disabled: false,
        //   emoji: "💽",
        // });
        const compupdates = await createButtn.createButton({
          customID: `role_compupdates_${interaction.guild.name}${randID}`,
          label: "Comp",
          style: "danger",
          disabled: false,
          emoji: "📁",
        });
        const news = await createButtn.createButton({
          customID: `role_news_${interaction.guild.name}${randID}`,
          label: "News",
          style: "danger",
          disabled: false,
          emoji: "📰",
        });
        const groupbuys = await createButtn.createButton({
          customID: `role_groupbuys_${interaction.guild.name}${randID}`,
          label: "Group Buys",
          style: "danger",
          disabled: false,
          emoji: "💰",
        });
        const chatrevive = await createButtn.createButton({
          customID: `role_chatrevive_${interaction.guild.name}${randID}`,
          label: "Chat Revive",
          style: "danger",
          disabled: false,
          emoji: "🫂",
        });
        const giveaways = await createButtn.createButton({
          customID: `role_giveaways_${interaction.guild.name}${randID}`,
          label: "Giveaways",
          style: "danger",
          disabled: false,
          emoji: "🎉",
        });
        // const stemedits =  await createButtn.createButton({
        //   customID: `role_stemedits_${interaction.guild.name}${randID}`,
        //   label: "Stem Edits",
        //   style: "danger",
        //   disabled: false,
        //   emoji: "🎚️",
        // });
        // const sessionedits =  await createButtn.createButton({
        //   customID: `role_sessionedits_${interaction.guild.name}${randID}`,
        //   label: "Full Session Edits",
        //   style: "danger",
        //   disabled: false,
        //   emoji: "🎛️",
        // });
        const row1 = await createActRow.createActionRow({
          components: [leaks,snippets, groupbuys],
        });
        const row2 = await createActRow.createActionRow({
          components: [compupdates, news, giveaways, chatrevive,],
        });

        const hub = {
          embeds: [roleHubEmbed],
          components: [row1, row2],
        };
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
      throw new Error(`Command not executed in the correct server\nRequest for your custom role command to be built`);
    } catch (error) {
    await throwNewError("executing roles command", interaction, error);
    }
  }

  },
};
