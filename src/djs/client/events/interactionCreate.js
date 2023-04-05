const { Interaction } = require("discord.js");
const scripts = require("../../functions/scripts/scripts.js");
const createEmb = require("../../functions/create/createEmbed.js");

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
	            await interaction.user.send({embeds: [createEmb.createEmbed({title: `There was an error while executing this command! - \`${interaction.command?.data?.name}\``, 
                description: `> When? \`${new Date()}\`\n> Server: \` ${interaction.guild.name} - \`||${interaction.guild.id}||\n> Channel: \`${interaction.channel.name} - \`||${interaction.channel.id}||\n${interaction.options ? (interaction.options?.length > 0 ? `> Options: \`${interaction.options}\`\n` : ``):``}\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor()})]});
	        } 
} else {

   // scripts_djs.announce(interaction);

}

    },
    


};