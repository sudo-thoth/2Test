const { SlashCommandBuilder } = require("@discordjs/builders");
const createEmb = require('../../functions/create/createEmbed.js');
require("dotenv").config({ path: "./my.env" }); 
const { OPENAI_tutorial_key } = process.env;

const basicTrainingData = {
    training: "I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with \"Unknown\".",
    prompt: "U:What is human life expectancy in the United States?\nA:78 years.\nU:Who was president of the United States in 1955?\nA:Dwight D. Eisenhower.\nU:Which party did he belong to?\nA:Republican Party.\nU:What is the square root of banana?\nA:Unknown\nU:How does a telescope work?\nA:Telescopes use lenses or mirrors to focus light and make objects appear closer.\nU:Where were the 1992 Olympics held?\nA:Barcelona, Spain.\nU:",
    examples: [
        ["What is human life expectancy in the United States?", "78 years."],
        ["Who was president of the United States in 1955?", "Dwight D. Eisenhower."],
        ["Which party did he belong to?", "Republican Party."],
        ["What is the square root of banana?", "Unknown"],
        ["How does a telescope work?", "Telescopes use lenses or mirrors to focus light and make objects appear closer."],
        ["Where were the 1992 Olympics held?", "Barcelona, Spain."]
    ]
}

// FUNCTION TEST STATION Config.
// Currently testing the cLog() function
// Make Sure To change BOTH funcName AND the Import to the relevant function being tested

const createEmbed = require('../../functions/create/createEmbed.js');
const scripts = require('../../functions/scripts/scripts.js');
const scripts_djs = require('../../functions/scripts/scripts_djs.js');

// OPENAI API CODE
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
    apiKey: OPENAI_tutorial_key,
//     engine: 'davinci',
//     apiBaseUrl: 'https://api.openai.com/v1',
});

const openai = new OpenAIApi(configuration);

// const response = await openai.retrieveModel("text-davinci-003");


// making the funcName bold in the success and fail messages
const commandName = 'chatGPT';
const commandDescription = 'Chat with the GPT-3 API';
module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}}`)
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The prompt to send to the GPT-3 API")
        .setRequired(true)
        ),

  async execute(interaction) {
try {

    
    // Get the prompt from the user
    let prompt = interaction.options.getString("prompt");

    // // Use training data to fine-tune the model
    
    // await openai.createFineTune({
    //     trainingData: trainingData.training,
    //     prompt: trainingData.prompt,
    //     examples: trainingData.examples,
    //     file: "chatGPT3",
    //     // stop: ["\n", " Human:", " AI:"]
    // });

    // incorporate basic training data

    prompt = basicTrainingData.prompt + prompt;





    // Send the prompt to the GPT-3 API
    const completion = await openai.complete({
        model: "text-davinci-003",
        prompt,
        maxTokens: 60, // 150 is the default
        temperature: 0, // 0.9 is the default
        // topP: 1,
        // presencePenalty: 0,
        // frequencyPenalty: 0,
        // bestOf: 1,
        // n: 1,
        // stream: false,
        // stop: ["\n", " Human:", " AI:"]
    });

    // Get the response from the API
    const { choices } = completion.data;
    const response = choices[0].text;

    // auto clean up the response, removing the prompt and any trailing newlines and deleting any uncomplete sentences if the answer is too long
    let responseClean = response.replace(prompt, "");
    responseClean = responseClean.replace(/\n+$/, "");
    responseClean = responseClean.replace(/(\n.*)+$/, "");

    // Send the response to the user
    await interaction.reply(responseClean);
    
  } catch (error) {
    console.error(error);
    await interaction.reply("There was an error!");

  }
},
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
