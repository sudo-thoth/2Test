const createEmbed = require("../create/createEmbed.js");

function krakenWebScraper(url, type){
  let link = '';
  if (!url) {
    return;
  }
  axios.get(url).subscribe(
    (response) => {
      const html = response.data; // html
      switch (type) {
        case 'audio':
      link = html
        .split("\n")
        .filter((line) => line.includes("m4a:"))[0]
        .trim()
        .substring(6)
        .replace("'", "");
      link = "https:" + link;
      break;
      case 'video':
      link = html
        .split("\n")
        .filter((line) => line.includes("m4a:"))[0]
        .trim()
        .substring(6)
        .replace("'", "");
      link = "https:" + link;
      break;
      default:
        break;
      }
    },
    (error) => {
      console.log(error);
    }
  );
  return link;

}


module.exports = {
    getInteractionObj,
    geMemberInfoObj,
    krakenWebScraper,
    embed_FileSizeTooBig,
    row_FileSizeTooBig,
}

// File Size Too Big Elements
const embed_FileSizeTooBig = (interaction) => {
return createEmbed({
  title: `File Size TOO BIG`,

  description: `Choose a how you would like to proceed`,
  color: 'RANDOM_COLOR_PLACEHOLDER',
  footer: {
      // string: the text for the footer
      text: `After choosing Option 1 you must re-enter the slash command`,
      // Might need to pass the interaction object to this function
      iconURL: interaction.user.avatarURL()
  },
  thumbnail: 'https://media.giphy.com/media/VJY3zeoK87CLBKnqqm/giphy.gif',
  fields: [{
    name: "Option 1 : Compress",
    value: `***Most Popular***\n~Click the Compress button to compress and get a smaller sized version of the same file\n~Then once you have downloaded the compressed version, press the Start Over button\n~Enter a new \`/slash command\` with the compressed file`,
    inline: true,
  },
  // Add JumpShare in place of Onlyfiles
  { name: "Option 2: Get Shareable Link", value: `used for most audio files\nConvert your file to a link via Kraken Files, WeTranser, or JumpShare`, inline: true }
  ]
});
}

const row_FileSizeTooBig = createActionRow({
  components: [
    createButton({
      customId: "compress",
      label: "🗜️ Compress File",
      style: ButtonStyle.Primary,
      }),
      createButton({
        customId: "sharelink",
        label: "📤 Get Shareable Link",
        style: ButtonStyle.Primary,
      }),
  ],
});
