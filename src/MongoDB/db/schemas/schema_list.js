const { Schema, model } = require("mongoose");

const listSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    channelId: String,
    channelName: String,
    messageId: {type: String, required: true},
    messageURL: String,
    listTitle: {type: String, required: true},
    listItems: [String],
    embedObj: Object,
    embeds: [Object]
  },
  { collection: "lists" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("List", listSchema, "lists");
