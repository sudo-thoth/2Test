const client = require(`../../index.js`);
const snipe = require("../../commands/Community/snipe.js")


if (client) {
  client.on("messageCreate", async (m) => {

    // run checks to see if the feature is on in the database for the messages channel & server
    const channel = m.channel;
    const guild = m.guild;

      if (m.author.bot)  return;

        // the accepted prefixes for the bot are [`,`,`!`,`.`,`+`,`-`,`?`]
        // if the message starts with any of these prefixes, then the bot will continue to process the message
        if(m.content.startsWith(`,`) || m.content.startsWith(`?`) || m.content.startsWith(`.`) || m.content.startsWith(`-`) || m.content.startsWith(`+`) || m.content.startsWith(`!`)){
          let args = m.content.split(" ");
          let cmd = args[0];
          let calledcmd = cmd.substring(1)


          if ([`s`,`snipe`].includes(calledcmd)) {
            let channelData;
    try {
         channelData = await client.setupChannel(m.channel)
        if (!channelData || channelData === null) {
            return await m.reply({
            embeds: [
                createEmb.createEmbed({
                title: `Error`,
                description: `The database has no data for this channel.`,
                color: scripts_djs.getErrorColor(),
                }),
            ],
            ephemeral: true,
            });
        }

    } catch (error) {
        scripts.logError(error, `error getting channel data`);
    }

    const loggedDeletedMessages = channelData?.deletedMessages;

    return snipe.displaySnipes(null, m, loggedDeletedMessages, 0, null);
          }
         

      }






  });

}
