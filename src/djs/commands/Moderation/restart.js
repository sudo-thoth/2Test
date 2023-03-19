const fs = require('fs');
const path = require('path');
const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('restart')
    .setDescription('Restarts the bot.')
    .setDefaultPermission(false)
    .addBooleanOption((option) =>
      option
        .setName('confirm')
        .setDescription('Confirm the restart.')
        .setRequired(true)
    ),

  async execute(interaction) {
    const { options } = interaction;
    const confirmed = options.getBoolean('confirm');

    if (!confirmed) {
      const embed = new EmbedBuilder()
        .setDescription(
          'Please confirm the restart by running the command again with the `confirm` option set to `true`.'
        )
        .setColor(0xf1c40f);

      try {
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (error) {
        console.error('Failed to send reply:', error);
      }

      return;
    }

    const embed = new EmbedBuilder()
      .setDescription('Restarting the bot...')
      .setColor(0x3498db);

    try {
      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Failed to send reply:', error);
    }

    // Check if dummy file exists in src directory
    const dummyFilePath = path.join(__dirname, 'src', 'dummy.txt');
    const dummyFileExists = fs.existsSync(dummyFilePath);

    // Create or remove dummy file to trigger nodemon file changes detection
    if (dummyFileExists) {
      fs.unlinkSync(dummyFilePath);
      console.log('Removed dummy file to trigger nodemon file changes detection');
    } else {
      fs.writeFileSync(dummyFilePath, 'dummy');
      console.log('Created dummy file to trigger nodemon file changes detection');
    }

    // Watch for changes to the current file
    fs.watchFile(__filename, () => {
      process.exit();
    });
  },
};
