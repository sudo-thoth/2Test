require("dotenv").config({ path: "./my.env" });
const fs = require("fs");

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  Permissions,
  MessageManager,
  Embed,
  Collection,
} = require(`discord.js`);
const mongoose = require('mongoose');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds | GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const handleFunctions = require("./client/handlers/handleFunctions");
const handleEvents = require("./client/handlers/handleEvents");
const handleCommands = require("./client/handlers/handleCommands");
let dbs = new Collection();
const djsFunctionFolders = fs.readdirSync("./src/djs/functions");
const djsCommandFolders = fs.readdirSync("./src/djs/commands");
const djsEventFiles = fs
  .readdirSync("./src/djs/client/events")
  .filter((file) => file.endsWith(".js"));
  const mongoConfig = fs.readdirSync("./src/MongoDB/db/config");


const { Test_Bot_token } = process.env;

client.commands = new Collection();

client.on("ready", () => {
  console.log("---------- >> Bot is Online << ----------");

  const activities = [
    "with my code",
    "Juice WRLD - Road Rage",
    "Juice WRLD - In My Head",
    "Juice WRLD - Amazing",
    "Juice WRLD - Ca$h Out",
    "Juice WRLD - Nuts Itch",
  ];

  const types = ["PLAYING", "LISTENING", "WATCHING", "STREAMING", "COMPETING"];

  const statuses = ["online", "idle", "dnd", "invisible"];

  setInterval(() => {
    const text = activities[Math.floor(Math.random() * activities.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    // client.user.setPresence({activities : [{name: text, type: type}], status: status});
    client.user.setPresence({ activities: [{ name: text }], status: status });
    client.user.setAct;
  }, 5000);
});
module.exports = client;
handleEvents(client, mongoConfig, 2);
const { MongoDB_Token_2Test_bot } = process.env;


(async () => {
    if (mongoose === undefined) {
      return;
    } else {
      await mongoose.connect(MongoDB_Token_2Test_bot).catch(console.error);
      console.log(`---------- >> MongoDB is Online << ----------`)
    }
  })();
  const db = mongoose.connection;
db.on("error", () => {
  client.connectedToMongoose = false;
  console.error.bind(console, "connection error:")
  
});
db.once("open", () => {
  console.log("Connected to MongoDB")
  client.connectedToMongoose = true;
});



handleFunctions(djsFunctionFolders, "./src/djs/functions");
handleEvents(client, djsEventFiles, 1);
handleCommands(client, djsCommandFolders, "./src/djs/commands");  

client.login(Test_Bot_token);


