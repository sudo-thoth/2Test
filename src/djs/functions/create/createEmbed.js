const exists = require('../tools/exists.js');
// Create Embed Function
module.exports = function createEmbed(title, description, color, footer, thumbnail, image, author, fields) {
    const embed = {
        title: title,
        description: description,
        color: color,
        footer: footer,
        thumbnail: thumbnail,
        image: image,
    };
    if (author) embed.author = author;
    if (fields) embed.fields = fields;

    
    // next create a addFeilds function
    
    const sendEmbed = new EmbedBuilder()
    .setTitle(exists(title) ? `${title}` : null)
    .setDescription(exists(description) ? `${description}` : null)
    .setColor(exists(color) ? `${color}` : randColor())
    .setThumbnail(`${gif}`)
    .setFooter({
        text: `${server}`,
    })
    .addFields(
        {
            name: "To : ",
            value: `${roles}`,
        },
        {
            name: "From : ",
            value: `<@${sender}>`,
        },
        {
            name: `${contentHeader}`,
            value: `${content}`,
            inline: true,
        }
        )
        .setTimestamp();
        
        sendEmbed.addFields(
            {
                name: `${contentHeader}`,
                value: `${content}`,
                inline: true,
            }
            )
            
        };