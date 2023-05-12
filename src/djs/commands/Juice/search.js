require("dotenv").config({ path: "./xNine.env" });
const client = require("../../index.js");
const {
  google
} = require('googleapis'); // TODO: Install googleapis
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const ffmpeg = require('fluent-ffmpeg'); // TODO: Install ffmpeg
const {
  getLyrics,
  searchSong
} = require('genius-lyrics-api'); // TODO: Install genius-lyrics-api
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, MessageButton } = require("discord.js")
const commandName = "search";
const commandDescription = "search Juice WRLD's discography for a song";
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const createEmb = require("../../functions/create/createEmbed.js");
const createBtn = require("../../functions/create/createButton.js");
const createActRow = require("../../functions/create/createActionRow.js");

const Fuse = require('fuse.js');
const { once } = require('events');

const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];
const artistName = "Juice WRLD"
const statsFile = '../../logs/' + artistName.replace(/\s/g, '_') + '_stats.json';
const basePath = 'src/djs/data/jw/searches/' ;
const color = {
  play: 'GREEN',
  search: '#0021de',
  quickSearch: '#4a00de',
  searchList: 'DARK_PURPLE',
  pause: 'YELLOW',
  playback: 'GOLD',
  queue: 'BLUE',
  queuePrint: 'DARK_BLUE',
  lyrics: 'PURPLE',
  stats: 'AQUA',
  replay: 'DARK_VIVID_PINK',
  shuffle: 'LUMINOUS_VIVID_PINK',
  volume: 'DARK_AQUA',
  loading: 'DARK_GREEN',
  success: 'GREEN',
  error: 'RED',
  help: 'GREYPLE',
  newleak: 'GREEN',
  newsong: 'AQUA',
  ogfileupdate: '#eb459e',
  stemedit: '#0033cc',
  info: '#FF5733'
};

const messageDeleteTime = 10.0; //seconds

// FUNCTIONS
// This Function is never/rarely called upon, but if it is it might cause errors
function getAccessToken(oAuth2Client, callback) {
  // This function takes an OAuth2 client and a callback function as inputs.

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  // This line generates an authorization URL for the OAuth2 client.

  console.log('Authorize this app by visiting this url:', authUrl);
  // This line prints the authorization URL to the console.

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  // This line creates a new readline interface that reads from the standard input and writes to the standard output.

  rl.question('Enter the code from that page here: ', (code) => {
    // This line prompts the user to enter the authorization code.

    rl.close();
    // This line closes the readline interface.

    oAuth2Client.getToken(code, async (err, token) => {
      // This line exchanges the authorization code for an access token.

      if (err)
        return console.error('Error retrieving access token', err);

      oAuth2Client.setCredentials(token);
      // This line sets the credentials of the OAuth2 client using the access token.

      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        // This line writes the access token to a file.

        if (err)
          return console.error(err);

        console.log('Token stored to', TOKEN_PATH);
        // This line prints a success message to the console.

      });

      return await callback(oAuth2Client);
      // This line calls the callback function with the OAuth2 client as an argument.
    });
  });
}
async function authorize(callback, args, interaction) {
  // This function is an asynchronous function that takes a "callback" function and an "args" parameter as inputs.


  const {
    google_client_secret_xNine,
    google_client_id_xNine,
    redirect_uri_xNine_A, 
    google_token_access_token_xNine,
    google_token_refresh_token_xNine,
    google_token_scope_xNine,
    google_token_token_type_xNine,
    google_token_expiry_date_xNine
  } = process.env;
  let googleTokenInfoObj = {access_token:google_token_access_token_xNine,refresh_token:google_token_refresh_token_xNine,scope:google_token_scope_xNine,token_type:google_token_token_type_xNine,expiry_date:google_token_expiry_date_xNine}
  
  // This line extracts the "google_client_secret_xNine", "google_client_id_xNine", and "redirect_uri_xNine_A" properties from the env.

  const oAuth2Client = new google.auth.OAuth2(google_client_id_xNine, google_client_secret_xNine, redirect_uri_xNine_A);
  // This line creates a new OAuth2 client using the extracted properties.
   
  // let tokenA = JSON.parse(google_token_info_xNine)
  // let token = google_token_info_xNine
  // This line reads the token file and assigns the contents to the "token" variable.

if (!googleTokenInfoObj){return getAccessToken(oAuth2Client, callback)};
  // This line checks if the "token" variable is null.
  // If it is, the function calls the "getAccessToken" function to retrieve a new access token using the OAuth2 client and the "callback" function.

  oAuth2Client.setCredentials(googleTokenInfoObj);
  // This line sets the credentials of the OAuth2 client using the token.

  if (typeof args !== 'undefined') {
    return   await callback(oAuth2Client, args, interaction);
      
  } else {
    return await callback(oAuth2Client);
      
  }
  // This block checks if the "args" parameter is defined.
  // If it is, the "callback" function is called with the OAuth2 client and the "args" parameter.
  // If it is not, the "callback" function is called with just the OAuth2 client.
}
async function updateDiscography(auth) {
  const drive = google.drive({
    version: 'v3',
    auth
  });

  try {
    let res = await drive.files.list({
      pageSize: 1000,
      q: "mimeType='audio/mpeg' OR fileExtension='wav' OR fileExtension='flac' OR fileExtension='m4a'",
      fields: 'files(id, name, size)',
    }).then(res => {
      for (let i = 0; i < res.data.files.length; i++) {
      res.data.files[i].url = ('https://drive.google.com/uc?export=download&id=').concat(res.data.files[i].id);
    }

    client.discography = res.data.files;
  }).catch(err => console.error(err));

    
  } catch (error) {
    console.error(error);
  }
}

async function discographyRefresh(interaction, force) {
  const refreshTime = 30; //mins
  // This function is an asynchronous function that takes an "interaction" object and a "force" parameter as inputs.
    let discographyRefreshTime = client.juice_disco_refresh_time || null;
  if (discographyRefreshTime != null) {
    // This line checks if "discographyRefreshTime" is not null.

    if (((new Date()).getTime() - discographyRefreshTime.getTime()) / 1000 > refreshTime * 60 || (force != null && force === 'force')) {
      // This line calculates the time difference between the current time and the time when "discographyRefreshTime" was last updated.
      // If the time difference is greater than the "refreshTime" variable (in minutes) or the "force" parameter is equal to "force", the function proceeds.

      

      

      await authorize(updateDiscography);
      // This line calls the "authorize" function to authorize the bot and then calls the "updateDiscography" function to update the discography information.

      client.juice_disco_refresh_time = new Date();
      // This line updates the "discographyRefreshTime" variable to the current time.

      try {
        await interaction.editReply({embeds:[createEmb.createEmbed({title: ``, description: `${artistName} discography refreshed <a:check:1091081054800064522>`})]});
      } catch (error) {
        console.log(error)
        try {
          if(error.message.includes(`Unknown interaction`)){
            await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
          } else {
            return
          }
        } catch (err) {
          console.log(err)
        }
        }
      // This line sends a success message to the channel where the "interaction" occurred.

    }
  } else {
    await authorize(updateDiscography).then( async () => {
    // This line calls the "authorize" function to authorize the bot and then calls the "updateDiscography" function to update the discography information.

    client.juice_disco_refresh_time = new Date();
    // This line updates the "discographyRefreshTime" variable to the current time.

try {
      await interaction.editReply({embeds:[createEmb.createEmbed({title: ``, description: `${artistName} discography refreshed <a:check:1091081054800064522>`})]});
    } catch (error) {
      console.log(error)
      try {
        if(error.message.includes(`Unknown interaction`)){
          await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
        } else {
          return
        }
      } catch (err) {
        console.log(err)
      }
      }
    // This line sends a success message to the channel where the "interaction" occurred.

    }).catch(err => {
      console.log(err)
    })
  }
}
async function updateMetadata(song) {
  return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(song.path, function (err, metadata) {
          if (metadata != null) {
              if (metadata.format.tags != null) {
                  song.title = metadata.format.tags.title;
                  song.artist = metadata.format.tags.artist;
              }
              song.duration = Math.trunc(metadata.format.duration);
              song.bitrate = Math.round(metadata.format.bit_rate / 1000);
              return resolve(song);
          } else {
              return resolve(song);
          }
      });
  });
}
async function updateGeniusData(song) {
  const fileNameFilter = ['.mp3', '.wav', '.flac', '.m4a'];
const wordFilter = ['\\(v\\d\\)', 'v\\d', '\\(snippet\\)', '\\(master\\)', '\\(solo\\)', '\\(Sessions\\)', 'bass', 'boost', 'extended'];
const geniusFilter = [...fileNameFilter, ...wordFilter];
  const artistName = 'Juice WRLD';
  return new Promise(async(resolve, reject) => {
    let geniusTitle;
    let geniusArtist;
    if (song.title != null) {
        geniusTitle = song.title;
    } else {
        geniusTitle = song.name;
    }
    if (song.artist != null) {
        geniusArtist = song.artist;
    } else {
        geniusArtist = artistName;
    }
    for (let word of geniusFilter) {
        geniusTitle = geniusTitle.replace(new RegExp(word, 'i'), '');
    }
    let { google_api_key_xNine} = process.env;
    let options = {
        apiKey: google_api_key_xNine,
        title: geniusTitle.replace(/\s\s/g, ' ').trim(),
        artist: geniusArtist,
        optimizeQuery: false
    };
    let songSearch = await searchSong(options); // Genuis API Function
    if (songSearch !== null) {
        let keywords = [...options.title.split(/ +/), ...artistName.split(/ +/)];
        let matches = [];
        for (let geniusSong of songSearch) {
            let count = 0;
            for (let word of keywords) {
                if (geniusSong.title.toLowerCase().includes(word.toLowerCase()) &&
                    (!isLetter(geniusSong.title.charAt(geniusSong.title.toLowerCase().indexOf(word.toLowerCase()) - 1)) || !isLetter(geniusSong.title.charAt(geniusSong.title.toLowerCase().indexOf(word.toLowerCase()) + word.length)))) {
                    count++;
                }
            }
            if (count > 0) {
                matches.push({
                    count: count,
                    geniusSong: geniusSong
                });
            }
        }
        matches.sort((a, b) => b.count - a.count);
        if (matches.length !== 0) {
            song.albumArt = matches[0].geniusSong.albumArt;
            song.geniusUrl = matches[0].geniusSong.url;
            return resolve(song);
        } else {
            return resolve(song);
        }
  
    } else {
        return resolve(song);
    }
  });
  }
async function batchDownload(auth, songs, interaction) {
  const drive = google.drive({
      version: 'v3',
      auth
  });

  const updatedFiles = [];

  const songsToProcess = songs.slice(0, 3); // get the first 3 songs to process
try {
    await interaction.editReply({embeds:[createEmb.createEmbed({description: `<a:loading:647604616858566656> Processing`, color: scripts.getColor()})]})
  } catch (error) {
    console.log(error)
    try {
      if(error.message.includes(`Unknown interaction`)){
        await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
      } else {
        return
      }
    } catch (err) {
      console.log(err)
    }
    }
  let counter = 0;
  for (let song of songsToProcess) {

    let stream = await drive.files.get({
      fileId: song.id,
      alt: 'media'
    }, {
      responseType: 'stream'
    });

    song.path = basePath.concat(song.name).replace(/\s/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/&/g, '').replace(/'/g, '').replace(/\$/g, 'S');

    const fileNameFilter = ['.mp3', '.wav', '.flac', '.m4a'];
    const wordFilter = ['\\(v\\d\\)', 'v\\d', '\\(snippet\\)', '\\(master\\)', '\\(solo\\)', '\\(Sessions\\)', 'bass', 'boost', 'extended'];
    const geniusFilter = [...fileNameFilter, ...wordFilter];

    try {
      if (!fs.existsSync(song.path)) {
        const writeStream = fs.createWriteStream(song.path);
        stream.data.pipe(writeStream);
        await once(writeStream, 'finish');
      }

      song = await updateMetadata(song);

      song = await updateGeniusData(song, geniusFilter);

      updatedFiles.push(song);
      counter++;
      if(counter === 2){
try {
          await interaction.editReply({embeds:[createEmb.createEmbed({description: `<a:loading:1094842418521722941> Processing Almost Complete`, color: scripts.getColor()})]})
        } catch (error) {
          console.log(error)
          try {
            if(error.message.includes(`Unknown interaction`)){
              await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
            } else {
              return
            }
          } catch (err) {
            console.log(err)
          }
          }
      }
    } catch (err) {
      throw err;
    }
  }

  return updatedFiles;
}


async function download(auth, song) {
  const drive = google.drive({
      version: 'v3',
      auth
  });
  let stream = await drive.files.get({
      fileId: song.id, // aka file id
      alt: 'media'
  }, {
      responseType: 'stream'
  });
  console.log(song.name)
  console.log(song.path)
  console.log(song.id)
  console.log(stream)
  console.log(song)

  song.path = basePath.concat(song.name).replace(/\s/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/&/g, '').replace(/'/g, '').replace(/\$/g, 'S'); // + '/' added / to create folder ??




const fileNameFilter = ['.mp3', '.wav', '.flac', '.m4a'];
const wordFilter = ['\\(v\\d\\)', 'v\\d', '\\(snippet\\)', '\\(master\\)', '\\(solo\\)', '\\(Sessions\\)', 'bass', 'boost', 'extended'];

const geniusFilter = [...fileNameFilter, ...wordFilter];



try {
  if (!fs.existsSync(song.path)) {
    const writeStream = fs.createWriteStream(song.path);
    stream.data.pipe(writeStream);
     // triggers the finish event
    await once(writeStream, 'finish');
  }

  song = await updateMetadata(song);
  console.log(`updateMetadata song`, song)

  song = await updateGeniusData(song);
  console.log(`updateGeniusdData song`, song)

  return song;
} catch (err) {
  throw err;
}

}
function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}

function fmtMSS(s) {
  return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

// New Function ////////
async function fileFuzzySearch(files, inputtedSearch, interaction) {
  // transform files object array into an array of key and value pairs with the file name as the key and the file object as the value
  function transformArray(array) {
    return array.map(item => {
      return { [item.name]: item };
    });
  }
  const songList = transformArray(files);

  // extract the names from the songList Object array
  function extractNames(array) {
    return array.map(item => {
      const key = Object.keys(item)[0];
      return key;
    });
  }
  const songListNames = extractNames(songList);

  // Create a Fuse instance with the song list and options
  const options = {
    includeScore: true,
    threshold: 0.3,
    distance: 100,
  };
  const fuse = new Fuse(songListNames, options);

  // Perform the fuzzy search with the search string
  const result = fuse.search(inputtedSearch);

  // The most likely match
  if (result.length > 0) {
    console.log('Most likely match:', result[0].item, `\n\n\nNumber 2 is ${result[1]?.item} & 3 is ${result[2]?.item}`);

    const resultFiles = result.map(resultItem => {
      const songName = resultItem.item;
      const file = songList.find(item => item.hasOwnProperty(songName))[songName];
      return file;
    });
try {
      await interaction.editReply({embeds:[createEmb.createEmbed({description: `<:yes:1087550258764071004> Result Found!`, color: scripts.getSuccessColor()})]})
    } catch (error) {
      console.log(error)
      try {
        if(error.message.includes(`Unknown interaction`)){
          await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
        } else {
          return
        }
      } catch (err) {
        console.log(err)
      }
      }
    return await authorize(batchDownload, resultFiles, interaction);
  } else {
    console.log('No match found');
    return null;
  }
}

////////////////////////

async function fileSearchMatch(files, keywords, quickSearch) {
  let fileSearch = [];
  console.log(files)

  for (let file of files) {
      let count = 0;
      let count2 = 0;
      //create count2 and check if keyword has empty space or non letter on left and right.
      for (let word of keywords) {
          if (file.name.toLowerCase().includes(word.toLowerCase())) {
              count++;
              if (!isLetter(file.name.charAt(file.name.toLowerCase().indexOf(word.toLowerCase()) - 1)) &&
                  !isLetter(file.name.charAt(file.name.toLowerCase().indexOf(word.toLowerCase()) + word.length))) {
                  count2++;
              }
          }
      }
      if (count > 0) {
          file.hits = count;
          file.exactMatches = count2;
          fileSearch.push(file);
      }
  }
  if (fileSearch.length == 0) {

      return null;
  } else {
      if (fileSearch.length > 1) {
          fileSearch.sort((a, b) => b.hits - a.hits);
          fileSearch = fileSearch.filter(item => item.hits >= fileSearch[0].hits);
          fileSearch.sort((a, b) => b.exactMatches - a.exactMatches);
          fileSearch = fileSearch.filter(item => item.exactMatches >= fileSearch[0].exactMatches);
          fileSearch.sort((a, b) => a.name.length - b.name.length);
      }
      // Remove the new properties from the object to return to its original state. 
      delete fileSearch[0].hits;
      delete fileSearch[0].exactMatches;
      if (quickSearch != null && quickSearch === true) {

          return fileSearch[0];
      }

      return await authorize(download, fileSearch[0]);
  }
}
async function songEmbed(interaction, song, annotation) {
let userInput = interaction?.options?.getString("song");
let user = interaction.user;

const sizeString = song.size ? `Size: ${(song.size * Math.pow(1024, -2)).toFixed(2)} MB` : '';
const lengthString = song.duration ? `Length: ${fmtMSS(song.duration)}` : '';
const bitrateString = song.bitrate ? `Bitrate: ${song.bitrate} kbps` : '';

const descriptionArray = [sizeString, lengthString, bitrateString];
const description = descriptionArray.filter(Boolean).join(', ');
let embed = {
  title: song.name,
  url: song.url,
  author: {
    name: annotation,
  },
  description: description,
  thumbnail: song.albumArt || null,
}

if (annotation !== 'New Leak:' && annotation !== 'OG File Updated:' && annotation !== 'New Stem Edit:' && annotation !== 'New Song:') {
    embed.footer = {text: `${user.username}`, url: user.avatarURL({
            dynamic: true
        })};
}

if(annotation.toLowerCase().includes('play') || annotation.toLowerCase().includes('resume')) {
  embed.color = color.play;
} else if(annotation.toLowerCase().includes('lyrics')) {
  embed.color = color.lyrics;
} else if(annotation.toLowerCase().includes('search')) {
  embed.color = color.search;
} else if(annotation.toLowerCase().includes('pause')) {
  embed.color = color.pause;
} else if(annotation.toLowerCase().includes('queue')) {
  embed.color = color.queue;
} else if(annotation == 'New Leak:') {
  embed.color = color.newleak;
} else if(annotation == 'OG File Updated:') {
  embed.color = color.ogfileupdate;
} else if(annotation == 'New Stem Edit:') {
  embed.color = color.stemedit;
} else if(annotation == 'New Song:') {
  embed.color = color.newsong;
}

return createEmb.createEmbed(embed);
}
function updateSongStats(song) {
if (song !== null) {
  if (!fs.existsSync(statsFile)) {
      fs.writeFileSync(statsFile, JSON.stringify([]));
  }
  let stats = JSON.parse(fs.readFileSync(statsFile));
  let inStats = false;
  for (let record of stats) {
      if (record.name === song.name) {
          inStats = true;
          record.queries = record.queries + 1;
          break;
      }
  }
  if (!inStats) {
      stats.push({
          name: song.name,
          url: song.url,
          queries: 1
      });
  }
  stats.sort((a, b) => b.queries - a.queries);
  fs.writeFileSync(statsFile, JSON.stringify(stats));
}
}


module.exports = {
    data: new SlashCommandBuilder()
        .setName(`${commandName}`)
        .setDescription(`${commandDescription}`)
        .addStringOption((option) =>
            option
                .setName("song")
                .setDescription("song to search for")
                .setRequired(true)
        ),
    execute,
};

async function execute(interaction) {
  try {
    await interaction.deferReply({ ephemeral: false });
  } catch (error) {
    scripts.logError(error, `error deferring reply`);
  }
try {
    await interaction.editReply({embeds:[createEmb.createEmbed({description: '<a:LoadingGreen:974345645693468712> Searching...', color: scripts.getColor()})]})
  } catch (error) {
    console.log(error)
    try {
      if(error.message.includes(`Unknown interaction`)){
        await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
      } else {
        return
      }
    } catch (err) {
      console.log(err)
    }
    }
  await search(interaction)
}



// TODO: add a global discoRefreshTime on the client as a property
async function search(interaction) {
  // This function is an asynchronous function that takes an "interaction" object as an input.
  let userInput = interaction?.options?.getString("song");
  let currentSong = client.currentSong;

  

  discographyRefresh(interaction).then( async () => {
  // This line calls the "discographyRefresh" function to refresh the discography information.

console.log(client.discography)

  // let song = await fileSearchMatch(client.discography, userInput);
  let songs = await fileFuzzySearch(client.discography, userInput, interaction);
  // This line calls the "fileSearchMatch" function to search for a file that matches the input provided in "interaction" and returns an object called "song".
try {
    await interaction.editReply({embeds:[createEmb.createEmbed({description: `<a:loading:647604616858566656> Providing Results for "${userInput}"...`, color: scripts.getColor()})]})
  } catch (error) {
    console.log(error)
    try {
      if(error.message.includes(`Unknown interaction`)){
        await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
      } else {
        return
      }
    } catch (err) {
      console.log(err)
    }
    }
  // The "song" object contains information about the matching file.
    let embeds = [];

  if (songs != null && songs.length > 0) {
    // This line checks if "songs" is not null and has at least one item.
  
    
    for (const song of songs) {
      if (currentSong == null || currentSong.path !== song.path) {
        function deleteFile(path) {
          try {
              fs.unlinkSync(path);
          } catch (err) {
              setTimeout(deleteFile, 3000, path);
          }
          if (fs.existsSync(path)) {
              setTimeout(deleteFile, 3000, path);
          }
        }
  
        deleteFile(song.path);
        // This line deletes the file corresponding to the "currentSong" object if it exists and is not the same as the "song" object.
      }
  
      embeds.push(await songEmbed(interaction, song, `Search result for "${userInput}":`));
      // This line sends an "embed" object to the channel where the "interaction" occurred for each song in the "songs" array.
      // The "embed" object contains information about the "song" object and the input provided in "interaction".
  
      // try {
      //   updateSongStats(song);
      // } catch (error) {
      //   // Handle error
      // }
      // This line calls the "updateSongStats" function to update the statistics for the "song" object.
    }

    // send a single message with all the embed results displayed in a pagination system with buttons, with the embeds index as the current page number

    const interactionId = `${interaction.user.id}-${interaction.channel.id}-${interaction.id}`; // generate unique interaction id
    const maxPages = embeds.length; // set maximum number of pages to the number of embeds
    let currentPage = 1; // set initial page to 1
    
    const paginatedEmbed = async (interaction, page, interactionId, embeds) => {
      const embedMessage = embeds[page - 1]; // get embed for the current page
      let currentPage = page;

    
      const paginationRow = await createActRow.createActionRow({components: [await createBtn.createButton({customID: `search-back-${interactionId}`, label: 'Back', style: 'SECONDARY', disabled: currentPage === 1}), await createBtn.createButton({customID: `search-next-${interactionId}`, label: 'Next', style: 'SECONDARY', disabled: currentPage === maxPages})]})
  
    
      let message;
try {
        message = await interaction.editReply({ embeds: [embedMessage], components: [paginationRow]});
      } catch (error) {
        console.log(error)
        try {
          if(error.message.includes(`Unknown interaction`)){
            await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
          } else {
            return
          }
        } catch (err) {
          console.log(err)
        }
        }
      const collector = message.createMessageComponentCollector({ time: 60000 });
    
      collector.on('collect', async i => {
        if (i.customId.startsWith('search-back') && i.customId.endsWith(`-${interactionId}`)) {
          
          if (embeds[currentPage - 2]) { // check that the embed at the current page index exists
currentPage--;
          }
        } else if (i.customId.startsWith('search-next') && i.customId.endsWith(`-${interactionId}`)) {
          
          if (embeds[currentPage]) { // check that the embed at the current page index exists
currentPage++;  
          }
        }
    
try {
          await i.update({ embeds: [embeds[currentPage - 1]], components: [await createActRow.createActionRow({components: [await createBtn.createButton({customID: `search-back-${interactionId}`, label: 'Back', style: 'SECONDARY', disabled: currentPage === 1}), await createBtn.createButton({customID: `search-next-${interactionId}`, label: 'Next', style: 'SECONDARY', disabled: currentPage === maxPages})]})] });
        } catch (error) {
          console.log(error)
          try {
            if(error.message.includes(`Unknown interaction`)){
              await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
            } else {
              return
            }
          } catch (err) {
            console.log(err)
          }
          }
      });
    
      collector.on('end', async () => {
        paginationRow.components.forEach(c => c.setDisabled(true));
        try {
          await interaction.editReply({ components: [paginationRow] });
          await interaction.deleteReply();
        } catch (error) {
          console.log(error)
          try {
            if(error.message.includes(`Unknown interaction`)){
              await interaction.user.send({embeds:[createEmb.createEmbed({title: `I'm Sorry a Hiccup Occurred | Please Try Again`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${error}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Dev if error persists`}})]})
            } else {
              return
            }
          } catch (err) {
            console.log(err)
          }
          }
      });
    };
  
  await paginatedEmbed(interaction, currentPage, interactionId, embeds);

    
  } else {
    let errorMsg = await interaction.editReply({embeds:[createEmb.createEmbed({color: scripts.getErrorColor() ,description: '<:no:1087550298135986266> No results found'})]});
    // This line sends an error message to the channel where the "interaction" occurred if "songs" is null or empty.
  
    await scripts.delay(messageDeleteTime * 1000)
    await errorMsg.delete()
  }
  
}).catch(async err => {
  console.log(err)
  await interaction.editReply({embeds:[createEmb.createEmbed({title: `There was An Error!`, description: `<a:attention:760937915643068430>\n> **The error was**\n\n\`\`\`js\n${err}\n\`\`\``, color: scripts.getErrorColor(), footer: {text: `Contact the Devs`}})]});
})
}
