const { Schema, model } = require("mongoose");


const gb = new Schema(
  {
    _id: Schema.Types.ObjectId,
        randID: String,
        name: String,
        price: String,
        priceNumber: Number,
        amountPaid: String,
        amountPaidNumber: Number,
        channelID: String,
        guildID: String,
        messageID: String,
        interactionID: String,
        totalPaid: String,
        amountLeft: String,
        percentLeft: String,
    
  },
  { collection: "gbs" } // the database default collection name the schema will be stored in
);


// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports =  model("gb", gb, "gbs");


