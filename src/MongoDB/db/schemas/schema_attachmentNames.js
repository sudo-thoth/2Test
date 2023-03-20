const { Schema, model } = require("mongoose");

const attachmentNames = new Schema(
  {
    _id: Schema.Types.ObjectId,
    attachments: [String],
    batchID: { type: String, required: true },
  },
  { collection: "attachmentNames" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("attachmentNames", attachmentNames, "attachmentNames");
