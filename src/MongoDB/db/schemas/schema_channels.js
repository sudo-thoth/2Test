const { Schema, model } = require("mongoose");

const channelData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    channelID: { type: String, required: true },
    channelName: String,
    createdAt: String,
    serverName: String,
    serverID: { type: String, required: true },
    manageable: Boolean,
    viewable: Boolean,
    parentCategoryName: String,
    parentCategoryID: String,
    url: String,
    copyright_filterOn: Boolean
  },
  { collection: "channels" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("channelData", channelData, "channels");
