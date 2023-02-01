const mongoose = require("mongoose");
const announcementData = require("../../../MongoDB/db/schemas/schema_announcement.js");
const scripts = require("../../../djs/functions/scripts/scripts.js");
const index = require('../../index.js');


async function saveSlashCommandData(commandData) {
    console.log(`SAVING SLASH COMMAND DATA`)
    
  if (!commandData) return;
  let { userId,channelId, randID, attachmentURL, roles, targetChannel } = commandData;
  console.log(`randID: ${randID}`)
  console.log(`the collection: ${announcementData.collection}`, announcementData.collection.collection)
  try {
    await announcementData.create({
      _id: `${new mongoose.Types.ObjectId()}`,
      user: userId,
    channelId: channelId,
    randID: randID,
    attachmentURL: attachmentURL,
   roles: roles,
    targetChannel: targetChannel,
    });
    console.log(`saved to db`);
  } catch (error) {
    scripts.cLog(commandData)
    scripts.logError(error)
    console.log(`not saved`);
  }
}


async function addModal_Embed(randID, modalInput,embed) {
    let {
        leakName, altLeakNames, dateOfLeak, price, notes, era, title, description, content, contentHeader, additionalDetails
        } = modalInput
        let inputs = { leakName: leakName, altLeakNames: altLeakNames, dateOfLeak: dateOfLeak, price: price, notes: notes, era: era, title: title, description: description, content: content, contentHeader: contentHeader, additionalDetails: additionalDetails, embed: embed.data}
    console.log(`SAVING MODAL DATA`)
    console.log(`randID: ${randID}`)
    console.log(`the embed: ----`, embed)

    if (!randID || !modalInput || !embed) return;
    const query = { randID: randID };
  // TODO : add the modal data to the database
  const update = { };
  // for each modal input check to make sure its not null, if not null, add it to the update object
  for (let key in inputs) {
    if (inputs[key] != null && inputs[key] != undefined) {
      update[key] = inputs[key];
    }
  }
    // change the forEach so that it places each input value into the update object    
    try {
      // make sure update has at least one key/value pair
        if (Object.keys(update).length > 0) {
            console.log(`updating db`)
            console.log(`current update obj:`, update)
  await announcementData.findOneAndUpdate(query, update, { upsert: true },(err, data) => (err ? console.log(`Ran into some Errors while trying to find and update: `, err) : console.log(`found it and updated it successfully`))
  )
  console.log(`updated db`)
    } else {
        console.log(`nothing to update`)
        return;
    }

        console.log(`saved modal_embed data to db`);
    } catch (error) {
        scripts.logError(error)
        console.log(`data not saved`);
    }
}

function getData(randID) {
    console.log(`GETTING DATA`)
    console.log(`randID: ${randID}`)
    if (!randID) return;
    let data;
    try {
        // data = announcementData.collection.find({ randID: randID })
        data = announcementData.findOne({ randID: randID }).exec();
    } catch (error) {
        console.log(`not found`);
    }
    return data; // an array of docs found that matched the query : Promise
}


module.exports = {saveSlashCommandData, addModal_Embed, getData};
