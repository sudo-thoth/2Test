const { Schema, model } = require("mongoose");

const logData = new Schema(
  {
    _id: Schema.Types.ObjectId,
 serverName: String, serverID: String,
    logs: {
      joins: [
        {
          user: {
          userID: String,
          username: String,
        },
        joinedAt: String,
        joinedTimestamp: Number
      }
    ],
      leaves: [
        {
          user: {
          userID: String,
          username: String,
          },
          leftAt: String,
          leftTimestamp: Number
        }
      ],
      bans: [
        {
          user: {
          userID: String,
          username: String,
        },
        bannedAt: String,
        bannedTimestamp: Number,
        reason: String,
        bannedBy: {
          userID: String,
          username: String,
        }
      }
      ],
      unbans:
        [
          {
            user: {
            userID: String,
            username: String,
          },
          unbannedAt: String,
          unbannedTimestamp: Number,
          unbannedBy: {
            userID: String,
            username: String,
          }
        }
        ],
      kicks: [
        {
          user: {
          userID: String,
          username: String,
        },
        kickedAt: String,
        kickedTimestamp: Number,
        reason: String,
        kickedBy: {
          userID: String,
          username: String,
        }
      }
      ],
      messages: [{
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
        deletedAt: Number,
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
      }],
    }],
      edits:
        [{
          content: {
          old: String,
          new: String,
        },
        embeds: [{
          old: {
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
        },
        new: {
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
        },
      }],}
    ],
      deletes: [{
        user: {
          userID: String,
          username: String,
        },

      }],
      reactions: {

      },
      channels: {

      },
      roles: {

      },
      nicknames: {

      },
      avatars: {

      },
      banners: {

      },
      emojis: {

      },
      pins: {

      },
      invites: {

      },
      voice: {

      },
      boosts: [
        {
          user: {
          userID: String,
          username: String,
        },
        boostedAt: String,
        boostedTimestamp: Number
      }
      ],
    }
  },
  { collection: "logs" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("logData", logData, "logs");
