const { Schema, model } = require("mongoose");


const fileBatchs = new Schema(
  {
    _id: Schema.Types.ObjectId,
    messages: [Object],
    batch_id: String,
    
  },
  { collection: "fileBatchs" } // the database default collection name the schema will be stored in
);


// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports =  model("fileBatchs", fileBatchs, "fileBatchs");


