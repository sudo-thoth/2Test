const mongoose = require("mongoose");
const announcementData = require("../../../MongoDB/db/schemas/schema_announcement.js");
const scripts = require("../../../djs/functions/scripts/scripts.js");
const index = require('../../index.js');
const fetchedFiles = require("../../../MongoDB/db/schemas/schema_fetchedFiles.js");


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
        // check if any values within the embed.data object properties are null if so replace them with `\u0020`

        console.log(`the embed data before: ----`, embed.data)


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
  ).clone()
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

function getBatch(batch_id) {
  console.log(`GETTING DATA`)
  console.log(`batch_id: ${batch_id}`)
  if (!batch_id) return; 
  let data;
  try {
      // data = announcementData.collection.find({ batch_id: batch_id })
      data = fetchedFiles.find({ batch_id: batch_id }).exec();
  } catch (error) {
      console.log(`not found`);
  }
  return data; // an array of docs found that matched the query : Promise
}

async function saveFetchFile(obj){
  console.log(`ATTEMPTING to save [ ${obj.metadata.file_name} ]`);
  if(obj.attachments.length === 0) {
    console.log(`The file [ ${obj.metadata.file_name} ] Has ZERO Attachments`);
    console.log(`returning A`)
    return;
  }
  // check to make sure the obj has not been saved to the database already, use the message_id as the unique identifier
  obj._id = `${new mongoose.Types.ObjectId()}`;
  let {metadata} = obj;
  let {message_id, who_ran_command} = metadata;
  let query = {message_id: message_id, who_ran_command: who_ran_command};
  // console.log(`test log`);
  console.log(`querying the file [ ${obj.metadata.file_name}] with the following filter: `, query);
  let data = await fetchedFiles.findOne(query).exec();
  console.log(`test log`);
  // console.log(`data found from query: `, data);
  if (data == null) {
    console.log(data)
    console.log(`[ ${obj.metadata.file_name} ] NOT found in query`)
    
  } else {
    console.log(`[ ${data.metadata.file_name}] found in query: `)
  }
  //console.log(`test log`);
  if(data){
    console.log(`The File [ ${data.metadata.file_name} ] was already saved to the database`);
    console.log(`returning B`)
    return;
  }
  // save the obj to the database
  try {
    console.log(`The file to save [ ${obj.metadata.file_name} ]`)
    await fetchedFiles.create(obj);
    console.log(`The File [ ${obj.metadata.file_name} ] was JUST saved to the database`);
    console.log(`returning C`)
    return; 
  } catch (error) {
    console.log(`Error while trying to save [ ${obj.metadata.file_name} ] to the database: `, error);
    console.log(`returning D`)
    return;
  }
  // log the file name and size
  
}


module.exports = {saveSlashCommandData, addModal_Embed, getData, saveFetchFile, getBatch};


