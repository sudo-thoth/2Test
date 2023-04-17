const { SlashCommandBuilder } = require("@discordjs/builders");
const message = `The Command Works!`;
const commandName = "custom";
const commandDescription = "x";
const createEmb = require('../../functions/create/createEmbed.js');


// FUNCTION TEST STATION Config.
// Currently testing the cLog() function
// Make Sure To change BOTH funcName AND the Import to the relevant function being tested

const createEmbed = require('../../functions/create/createEmbed.js');
const scripts = require('../../functions/scripts/scripts.js');
const scripts_djs = require('../../functions/scripts/scripts_djs.js');

// making the funcName bold in the success and fail messages
module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}}`),
  async execute(interaction) {
   
    const description = `> \`1.\` No racism, hate speech, or discrimination of any kind.\n> \`2.\` No self-promotion or advertising without permission from a moderator.\n> \`3.\` No spamming or excessive use of emojis, capital letters, or symbols.\n> \`4.\` Respect the opinions, beliefs, and boundaries of other members.\n> \`5.\` No cybercrimes or illegal activities, including hacking or sharing malicious links.\n> \`6.\` No impersonating or pretending to be a trusted member of the community.\n> \`7.\` No scamming, phishing, or attempts to steal personal information.\n> \`8.\` No sharing or distributing copyrighted material without permission.\n> \`9.\` Follow the [Discord ToS](https://discord.com/terms)`

    const interactionObj = scripts_djs.getInteractionObj(interaction);
    try {
      await interaction.deferReply({ ephemeral: true })
    } catch (error) {
      if(error.message.includes(`Unknown interaction`)){return;} else{console.log(error)}
      
      
    }
let user = interaction.user;

if( user.id === `975944168373370940`){

  testResultEmbed = createEmb.createEmbed({
    title: `Rules`,
    description: `${description}`,
    color: `#CE2400`,        
    
    footer: {
      text: `Breaking these rules will result in warnings, temporary bans, or permanent bans depending on the severity of the offense. Let's work together to create a fun and welcoming environment for everyone!`,
    }

  });


try {
await interaction.channel.send({embeds: [testResultEmbed]});
await interaction.editReply({content: 'done', ephemeral: true});
} catch (error) {
console.log(error)
}
} else {
  await interaction.editReply({content: '<:nocomment:823694349065519104>'});
}

    console.log(`Custom Command Complete: ✅`);
  }
};


// Embed Object for createEmbed() function parameter
const embedObj = {
  title: 'Title',
  /*
   * { description } Type: String
   * The description of the embed
   */
  description: 'Description',
  /*
   * { color } Type: String
   * The color of the embed, represented as a hex code
   */
  color: '#FF0000',
  /*
   * { footer } Type: Object
   * An object containing the text and icon for the footer of the embed
   * - { text } Type: String
   *   The text for the footer
   * - { iconURL } Type: String
   *   The URL for the icon to display in the footer
   */
  footer: {
      // string: the text for the footer
      text: 'Footer text',
      // string: the URL for the icon to display in the footer
      iconURL: 'https://example.com/image.png'
  },
  /*
   * { thumbnail } Type: String
   * The URL for the thumbnail image to display in the embed
   */
  thumbnail: 'https://example.com/image.png',
  /*
   * { image } Type: String
   * The URL for the main image to display in the embed
   */
  image: 'https://example.com/image.png',
  /*
   * { author } Type: Object
   * An object containing information about the author of the embed
   * - { name } Type: String
   *   The name of the author
   * - { iconURL } Type: String
   *   The URL for the icon to display next to the author's name
   * - { url } Type: String
   *   The URL for the author's name to link to
   */
  author: {
      // string: the name of the author
      name: 'Author name',
      // string: the URL for the icon to display next to the author's name
      iconURL: 'https://example.com/image.png',
      // string: the URL for the author's name to link to
      url: 'https://example.com'
  },
  /*
   * { fields } Type: Array
   * An array of objects representing the fields to display in the embed
   * - { name } Type: String
   *   The name of the field
   * - { value } Type: String
   *   The value of the field
   * - { inline } Type: Boolean
   *   Whether the field should be displayed inline with other fields (true) or on a new line (false)
   */
  fields: [
      // object: a field to display in the embed
      {
          // string: the name of the field
          name: 'Field 1',
          // string: the value of the field
          value: 'Field 1 value',
          // boolean: whether the field should be displayed inline with other fields (true) or on a new line (false)
          inline: true
      },
      // object: a field to display in the embed
      {
          // string: the name of the field
          name: 'Field 2',
          // string: the value of the field
          value: 'Field 2 value',
          // boolean: whether the field should be displayed inline with other fields (true) or on a new line (false)
          inline: true
      },
      /// ... more fields ... [ up to 5 ]
  ]
}
