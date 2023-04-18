require("dotenv").config({ path: "./my.env" });
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

const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];
const artistName = "Juice WRLD"
const statsFile = '../../logs/' + artistName.replace(/\s/g, '_') + '_stats.json';
const basePath = '../../data/jw/' ;
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
async function authorize(callback, args) {
  // This function is an asynchronous function that takes a "callback" function and an "args" parameter as inputs.


  const {
    google_client_secret_xNine,
    google_client_id_xNine,
    redirect_uri_xNine_A, 
    google_token_info_xNine
  } = process.env;
  // This line extracts the "google_client_secret_xNine", "google_client_id_xNine", and "redirect_uri_xNine_A" properties from the env.

  const oAuth2Client = new google.auth.OAuth2(google_client_id_xNine, google_client_secret_xNine, redirect_uri_xNine_A);
  // This line creates a new OAuth2 client using the extracted properties.

  // let token = JSON.parse(google_token_info_xNine)
  let token = google_token_info_xNine
  // This line reads the token file and assigns the contents to the "token" variable.

if (token == null){return getAccessToken(oAuth2Client, callback)};
  // This line checks if the "token" variable is null.
  // If it is, the function calls the "getAccessToken" function to retrieve a new access token using the OAuth2 client and the "callback" function.

  oAuth2Client.setCredentials(token);
  // This line sets the credentials of the OAuth2 client using the token.

  if (typeof args !== 'undefined') {
      return await callback(oAuth2Client, args);
  } else {
      return await callback(oAuth2Client);
  }
  // This block checks if the "args" parameter is defined.
  // If it is, the "callback" function is called with the OAuth2 client and the "args" parameter.
  // If it is not, the "callback" function is called with just the OAuth2 client.
}
async function updateDiscography(auth) {
  // This function is an asynchronous function that takes an "auth" object as an input.

  const drive = google.drive({
    version: 'v3',
    auth
  });
  // This line creates a new Drive client using the "auth" object.

  let res = await drive.files.list({
    pageSize: 1000,
    q: "mimeType='audio/mpeg' OR fileExtension='wav' OR fileExtension='flac' OR fileExtension='m4a'",
    fields: 'files(id, name, size)',
  });
  // This line retrieves a list of files from the user's Google Drive that match certain criteria (mimeType and fileExtension).
  // The list is limited to 1000 files and includes only the ID, name, and size of each file.

  for (let i = 0; i < res.data.files.length; i++) {
    res.data.files[i].url = ('https://drive.google.com/uc?export=download&id=').concat(res.data.files[i].id);
    // This line adds a "url" property to each file object in the list.
    // The "url" property contains a URL that can be used to download the file from Google Drive.
  }

  client.discography = res.data.files;
  // This line assigns the list of files (with the "url" property added to each file object) to the "discography" variable.
}
async function discographyRefresh(interaction, force) {

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

      let refreshMessage = await interaction.channel.send({embeds:[createEmb.createEmbed({description: `${artistName} discography refreshed`})]});
      // This line sends a success message to the channel where the "interaction" occurred.

      await scripts.delay(5000)
      await refreshMessage.delete();
    }
  } else {
    await authorize(updateDiscography);
    // This line calls the "authorize" function to authorize the bot and then calls the "updateDiscography" function to update the discography information.

    client.juice_disco_refresh_time = new Date();
    // This line updates the "discographyRefreshTime" variable to the current time.

    let refreshMessage = await interaction.channel.send({embeds:[createEmb.createEmbed({description: `${artistName} discography refreshed`})]});
    // This line sends a success message to the channel where the "interaction" occurred.

    await scripts.delay(5000)
    await refreshMessage.delete();
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
  song.path = basePath.concat(song.name).replace(/\s/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/&/g, '').replace(/'/g, '').replace(/\$/g, 'S') + '/'; // added / to create folder ??




const fileNameFilter = ['.mp3', '.wav', '.flac', '.m4a'];
const wordFilter = ['\\(v\\d\\)', 'v\\d', '\\(snippet\\)', '\\(master\\)', '\\(solo\\)', '\\(Sessions\\)', 'bass', 'boost', 'extended'];

const geniusFilter = [...fileNameFilter, ...wordFilter];





  if (!fs.existsSync(song.path)) {
      return new Promise(async(resolve, reject) => {
          stream.data.pipe(fs.createWriteStream(song.path)).on('finish', async function () {
              song = await updateMetadata(song);
              song = await updateGeniusData(song);
              resolve(song);
          });
      });
  } else {
      return new Promise(async(resolve, reject) => {
          song = await updateMetadata(song);
          song = await updateGeniusData(song);
          resolve(song);
      });
  }
}
async function fileSearchMatch(files, keywords, quickSearch) {
  let fileSearch = [];
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
let embed = {
  title: song.name,
  url: song.url,
  author: {
    name: annotation,
  },
  description: `Size: ${(song.size * Math.pow(1024, -2)).toFixed(2)} MB, Length: ${fmtMSS(song.duration)}, Bitrate: ${song.bitrate} kbps`,
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
  await search(interaction)
}



// TODO: add a global discoRefreshTime on the client as a property
async function search(interaction) {
  // This function is an asynchronous function that takes an "interaction" object as an input.
  let userInput = interaction?.options?.getString("song");

  

  await discographyRefresh(interaction);
  // This line calls the "discographyRefresh" function to refresh the discography information.



  let song = await fileSearchMatch(client.discography, userInput);
  // This line calls the "fileSearchMatch" function to search for a file that matches the input provided in "interaction" and returns an object called "song".
  // The "song" object contains information about the matching file.

  if (song != null) {
    // This line checks if "song" is not null.

    if (currentSong == null || currentSong.path !== song.path) { // TODO: eventually store currentSong in a database per each server
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





    interaction.channel.send({embeds: [await songEmbed(interaction, song, `Search result for "${userInput}":`)]});
    // This line sends an "embed" object to the channel where the "interaction" occurred.
    // The "embed" object contains information about the "song" object and the input provided in "interaction".






    try {
      updateSongStats(song);
    } catch (error) {
      
    }
    // This line calls the "updateSongStats" function to update the statistics for the "song" object.
  } else {
    let errorMsg = await interaction.channel.send({embeds:[createEmb.createEmbed({color: color.error,description: 'No results found'})]});
    // This line sends an error message to the channel where the "interaction" occurred if "song" is null.

    await scripts.delay(messageDeleteTime * 1000)
    await errorMsg.delete()
  }
}
