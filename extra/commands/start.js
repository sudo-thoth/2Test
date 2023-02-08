const { SlashCommandBuilder } = require("@discordjs/builders");
const commandName = "start";
const commandDescription = "Generate Kraken Links";

module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`)
    .addIntegerOption((option) =>
          option
            .setName("mins")
            .setDescription("Number of mins of runtime")
            .setRequired(false)
        ).addIntegerOption((option) =>
          option
            .setName("hours")
            .setDescription("Number of hours of runtime")
            .setRequired(false)
        ),
        async execute(interaction) {
          await interaction.deferReply({ ephemeral: true});
          const randomTen = () => {
            // generate a random string thats 10 chars long composed of numbers and letters
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (let i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
           }

    const start = ( duration, i ) =>  {
      let count = 0;
      let string;
      const channel = i.channel;
      const userId = i.user.id;
// if there is no duration, make the endTime 72 hours from now
      const endTime = duration !== null ? Date.now() + duration : Date.now() + 259200000;
      interaction.editReply({content: `Generating Links...`, ephemeral: true})
      for (i = 0; i < 5; i++) {
        let link = `https://krakenfiles.com/view/` + randomTen() + `/file.html\n`;
        string = string ? string + link : link;
        count++;
      }
      channel.send({content: `<@${userId}>\n${string}`});
        
        let intervalId;
        
        intervalId = setInterval(() => {
          
          if (Date.now() >= endTime) return;
          // generate links every 5 minutes
          for (i = 0; i < 5; i++) {
            let link = `https://krakenfiles.com/view/` + randomTen() + `/file.html\n`;
            string = string ? string + link : link;
            count
          }
          interaction.channel.send({content: "test"})
          // send the links to the channel
          channel.send({content: `<@${userId}>\n${string}`});
          
          // 5 minutes in milliseconds is 300000
          count++;
        }, 300000);
            interaction.client.on("interactionCreate", async (interaction) => {
              if (interaction.isChatInputCommand()) {
                if (interaction.commandName === `stop`) {
                  clearInterval(intervalId);
                  console.log(`the start command was stopped by ${interaction.user.username}#${interaction.user.discriminator}`)
                }
              }
            });
        setTimeout(() => {
          // send a message stating Command Complete & the amount of links generated
          channel.send({content: `<@${userId}> - ✅ Command Complete!\n\nGenerated ${count} Links`})
        }, duration);
      }
        const { options } = interaction;
       const minutes = options.getInteger('mins')
       const hours = options.getInteger("hours")
       let master = true;
        const duration = (minutes, hours) => {
           let seconds;
       
           if (minutes) {
              seconds = seconds ? seconds + (minutes * 60) : minutes * 60; 
           }
           
           if (hours) {
              seconds = seconds ? seconds + ((hours * 60) * 60) : (hours * 60) * 60; 
           } 
           
           if (seconds) {
              const milliseconds = seconds * 1000;
              return milliseconds
           } else {
              return null;
           }
       }
           start( duration(minutes, hours),  interaction)
  }



}