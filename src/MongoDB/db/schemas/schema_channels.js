const { Schema, model } = require("mongoose");

const postData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    channelID: String,
    channelName: String,
    createdAt: String,
    serverName: String,
    serverID: String,
    managable: Boolean,
    viewable: Boolean,
    parentCategoryName: String,
    parentCategoryID: String,

    randID: { type: String, required: true },
    copyright_filterOn: Boolean
  },
  { collection: "posts" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("postCommand", postData, "posts");
