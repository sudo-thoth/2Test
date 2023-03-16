Wok_Beta_Bot_token=MTAxMDYxMjI3MTU4OTg5NjIwMg.GKY01x.ft-YupRwfSpgdVDfS7NH1y1y2bMSx6hK2-ggpA
Wok_Beta_Bot_clientId=1010612271589896202 
Wok_Beta_Bot_guildId =1004377294615351317; 
Test_Bot_token=MTA1NTk4MTE3MjMxODAxOTY0NQ.G9xpAR.GfEYP8x1I_tTBCWuxvO9yNEp4YhTIWFYADZcFw
Test_Bot_clientId =1055981172318019645; 
Test_Bot_guildId =1004377294615351317; 
MongoDB_Token_2Test=mongodb+srv://Abyss:Logandisney123@datacluster.2g021uy.mongodb.net/2Test
MongoDB_Token_2Test_bot=mongodb+srv://Abyss:Logandisney123@datacluster.2g021uy.mongodb.net/2Test_bot
MongoDB_Token_Wok_Beta=mongodb+srv://Abyss:Logandisney123@datacluster.2g021uy.mongodb.net/Wok_Beta
MongoDB_connect_Wok_Beta=mongodb+srv://Abyss:Logandisney123@datacluster.2g021uy.mongodb.net/Wok_Beta?retryWrites=true&w=majority
MongoDB_connect_2Test=mongodb+srv://Abyss:Logandisney123@datacluster.2g021uy.mongodb.net/2Test?retryWrites=true&w=majority
MongoDB_connect_2Test_bot=mongodb+srv://Abyss:Logandisney123@datacluster.2g021uy.mongodb.net/2Test_bot?retryWrites=true&w=majority

const { Schema, model } = require("mongoose");

const postData = new Schema(
  {
    _id: Schema.Types.ObjectId,
    channelID: String,
    channelName: String,
    createdAt: String,
    serverName: String,
    serverID: String,
    managable: Boolean,
    viewable: Boolean,
    parentCategoryName: String,
    parentCategoryID: String,

    randID: { type: String, required: true },
    copyright_filterOn: Boolean
  },
  { collection: "posts" } // the database default collection name the schema will be stored in
);

// >> Parameters <<
// 1. Name of the model
// 2. Schema of the model
// 3. Name of the collection

module.exports = model("postCommand", postData, "posts");
