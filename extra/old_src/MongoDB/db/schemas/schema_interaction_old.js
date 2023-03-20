const { Schema, model } = require("mongoose");

const interactionData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    interaction: { type: Object, required: true },
    randID: { type: String, required: true },
    slashCommandInput: { type: Object, required: false },
    modalData: { type: Object, required: false },
    encountered: { type: Object, required: false },
  },
  { collection: "interactionData" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports =  model("interactionData", interactionData, "interactionData");


