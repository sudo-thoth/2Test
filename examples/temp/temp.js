    // MongoDB data obj
    // as soon as an interaction occurs, create a randID,
    // create a new data obj, and save it to the db
    let data = {
        interaction: interactionObj,
        randID: ``,
        slashCommandInput: { // initial slash command input
          targetChannel: ``,
          roles: [],
          file: ``,
        },
        modalData: { // modal input
          modal: modal,
          leakName: leakName,
          era: ``,
          altLeakNames: ``,
  
        },
        buttons: [], // {} each button pressed with the same randID
        rows: [],
        embeds: [],
    }
// save

async function saveAttachment(randID, x, isLink, message) {
  console.log(`⚡ ~ Running Function : saveAttachment ~ index.js 289`);

  // let id = randID.substring(Math.max(0, randID.length - 5))
  let id = randID;

  // this is supposed to check if the id is already in the database, if it is, it will generate a new id and try again
  let c = await getAttachmentByID(id);
  console.log(
    "🚀 ~ file: index.js ~ line 297 ~ saveAttachment ~ c.length",
    c.length
  );
  // That look valid?
  while (c.length > 0) {
    console.log(
      `⚡ ~ ID already exists, generating new ID ~ index.js 326`
    );
    id = Math.floor(Math.random() * 90000) + 10000;
    console.log(`⚡ ~ New ID : ${id} ~ index.js 328`);
  }

  randID = id;

  console.log(`set randID to ${id}`);
  const newAttachment = isLink
    ? new attachmentSchema({
        _id: `${new mongoose.Types.ObjectId()}`,
        uniqueID: id,
        confirmMessage: message,
        isLink: `${isLink}`,
        links: `${x.toString()}`,
      })
    : new attachmentSchema({
        _id: `${new mongoose.Types.ObjectId()}`,
        uniqueID: id,
        confirmMessage: message,
        isLink: `${isLink}`,
        attachment: x,
      });

  await newAttachment.save();
  console.log(`Attachment saved to database`);
}
    