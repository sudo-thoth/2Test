const { Schema, model } = require("mongoose");

const userData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    userID: { type: String, required: true },
    username: String,
    accentColor: String,
    avatarURL: String,
    avatar: String,
    banner: String,
    bot: Boolean,
    createdTimestamp: Number,
    defaultAvatarURL: String,
    discriminator: String,
    hexAccentColor: String,
    tag: String,
    createdAt: String,
    // an array of server objects with key as server name and value as server id
    servers: [ {serverName: String, serverID: String,
    member: {
      avatar: String,
      bannable: Boolean,
      avatarURL: String,
      bannerURL: String,
      displayColor: String,
      displayHexColor: String,
      displayName: String,
      joinedAt: String,
      joinedTimestamp: Number,
      nickname: String,
      roles: [ {roleName: String, roleID: String} ],
      managable: Boolean,
      viewable: Boolean,
      permissions: [ {permissionName: String, permissionID: String} ],
      serverOwner: Boolean,
    }}],
    saved: {
      snipes: [{
        serverID: String,
        channelID: String,
        messageID: String,
        serverName: String,
        channelName: String,
          message:{
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
        snipedBy: {
          userID: String,
          username: String,
        },
        snipedTarget: {
          userID: String,
          username: String,
        },
        savedAt: String,
        savedTimestamp: Number
      }]
    }
  },
  { collection: "users" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("userData", userData, "users");
