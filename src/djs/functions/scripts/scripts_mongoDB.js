const mongoose = require("mongoose");
const announcementData = require("../../../MongoDB/db/schemas/schema_announcement.js");
const scripts = require("../../../djs/functions/scripts/scripts.js");
const index = require('../../index.js');


async function saveSlashCommandData(commandData) {
    console.log(`SAVING SLASH COMMAND DATA`)
    
  if (!commandData) return;
  let { userId,channelId, randID, attachmentURL, roles } = commandData;
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
    });
    console.log(`saved to db`);
  } catch (error) {
    scripts.cLog(commandData)
    scripts.logError(error)
    console.log(`not saved`);
  }
}


async function addModal_Embed(randID, modalData,embed) {
    // TODO :  go to where the funct. is called and construct the modalData object
    console.log(`SAVING MODAL DATA`)
    console.log(`randID: ${randID}`)
    if (!randID || !modalData) return;
    try {
  const filter = { randID: `${randID}` };
  // TODO : add the modal data to the database
  const update = { roles: role };
      
  const query = { randID: randID };

  announcementData.findOneAndUpdate(query, { name: 'jason bourne' }, {
    new: true,
    runValidators: true
  }, (err, doc) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(doc);
  });

        console.log(`saved to db`);
    } catch (error) {
        scripts.logError(error)
        console.log(`ROLE not saved`);
    }
}

function getData(randID) {
    console.log(`GETTING DATA`)
    console.log(`randID: ${randID}`)
    if (!randID) return;
    let data;
    try {
        data = announcementData.collection().find({ randID: `${randID}` })
        console.log(`The data`, data)
    } catch (error) {
        console.log(`not saved`);
    }
}


module.exports = {saveSlashCommandData, addModal_Embed, getData};
