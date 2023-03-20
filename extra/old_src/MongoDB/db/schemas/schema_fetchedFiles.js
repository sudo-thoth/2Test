const { Schema, model } = require("mongoose");


const fetchedFiles = new Schema(
  {
    _id: Schema.Types.ObjectId,
    attachments: [Object],
    // {
    //   file_name: String,
    //   file_size: String,
    //   file_url: String,
    //   file_type: String,
    //   file_extension: String,
    //   file_id: String,
    //   file_batch_id: String,
    //   message_content: {
      //     content: String,
      //     embeds: [Object],
      //     attachments: [Object],
      //     actionRow: boolean,
      //     button: Object,
    //   },
    // }
    metadata: { 
        from_user_name: String,
        from_user_id: String,
        from_channel_name: String,
        from_channel_id: String,
        from_guild_name: String,
        from_guild_id: String,
        from_guild_icon: String,
        posted_at: String,
        message_id: String,
        message_content: String,
        message_batch_id: String,
        who_ran_command: String,
        who_ran_command_id: String,
        who_ran_command_avatar: String,
    },
    batch_id: String,
    file_url: String,
    
  },
  { collection: "fetchedFiles" } // the database default collection name the schema will be stored in
);


// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports =  model("fetchedFiles", fetchedFiles, "fetchedFiles");


