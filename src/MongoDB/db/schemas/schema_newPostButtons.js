const { Schema, model } = require("mongoose");

const postDataButtons = new Schema(
  {
    _id: Schema.Types.ObjectId,
    customID: String,
    randID: { type: String, required: true },
    attachment: {attachment: String, contentType: String, description: String, ephemeral: Boolean, height: Number, width: Number, size: Number, id: String, name: String, proxyURL: String, url: String},
    metaData :  {
      datePosted: String,
      originChannel: String,
      originChannelID: String,
      originServer: String,
      originServerID: String,
      postedBy: String,requestedByID: String, 
    }
  },
  { collection: "postDataButtons" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("postDataButtons", postDataButtons, "postDataButtons");
