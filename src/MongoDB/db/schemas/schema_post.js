const { Schema, model } = require("mongoose");

const postData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    userId: String,
    user: Object,
    randID: { type: String, required: true },
    roles: [String],
    type: String,
    format: String,
    file: Object,
    interactionID: Object,
    file_type: String,
    choice: String,
    kraken_url : String,
    embed: Object,
  },
  { collection: "posts" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("postCommand", postData, "posts");
