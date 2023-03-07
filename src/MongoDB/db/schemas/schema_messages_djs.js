const { Schema, model } = require("mongoose");

const messageData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    attachments: [Object],
    embeds: [Object],
    batchID: { type: String, required: true },
    messageAuthor: String,
    content: String,
    messageID: String,
    numOfAttachments: Number,
    numOfEmbeds: Number,
    timestamp: String,
    index : Number,
  },
  { collection: "messages" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("messageInformation", messageData, "messages");
