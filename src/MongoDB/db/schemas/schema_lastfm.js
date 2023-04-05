const { Schema, model } = require("mongoose");

const lastfmSchema = Schema({
    userID: {type: String, require: true, unique: true},
    lastfmID: {type: String, require: true},
    lastfmUsername: String,
    discordUserID: String,
    discordUsername: String,
    
    },
    { collection: "lastFm" } // the database default collection name the schema will be stored in
    );
    
    
    // >> Parameters <<
    // 1. Name of the model
    // 2. Schema of the model
    // 3. Name of the collection
    
    module.exports =  model("lastfmModels", lastfmSchema, "lastFm");