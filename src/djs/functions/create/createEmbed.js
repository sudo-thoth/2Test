/**
 * Creates a Discord.js embed with the specified properties.
 *
 * @param {Object} obj - An object containing the properties of the embed.
 * @param {string} obj.title - The title of the embed.
 * @param {string} obj.description - The description of the embed.
 * @param {string} obj.color - The color of the embed in hexadecimal format.
 * @param {Object} obj.footer - An object containing the footer text and icon URL of the embed.
 * @param {string} obj.footer.text - The footer text of the embed.
 * @param {string} obj.footer.iconURL - The URL of the footer icon of the embed.
 * @param {string} obj.thumbnail - The URL of the thumbnail image of the embed.
 * @param {string} obj.image - The URL of the image of the embed.
 * @param {Object} obj.author - An object containing the name, icon URL, and URL of the author of the embed.
 * @param {string} obj.author.name - The name of the author of the embed.
 * @param {string} obj.author.iconURL - The URL of the icon of the author of the embed.
 * @param {string} obj.author.url - The URL of the author of the embed.
 * @param {Object} obj.author.role - The highest role of the author of the embed.
 * @param {Object[]} obj.fields - An array of objects containing the name, value, and inline status of the fields of the embed.
 * @param {string} obj.fields[].name - The name of the field.
 * @param {string} obj.fields[].value - The value of the field.
 * @param {boolean} obj.fields[].inline - Whether the field should be displayed inline.
 *
 * @returns {Object} The created embed.
 *
 * @throws {Error} If the obj parameter does not have a valid value in the title, description, image, or fields array.
 * @throws {Error} If an error occurs while creating the EmbedBuilder instance.
 * @throws {Error} If an error occurs while setting the properties of the embed.
 * @throws {Error} If an error occurs while adding fields to the embed.
 */

const { EmbedBuilder } = require('discord.js');
const scripts = require('../scripts/scripts.js');

/* Example embed object that gets passed in below
const embedObj = {
    title: 'Title',
    description: 'Description',
    color: '#FF0000',
    footer: {
        text: 'Footer text',
        iconURL: 'https://example.com/image.png'
    },
    thumbnail: 'https://example.com/image.png',
    image: 'https://example.com/image.png',
    author: {
            // The display name of the user
            name: 'Logan'
            // the username will be the discord username of the person who ran the command
            id: `${interaction.user.id}`,
            // the icon URL will be the discord avatar of the person who ran the command
            iconURL: `${interaction.user.avatarURL()}`,
            url: `https://discord.com/users/${interaction.user.id}`,
            // role will be the highest role of the person who ran the command
            role: `${interaction.member.roles.highest}`
        },
    fields: [
        {
            name: 'Field 1',
            value: 'Field 1 value',
            inline: true
        },
        {
            name: 'Field 2',
            value: 'Field 2 value',
            inline: true
        }
    ]
};
*/

// Create an embed to be returned if an error occurs
const errEmbed = new EmbedBuilder()
.setColor('#FF0000')
.setTitle('❗️ Error')
.setDescription('Invalid properties were given to create the embed');

module.exports = function createEmbed(obj) { // DJS v14
  // Check if the obj has a valid value in the title, description, image, or fields array
  // At least one of these properties must be present in the obj in order for the embed to be valid
  if (!obj.title && !obj.description && !obj.image && !obj.fields) {
    // If not, log an error
    try {
      scripts.logError(new Error('Invalid properties were given to create the embed'), 'Invalid properties were given to create the embed');
    } catch (error) {
      console.error(error);
    }
    return errEmbed;
  }
  // console.log('obj passed into create Embed', obj);

  // Create a new EmbedBuilder instance
  let embed;
  try {
    embed = new EmbedBuilder();
  } catch (error) {
    try {
      scripts.logError(error, 'Error creating EmbedBuilder instance');
    } catch (error) {
      console.error(error);
    }
    return errEmbed;
  }

  // Set the properties of the embed if they are present in the obj
  try {
    if (obj.title) embed.setTitle(obj.title);
    if (obj.description) embed.setDescription(obj.description);
    if (obj.color) embed.setColor(obj.color);
    if (obj.footer) embed.setFooter({text: obj.footer.text, iconURL: obj.footer.iconURL});
    if (obj.thumbnail) embed.setThumbnail(obj.thumbnail);
    if (obj.image) embed.setImage(obj.image);
    if (obj.author) {
      if (obj.author.name) {
        embed.setAuthor({name: obj.author.name})
        if (obj.author.iconURL && obj.author.url) {
          embed.setAuthor({name: obj.author.name, iconURL: obj.author.iconURL, url: obj.author.url})
        } else {
          if (obj.author.iconURL) {
            embed.setAuthor({name: obj.author.name, iconURL: obj.author.iconURL})
          }
          if (obj.author.url) {
            embed.setAuthor({name: obj.author.name, url: obj.author.url})
          }
        }
       
        
      }
      
      
      
      // embed.setAuthor({name: obj.author.name, iconURL: obj.author.iconURL, url: obj.author.url})
  };
	
  } catch (error) {
    
    try {
      scripts.logError(error, 'Error setting properties of the embed');
    } catch (error) {
      console.error(error);
    }
    return errEmbed;
  }

  // Add fields to the embed if they are present in the obj
  try {
    if (obj.fields) {
      obj.fields.forEach(field => {
        embed.addFields({name: field.name, value: field.value, inline: field.inline});
      });
    }
  } catch (error) {
    try {
      scripts.logError(error, 'Error adding fields to the embed');
    } catch (error) {
      console.error(error);
    }
    return errEmbed;
  }

  // Return the completed embed
  return embed;
}
