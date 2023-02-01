const { Schema, model } = require("mongoose");


const announcementData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    user: { type: Object, required: true },
    channelId: { type: String, required: true },
    randID: { type: String, required: true },
    targetChannel: { type: String, required: true },
    attachmentURL: String,
   roles: [String], 
   leakName: String,
    altLeakNames: String,
    dateOfLeak: String,
    price: String,
    notes: String,
    era: String,
    title: String,
    description: String,
    content: String,
    contentHeader: String,
    additionalDetails: String,
    embed: Object,
    
  },
  { collection: "announcements" } // the database default collection name the schema will be stored in
);


// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports =  model("announcementCommand", announcementData, "announcements");


