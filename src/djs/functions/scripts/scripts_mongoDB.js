const mongoose = require("mongoose");
const announcementData = require("../../../MongoDB/db/schemas/schema_announcement.js");
const scripts = require("../../../djs/functions/scripts/scripts.js");
const index = require('../../index.js');
const fetchedFiles = require("../../../MongoDB/db/schemas/schema_fetchedFiles.js");
const fileBatchs = require("../../../MongoDB/db/schemas/schema_fileBatchs.js");
const postData = require("../../../MongoDB/db/schemas/schema_post.js");
const compData = require("../../../MongoDB/db/schemas/schema_comp.js");

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

let getFileBatch = async (batch_id) => {
  console.log(`getting batch messages`)
  let data = await fileBatchs.find({batch_id: batch_id}).exec();
  console.log(`data: `, data)
  return data[0];
}

async function saveBatchMessages(messages, batch_id){
  console.log(`ATTEMPTING to save [ All Batch Messages ]`);
  let obj = {};
  // check to make sure the obj has not been saved to the database already, use the message_id as the unique identifier
  obj._id = `${new mongoose.Types.ObjectId()}`;
  obj.messages = messages;
  obj.batch_id = batch_id;
  console.lof(`Recieved the following messages: `, messages)
  
  console.log(`adding the file [ MESSAGES BATCH id: ${batch_id} ] with the following filter: `, obj);

  // save the obj to the database
  try {
    
    await fileBatchs.create(obj);
    console.log(`The File [ MESSAGES BATCH id: ${batch_id} ] was JUST saved to the database`);
    console.log(`returning C`)
    return; 
  } catch (error) {
    console.log(`Error while trying to save [ MESSAGES BATCH id: ${batch_id} ] to the database: `, error);
    console.log(`returning D`)
    return;
  }
  // log the file name and size
  
}

async function savePostData(obj){

  let obj1 = {
    _id: new mongoose.Types.ObjectId(),
    userId: obj.userId,
    user: obj.user,
    randID: obj.randID,
    roles: obj.roles,
    type: obj.type,
    format: obj.format,
    file: obj.file,
    interactionID: obj.interactionID,
    file_type: obj.file_type,
    choice: obj.choice,
    kraken_url: obj.kraken_url,
  }
  try {
    console.log(`Saving a post from [ ${obj.user.username} ]`)
    await postData.create(obj1);
    console.log(`✅ [ ${obj.user.username} ] Saved a post SUCCESSFULLY`)
    return; 
  } catch (error) {
    console.log(`Error while trying to save a post to the database: `, error);
    return;
  }

}

async function getPostData(randID) {
  console.log(`GETTING DATA`)
  console.log(`randID: ${randID}`)
  if (!randID) return;
  let data;
  
  try {
       data = await postData.findOne({ randID: randID }).exec();
  } catch (error) {
      console.log(`an error occurred while trying to get the data from the database: `, error);
  }
  if (data == null) {
    // console.log(data)
    console.log(`[ data ] NOT found in query`)
    
  } else {
    // console.log(data)
    console.log(`[ data ] found in query: `)
  }
  return data; // an array of docs found that matched the query 
}

async function updatePostData(randID, obj) {
  console.log(`UPDATING DATA`)
  console.log(`randID: ${randID}`)
  if (!randID || !obj ) return;

  const query = { randID: randID };
  const update = { $set: obj };
  console.log(`the query: `, query)
  console.log(`the update: `, update)
  try {
    await postData.findOneAndUpdate(query, update, { upsert: true },(err, data) => (err ? console.log(`Ran into 
    some Errors while trying to find and update: `, err) : console.log(`found it and updated it successfully`))
    ).clone()
    console.log(`updated the data to the database w the query: `, query)
  } catch (error) {
      console.log(`an error occurred while trying to update the data to the database: `, error);
  }
  return; 
}
  
async function deleteDuplicateDocs_Kraken(url, batch_id) {
  fetchedFiles.find({file_url: url, batch_id: batch_id}, (err, docs) => {
    if (err) {
      console.error(err);
    } else {
      // slice the docs array to include everything but the first element
      docs = docs.slice(1);
      // delete all the docs in the docs array
      console.log(`Deleting ${docs.length} duplicate documents`);
      fetchedFiles.deleteMany({_id: {$in: docs.map(doc => doc._id) }}, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log('Deleted duplicate documents');
        }
      });
    }
  });
}

async function saveCompData(obj){
  let obj1 = {
    _id: new mongoose.Types.ObjectId(),
    comp: obj.comp,
    title: obj.title,
    info: obj.info,
    key: obj.key,
    userID: obj.userId,
    username: obj.user.username,
    randID: obj.randID,
    buttonObj: obj.buttonObj,
    embedObj: obj.embedObj,
    compHost: obj.compHost,
  }

  try {
    console.log(`Saving a post from [ ${obj.user.username} ]`)
    await compData.create(obj1);
    console.log(`✅ [ ${obj.user.username} ] Saved a post SUCCESSFULLY`)
    return; 
  } catch (error) {
    console.log(`Error while trying to save a post to the database: `, error);
    return;
  }

}

async function getCompData(randID) {
  console.log(`GETTING DATA`)
  console.log(`randID: ${randID}`)
  if (!randID) return;
  let data;
  
  try {
       data = await compData.findOne({ randID: randID }).exec();
  } catch (error) {
      console.log(`an error occurred while trying to get the data from the database: `, error);
  }
  if (data == null) {
    // console.log(data)
    console.log(`[ data ] NOT found in query`)
    
  } else {
    // console.log(data)
    console.log(`[ data ] found in query: `)
  }
  return data; // an array of docs found that matched the query 
}

async function updateCompData(randID, obj) {
  console.log(`UPDATING DATA`)
  console.log(`randID: ${randID}`)
  if (!randID || !obj ) return;

  const query = { randID: randID };
  const update = { $set: obj };
  console.log(`the query: `, query)
  console.log(`the update: `, update)
  try {
    await compData.findOneAndUpdate(query, update, { upsert: true },(err, data) => (err ? console.log(`Ran into 
    some Errors while trying to find and update: `, err) : console.log(`found it and updated it successfully`))
    ).clone()
    console.log(`updated the data to the database w the query: `, query)
  } catch (error) {
      console.log(`an error occurred while trying to update the data to the database: `, error);
  }
  return; 
}

module.exports = {saveSlashCommandData, addModal_Embed, getData, saveFetchFile, getBatch, getFileBatch, saveBatchMessages, savePostData, getPostData, updatePostData, deleteDuplicateDocs_Kraken, saveCompData, getCompData, updateCompData};


