const { Schema, model } = require("mongoose");

const copyrightContent = new Schema(
  {
    _id: Schema.Types.ObjectId,
    channelID: { type: String, required: true },
    randID: { type: String, required: true },
    hasLink: Boolean,
    hasFile: Boolean,
    links: [String],
    files: [Object],
    message: {
      ogContent: String,
      filteredContent: String,
      id: String,
      createdAt: String,
      createdTimestamp: String,
    },
    author: {
      id: String,
      username: String,
      discriminator: String,
      avatarURL: String,
    },
    warningMessage: {
      embed: Object,
      url: String,
      button: Object,
      id: String,
      channelID: String,
    }
  },
  { collection: "channels" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("copyrightContent", copyrightContent, "copyrightContent");
