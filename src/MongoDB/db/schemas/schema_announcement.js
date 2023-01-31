const { Schema, model } = require("mongoose");

const announcementData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    user: { type: Object, required: true },
    channelId: { type: String, required: true },
    randID: { type: String, required: true },
    attachmentURL: { type: String, required: false },
   roles: { type: Array, required: false }, 
    
  },
  { collection: "announcements" } // the database default collection name the schema will be stored in
);


// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports =  model("announcementCommand", announcementData, "announcements");


