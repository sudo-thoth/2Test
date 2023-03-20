const { Schema, model } = require("mongoose");

const dumpDownloadButtons = new Schema(
  {
    _id: Schema.Types.ObjectId,
    label: String,
    style: String,
    emoji: String,
    customID: String,
    randID: { type: String, required: true },
    attachment: {batchID: String, name: String, url: String, id: String, size: Number, messageID: String, messageAuthor: String, metaData: {requestedBy: String, requestedByID: String, dateRequested: String, originServer: String, originServerID: String, originChannel: String, OriginChannelID: String}}
  },
  { collection: "dumpDownloadButtons" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("dumpDownloadButtons", dumpDownloadButtons, "dumpDownloadButtons");
