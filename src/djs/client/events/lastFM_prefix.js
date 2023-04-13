const client = require(`../../index.js`);
const lastFM = require("../../functions/lastFMFunctions/functions.js")


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


          if ([`tt`,`ttr`,`tracks`,`toptracks`].includes(calledcmd)) {
            if(calledcmd === `ttt` || calledcmd === `toptentracks`) return;
            await lastFM.tracks(m, args);
          }

          if ([`ttt`,`toptentracks`].includes(calledcmd)) {
           
            await lastFM.toptentracks(m, args);
          }



      }






  });

}
