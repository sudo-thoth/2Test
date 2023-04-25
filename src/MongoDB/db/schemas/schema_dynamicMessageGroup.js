const { Schema, model } = require("mongoose");

const dynamicMessageGroup = new Schema(
  {
    _id: Schema.Types.ObjectId,
   messages: [Object],
    groupName: String,
    channelId: String,
    serverId: String,
    groupID: { type: String, required: true },
    onlineStatus: Boolean,
    cycleStartedAt: String,
  },
  { collection: "DynamicMsgGroup" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("dynamicMessageGroup", dynamicMessageGroup, "DynamicMsgGroup");
