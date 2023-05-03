const { Schema, model } = require("mongoose");

const channelData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    channelID: { type: String, required: true },
    channelName: String,
    createdAt: String,
    serverName: String,
    serverID: { type: String, required: true },
    manageable: Boolean,
    viewable: Boolean,
    parentCategoryName: String,
    parentCategoryID: String,
    url: String,
    copyright_filterOn: Boolean,
    attachments_filterOn: Boolean,
    links_filterOn: Boolean,
  deletedMessages: [
    {
      messageID: String,
        serverID: String,
        channelID: String,
        serverName: String,
        channelName: String,
      message: {
        user: {
          userID: String,
          username: String,
        },
        messageID: String,
        channelID: String,
        serverID: String,
        content: String,
        timestamp: Number,
        createdAt: String,
        deletedAt: String,
        deletedTimestamp: Number,
        hasEmbed: Boolean,
        embeds: [{
          title: String,
          description: String,
          url: String,
          timestamp: String,
          color: String,
          footer: {
            text: String,
            iconURL: String,
            proxyIconURL: String,
          },
          image: {
            url: String,
            proxyURL: String,
            height: Number,
            width: Number,
          },
          thumbnail: {
            url: String,
            proxyURL: String,
            height: Number,
            width: Number,
          },
          author: {
            name: String,
            url: String,
            iconURL: String,
          },
          fields: [{
            name: String,
            value: String,
            inline: Boolean,
          }],
      }],
      attachments: [{
        name: String,
        url: String,
        size: Number,
        contentType: String,
      }],
    },
    deletedBy: {
      userID: String,
      username: String,
    },
    messageAuthor: {
      userID: String,
      username: String,
    },
    loggedAt: String,
    loggedTimestamp: Number,
}],
      
  },
  { collection: "channels" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("channelData", channelData, "channels");
