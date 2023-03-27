const { Schema, model } = require("mongoose");

const cleanData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    customID: String,
    randID: { type: String, required: true },
    url: String,
    messageID: String,
    messageURL: String,
    channelID: String,
    serverID: String,
    ogContent: String,

   
  },
  { collection: "cleanData" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("cleanData", cleanData, "cleanData");
