const { Interaction } = require("discord.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
console.log(`the command`, command)

        if (!command) return

        if (command.data.name !== 'announce') {
	
	        try{
				console.log(`executing command`)
	            await command.execute(interaction, client);
	        } catch (error) {
	            console.log(error);
	            await interaction.channel.send({
	                content: 'There was an error while executing this command!\n' + "```js\n" + error + "\n```",
 
	                
	            });
	        } 
} else {

   // scripts_djs.announce(interaction);

}

    },
    


};