const { Schema, model } = require("mongoose");

const compData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    userId: String,
    username: String,
    user: Object,
    randID: { type: String, required: true },
    comp: String,
    compHost: String,
    info: String,
    key: String,
    title: String,
    buttonObj: Object,
    embedObj: Object,
  },
  { collection: "comps" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("compCommand", compData, "comps");
