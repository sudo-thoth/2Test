const Discord = require("discord.js");
const {
    google
} = require('googleapis');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const ffmpeg = require('fluent-ffmpeg');
const {
    getLyrics,
    searchSong
} = require('genius-lyrics-api');

const artistName = 'Juice WRLD';
const tokenMapPath = './tokenMap.json';
const fileName = path.basename(__filename).replace(/.js/, '');
const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets'];
const TOKEN_PATH = artistName.replace(/\s/g, '_') + '_token.json';
const CREDENTIAL_PATH = artistName.replace(/\s/g, '_') + '_credentials.json';
const basePath = './files_' + fileName + '/';
const statsFile = './' + artistName.replace(/\s/g, '_') + '_stats.json';
const whiteListFile = './whitelist_' + fileName + '.json';
const whiteList = new Map();
const loadedEmojis = new Map();

var bot;
for (let server of JSON.parse(fs.readFileSync(tokenMapPath))) {
    if (server.name === fileName) {
        bot = server;
        console.log(bot);
        break;
    }
}
const client = new Discord.Client();
const disbut = require("discord-buttons");
disbut(client);

var dispatcher, connection;
var replay = false;
var autodelete = true;
var shuffle = false;
var queue = [];
var playing = false;
var lastPlayingUser;
var discographyRefreshTime;
var discographyInfoRefreshTime;
var lastLyricsButtonTime;
var lastInfoButtonTime;
var lastQueuePrintButtonTime;
var discography = [];
var discographyInfo = [];
var currentSong;
var playbackInterval = null;
var playbackMsg, playingMsg;
var playbackBar = false;
var seeking = false;
var streamOptions = {
    seek: 0,
    volume: 1
};
var onFinish;

const refreshTime = 30; //mins
const buttonRefreshTime = 1; //mins
const lyricsDeleteTime = 1.5; //mins
const messageDeleteTime = 10.0; //seconds
const playbackBarLength = 47; //characters
const playbackRefreshTime = 2.0; //seconds
const quickSeekTime = 10; //seconds
const verticalBarChar = '|';
const horizontalBarChar = '᠆';

const stopButton = new disbut.MessageButton().setStyle('grey').setLabel('⏹').setID('disconnect');
const backwardsButton = new disbut.MessageButton().setStyle('grey').setLabel('⏪️').setID('seekBackwards');
const forwardButton = new disbut.MessageButton().setStyle('grey').setLabel('⏩️').setID('seekForwards');
const playButton = new disbut.MessageButton().setStyle('grey').setLabel('▶️').setID('resume');
const pauseButton = new disbut.MessageButton().setStyle('grey').setLabel('⏸').setID('pause');
const skipButton = new disbut.MessageButton().setStyle('grey').setLabel('⏭️').setID('skip');
const infoButton = new disbut.MessageButton().setStyle('grey').setLabel('ℹ️').setID('info');
const replayButton = new disbut.MessageButton().setStyle('grey').setLabel('🔁').setID('replay');
const shuffleButton = new disbut.MessageButton().setStyle('grey').setLabel('🔀').setID('shuffle');
const lyricsButton = new disbut.MessageButton().setStyle('grey').setLabel('🎶').setID('lyrics');
const queuePrintButton = new disbut.MessageButton().setStyle('grey').setLabel('📤').setID('queueprint');
const row1playing = new disbut.MessageActionRow().addComponents(stopButton, backwardsButton, pauseButton, forwardButton, skipButton);
const row1paused = new disbut.MessageActionRow().addComponents(stopButton, backwardsButton, playButton, forwardButton, skipButton);
const row2 = new disbut.MessageActionRow().addComponents(infoButton, replayButton, shuffleButton, lyricsButton, queuePrintButton);

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
const emojis = {
    cd_spin: './cd_spin.gif',
    cd_still: './cd_still.jpg',
    speaker0: './speaker0.png',
    speaker1: './speaker1.gif',
    speaker2: './speaker2.gif',
    speaker3: './speaker3.gif',
    loading: './loading.gif',
    finished: './finished.gif'
};

async function authorize(callback, args) {
    let credentials = JSON.parse(fs.readFileSync(CREDENTIAL_PATH));
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    let token = fs.readFileSync(TOKEN_PATH);
    if (token == null)
        return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    if (typeof args !== 'undefined') {
        return await callback(oAuth2Client, args);
    } else {
        return await callback(oAuth2Client);
    }
}
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, async(err, token) => {
            if (err)
                return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err)
                    return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            return await callback(oAuth2Client);
        });
    });
}
function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}
// replace the 'n'th character of 's' with 't'
function replaceAt(s, n, t) {
    return s.substr(0, n) + t + s.substr(n + 1);
}
function fmtMSS(s) {
    return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s
}

async function updateGbs(auth) {
    const sheets = google.sheets({
        version: 'v4',
        auth
    });
    let res = await sheets.spreadsheets.values.get({
        spreadsheetId: '1IevfLHINuRnPMH7NtbdU7sB6Zhn4T9Pvu4mcyR0p-Ss',
        range: 'Sheet1'
    });
    let embedArr = [];
    let tmp = '';
    for (let i = 0; i < res.data.values.length; i++) {
        if (tmp.concat((res.data.values[i])[0], '\n').length > 2048) {
            if (embedArr.length === 0) {
                embedArr.push(new Discord.MessageEmbed().setAuthor('Leak Tracker:').setDescription(tmp));
            } else {
                embedArr.push(new Discord.MessageEmbed().setDescription(tmp));
            }
            tmp = (res.data.values[i])[0];
        } else {
            if (tmp.length == 0) {
                tmp = tmp.concat((res.data.values[i])[0]);
            } else {
                tmp = tmp.concat(('\n'), (res.data.values[i])[0]);
            }
        }
    }
    embedArr.push(new Discord.MessageEmbed().setDescription(tmp));
    return embedArr;
}
async function updateDiscography(auth) {
    const drive = google.drive({
        version: 'v3',
        auth
    });
    let res = await drive.files.list({
        pageSize: 1000,
        q: "mimeType='audio/mpeg' OR fileExtension='wav' OR fileExtension='flac' OR fileExtension='m4a'",
        fields: 'files(id, name, size)',
    });
    for (let i = 0; i < res.data.files.length; i++) {
        res.data.files[i].url = ('https://drive.google.com/uc?export=download&id=').concat(res.data.files[i].id);
    }
    discography = res.data.files;
}
async function updateDiscographyInfo(auth) {
    const sheets = google.sheets({
        version: 'v4',
        auth
    });
    let res = await sheets.spreadsheets.values.get({
        spreadsheetId: '1PVxOTf2Sf8rfB29tj4U7FRoHmcSlXJrJldZxqRjTZrM',
        range: 'Sheet1'
    });
    discographyInfo = res.data.values.slice(1);
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
const fileNameFilter = ['.mp3', '.wav', '.flac', '.m4a'];
const wordFilter = ['\\(v\\d\\)', 'v\\d', '\\(snippet\\)', '\\(master\\)', '\\(solo\\)', '\\(Sessions\\)', 'bass', 'boost', 'extended'];
const geniusFilter = [...fileNameFilter, ...wordFilter];
async function updateGeniusData(song) {
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
        let options = {
            apiKey: 'mNzF4MraVXsxJ1dXVXPnFvE6HbadUnQuin9ctv27zkskHxoYM1UxLUNpdIsc5xlJ',
            title: geniusTitle.replace(/\s\s/g, ' ').trim(),
            artist: geniusArtist,
            optimizeQuery: false
        };
        let songSearch = await searchSong(options);
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
        fileId: song.id,
        alt: 'media'
    }, {
        responseType: 'stream'
    });
    song.path = basePath.concat(song.name).replace(/\s/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/&/g, '').replace(/'/g, '').replace(/\$/g, 'S');
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
async function songSearchInfoMatch(song) {
    for (let i = 0; i < discographyInfo.length; i++) {
        if (discographyInfo[i][0] == song.name) {
            return discographyInfo[i];
        }
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
        delete fileSearch[0].hits;
        delete fileSearch[0].exactMatches;
        if (quickSearch != null && quickSearch === true) {
            return fileSearch[0];
        }
        return await authorize(download, fileSearch[0]);
    }
}
async function fileSearchList(interaction, files) {
    let keywords = interaction.data.options[0].value.trim().split(/ +/);
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
    if (fileSearch.length > 0) {
        fileSearch.sort((a, b) => b.hits - a.hits);
        fileSearch = fileSearch.filter(item => item.hits >= fileSearch[0].hits);
        fileSearch.sort((a, b) => b.exactMatches - a.exactMatches);
        fileSearch.sort((a, b) => a.name.length - b.name.length);
        let filesMsg = '';
        let embedArr = [];
        for (let i = 0; i < fileSearch.length; i++) {
            if (filesMsg.concat(fileSearch[i].name, '\n').length > 2048) {
                if (embedArr.length === 0) {
                    embedArr.push(new Discord.MessageEmbed().setColor(color.searchList).setAuthor(`Search result for "${interaction.data.options[0].value.trim()}" (${fileSearch.length}):`).setDescription(filesMsg));
                } else {
                    embedArr.push(new Discord.MessageEmbed().setColor(color.searchList).setDescription(filesMsg));
                }
                filesMsg = '[' + fileSearch[i].name + '](' + fileSearch[i].url + ')';
            } else {
                if (filesMsg.length == 0) {
                    filesMsg = filesMsg.concat('[' + fileSearch[i].name + '](' + fileSearch[i].url + ')');
                } else {
                    filesMsg = filesMsg.concat('\n', '[' + fileSearch[i].name + '](' + fileSearch[i].url + ')');
                }
            }
        }
        if (embedArr.length === 0) {
            embedArr.push(new Discord.MessageEmbed().setColor(color.searchList).setAuthor(`Search result for "${interaction.data.options[0].value.trim()}" (${fileSearch.length}):`).setDescription(filesMsg));
        } else {
            embedArr.push(new Discord.MessageEmbed().setColor(color.searchList).setDescription(filesMsg));
        }
        let user = await getUser(interaction);
        embedArr[embedArr.length - 1] = embedArr[embedArr.length - 1].setFooter(`${user.username}`, user.avatarURL({
                    dynamic: true
                }));
        return embedArr;
    } else {
        return null;
    }
}
function createPlaybackMessage() {
    let timeElapsed;
    if (dispatcher != null) {
        if (seeking && dispatcher.paused) {
            timeElapsed = streamOptions.seek;
        } else {
            timeElapsed = Math.round(dispatcher.streamTime / 1000) + streamOptions.seek;
        }
    } else {
        timeElapsed = streamOptions.seek;
    }
    let playbackTime,
    playbackIndicatorOffset;
    if (playing && currentSong != null) {
        playbackTime = `${loadedEmojis.get('cd_spin')}  ${fmtMSS(timeElapsed)} / ${fmtMSS(Math.round(currentSong.duration))}  `;
        playbackIndicatorOffset = Math.round((playbackBarLength - 1) * ((timeElapsed / currentSong.duration <= 1) ? timeElapsed / currentSong.duration : 1));
    } else if (queue.length > 0) {
        playbackTime = `${loadedEmojis.get('cd_spin')}  ${fmtMSS(timeElapsed)} / ${fmtMSS(Math.round(queue[0].duration))}  `;
        playbackIndicatorOffset = Math.round((playbackBarLength - 1) * ((timeElapsed / queue[0].duration <= 1) ? timeElapsed / queue[0].duration : 1));
    } else if (dispatcher != null && dispatcher.paused) {
        playbackTime = `${loadedEmojis.get('cd_still')}  ${fmtMSS(timeElapsed)} / ${fmtMSS(Math.round(currentSong.duration))}  `;
        playbackIndicatorOffset = Math.round((playbackBarLength - 1) * ((timeElapsed / currentSong.duration <= 1) ? timeElapsed / currentSong.duration : 1));
    } else {
        playbackTime = `${loadedEmojis.get('cd_still')}  ${fmtMSS(timeElapsed)} / ${fmtMSS(0)}  `;
        playbackIndicatorOffset = 0;
    }
    let playbackBar = verticalBarChar + horizontalBarChar.repeat(playbackBarLength) + verticalBarChar;
    let playbackIndicatorBar = playbackTime + replaceAt(playbackBar, 1 + playbackIndicatorOffset, `<:white_circle:785571570768805928>`);
    return new Discord.MessageEmbed().setColor(color.playback).setDescription(playbackIndicatorBar);
}
async function updatePlaybackMessages(interaction, embed) {
    if (playingMsg != null) {
        playingMsg.delete().then().catch(function (error) {});
    }
    playingMsg = await client.channels.cache.get(interaction.channel_id).send(embed);
    if (playbackBar) {
        if (playbackMsg != null) {
            playbackMsg.delete().then().catch(function (error) {});
        }
        let row1;
        if (playing) {
            row1 = row1playing;
        } else {
            row1 = row1paused;
        }
        playbackMsg = await client.channels.cache.get(interaction.channel_id).send({
            embed: createPlaybackMessage(),
            components: [row1, row2]
        });
        if (playing && playbackInterval === null) {
            playbackInterval = setInterval(async function () {
                if (playing || (dispatcher != null && dispatcher.paused)) {
                    playbackMsg.edit(createPlaybackMessage()).then().catch(function (error) {});
                } else {
                    clearInterval(playbackInterval);
                    playbackInterval = null;
                    if (playbackMsg != null) {
                        playbackMsg.delete().then().catch(function (error) {});
                    }
                }
            }, playbackRefreshTime * 1000);
        }
    }
}
async function songEmbed(interaction, song, annotation) {
    let user = await getUser(interaction);
    let embed = new Discord.MessageEmbed().setTitle(song.name).setURL(song.url).setAuthor(annotation).setDescription(`Size: ${(song.size * Math.pow(1024, -2)).toFixed(2)} MB, Length: ${fmtMSS(song.duration)}, Bitrate: ${song.bitrate} kbps`);
    if (annotation !== 'New Leak:' && annotation !== 'OG File Updated:' && annotation !== 'New Stem Edit:' && annotation !== 'New Song:') {
        embed.setFooter(`${user.username}`, user.avatarURL({
                dynamic: true
            }));
    }
    if (song.albumArt != null) {
        embed.setThumbnail(song.albumArt);
    }
    if (annotation.toLowerCase().includes('play') || annotation.toLowerCase().includes('resume')) {
        embed.setColor(color.play);
    } else if (annotation.toLowerCase().includes('lyrics')) {
        embed.setColor(color.lyrics);
    } else if (annotation.toLowerCase().includes('search')) {
        embed.setColor(color.search);
    } else if (annotation.toLowerCase().includes('pause')) {
        embed.setColor(color.pause);
    } else if (annotation.toLowerCase().includes('queue')) {
        embed.setColor(color.queue);
    } else if (annotation == 'New Leak:') {
        embed.setColor(color.newleak);
    } else if (annotation == 'OG File Updated:') {
        embed.setColor(color.ogfileupdate);
    } else if (annotation == 'New Stem Edit:') {
        embed.setColor(color.stemedit);
    } else if (annotation == 'New Song:') {
        embed.setColor(color.newsong);
    }
    return embed;
}
async function songEmbedInfo(interaction, song, info, annotation) {
    let user = await getUser(interaction);
    let embed = new Discord.MessageEmbed().setTitle(song.name).setURL(song.url).setAuthor(annotation).setDescription(`Size: ${(song.size * Math.pow(1024, -2)).toFixed(2)} MB, Length: ${fmtMSS(song.duration)}, Bitrate: ${song.bitrate} kbps`).setColor(color.info);
    embed.setFooter(`${user.username}`, user.avatarURL({
            dynamic: true
        }));
    if (song.albumArt != null) {
        embed.setThumbnail(song.albumArt);
    }
    if (info.length < 3) {
        for (i = info.length; i < 7; i++) {
            info[i] = 'N/A';
        }
    }
    for (let i = 0; i < info.length; i++) {
        info[i] = info[i].replace(new RegExp('#', 'i'), '');
    }
    let fieldDate;
    if (info[4].toLowerCase().includes('leaked')) {
        fieldDate = 'Leaked:';
    } else {
        fieldDate = 'Released:';
    }
    if (info[6] == 'juicethekidd') {
        info[6] = info[6].toUpperCase() + ' (~2014 - February, 2017)';
    } else if (info[6] == '999') {
        info[6] = info[6] + ' (March 2017 - June 15th, 2017)';
    } else if (info[6] == 'gbgr') {
        info[6] = info[6].toUpperCase() + ' (June 16th, 2017 - May 23rd, 2018)';
    } else if (info[6] == 'wod') {
        info[6] = info[6].toUpperCase() + ' (May 24th, 2018 - October 19th, 2018)';
    } else if (info[6] == 'drfl') {
        info[6] = info[6].toUpperCase() + ' (October 20th, 2018 - March 8th, 2019)';
    } else if (info[6] == 'jw3') {
        info[6] = info[6].toUpperCase() + ' (March 9th, 2019 - December 8th, 2019)';
    }
    embed.addFields({
        name: 'Produced By:',
        value: info[2]
    }, {
        name: 'Recorded:',
        value: info[3].replace(new RegExp('Recorded:\n|Recorded\n', 'i'), '').replace(new RegExp('\\.', 'i'), '')
    }, {
        name: fieldDate,
        value: info[4].replace(new RegExp('Leaked | Released ', 'i'), '').replace(new RegExp('\\.', 'i'), '')
    }, {
        name: 'Original File Name:',
        value: info[5].replace(new RegExp('File Name:\n|File Name:\r\n', 'i'), '')
    }, {
        name: 'Era:',
        value: info[6]
    });
    return embed;
}
async function songEmbedLink(interaction, song) {
    let user = await getUser(interaction);
    return new Discord.MessageEmbed().setTitle(song.name).setURL(song.url).setColor(color.quickSearch).setDescription(`Size: ${(song.size * Math.pow(1024, -2)).toFixed(2)} MB`).setAuthor(`Search result for "${interaction.data.options[0].value.trim()}":`).setFooter(`${user.username}`, user.avatarURL({
            dynamic: true
        }));
}
async function getMessages(channel) {
    const sum_messages = [];
    let last_id;
    while (true) {
        const options = {
            limit: 100
        };
        if (last_id) {
            options.before = last_id;
        }
        const messages = await channel.messages.fetch(options);
        if (messages.last() == null) {
            break;
        }
        sum_messages.push(...messages.array());
        last_id = messages.last().id;
        if (messages.size != 100) {
            break;
        }
    }
    return sum_messages;
}
async function getUser(interaction) {
    let userID;
    if (interaction.clicker != null) {
        return interaction.clicker.user;
    } else if (interaction.member != null) {
        userID = interaction.member.user.id;
    } else {
        userID = interaction.user.id;
    }
    if (client.users.cache.get(userID) != null) {
        return client.users.cache.get(userID);
    } else {
        return await client.users.fetch(userID);
    }
}
async function getChannel(interaction) {
    if (client.channels.cache.get(interaction.channel_id) != null) {
        return client.channels.cache.get(interaction.channel_id);
    } else {
        return await client.channels.fetch(interaction.channel_id);
    }
}
async function getEmoji(id) {
    if (client.emojis.cache.get(id) != null) {
        return client.emojis.cache.get(id);
    } else {
        return await client.emojis.fetch(id);
    }
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
async function updateSongStatsCloud(auth) {
    const sheets = google.sheets({
        version: 'v4',
        auth
    });
    let res = await sheets.spreadsheets.values.get({
        spreadsheetId: '153HpK76Knk0jTgRtLkB8BDIxV7mCoyhTF1dOsB2dutA',
        range: 'Sheet1'
    });
    return res.data.values;
}
function printStats(num) {
    if (!fs.existsSync(statsFile)) {
        fs.writeFileSync(statsFile, JSON.stringify([]));
    }
    let stats = JSON.parse(fs.readFileSync(statsFile));
    if (stats.length > 0) {
        let embedArr = [];
        let tmp = '';
        if (num == 0 || num > stats.length) {
            num = stats.length;
        }
        for (let i = 0; i < num; i++) {
            if (tmp.concat(stats[i].name, ' - ', stats[i].queries, '\n').length > 2048) {
                if (embedArr.length === 0) {
                    embedArr.push(new Discord.MessageEmbed().setAuthor(`Total Songs: ${discography.length}\nTop ${num} Queried Songs:\n`).setDescription(tmp));
                } else {
                    embedArr.push(new Discord.MessageEmbed().setDescription(tmp));
                }
                tmp = '[' + stats[i].name + '](' + stats[i].url + ')' + ' — ' + stats[i].queries + '\n';
            } else {
                tmp = tmp.concat('[' + stats[i].name + '](' + stats[i].url + ')' + ' — ' + stats[i].queries + '\n')
            }
        }
        if (embedArr.length === 0) {
            embedArr.push(new Discord.MessageEmbed().setAuthor(`Total Songs: ${discography.length}\nTop ${num} Queried Songs:\n`).setDescription(tmp));
        } else {
            embedArr.push(new Discord.MessageEmbed().setDescription(tmp));
        }
        for (embed of embedArr) {
            embed.setColor(color.stats);
        }
        return embedArr;
    } else {
        return [];
    }
}
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
async function onFinish(interaction) {
    streamOptions.seek = 0;
    seeking = false;
    if (replay) {
        dispatcher = connection.play(currentSong.path, streamOptions);
        updateSongStats(currentSong);
        dispatcher.on('error', async() => {
            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Dispatcher error occurred'));
            return setTimeout(function () {
                errorMsg.delete().then().catch(function (error) {});
            }, messageDeleteTime * 1000);
        });
        dispatcher.on('finish', async() => onFinish(interaction));
    } else if (queue.length > 0) {
        let lastSongPath = null;
        if (currentSong != null) {
            lastSongPath = currentSong.path;
        }
        currentSong = queue.splice(0, 1)[0];
        dispatcher = connection.play(currentSong.path, streamOptions);
        await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Playing next in queue:'));
        updateSongStats(currentSong);
        dispatcher.on('error', async() => {
            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Dispatcher error occurred'));
            return setTimeout(function () {
                errorMsg.delete().then().catch(function (error) {});
            }, messageDeleteTime * 1000);
        });
        dispatcher.on('finish', async() => onFinish(interaction));
        if (lastSongPath && lastSongPath !== currentSong.path) {
            deleteFile(lastSongPath);
        }
    } else if (shuffle) {
        await discographyRefresh(interaction);
        let lastSongPath = null;
        if (playing && currentSong != null) {
            lastSongPath = currentSong.path;
        }
        if (playingMsg != null) {
            playingMsg.delete().then().catch(function (error) {});
        }
        currentSong = await authorize(download, discography[Math.floor(Math.random() * discography.length)]);
        dispatcher = connection.play(currentSong.path, streamOptions);
        await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Playing:'));
        updateSongStats(currentSong);
        dispatcher.on('error', async() => {
            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Dispatcher error occurred'));
            return setTimeout(function () {
                errorMsg.delete().then().catch(function (error) {});
            }, messageDeleteTime * 1000);
        });
        dispatcher.on('finish', async() => onFinish(interaction));
        if (lastSongPath && currentSong != null && lastSongPath !== currentSong.path) {
            deleteFile(lastSongPath);
        }
    } else {
        disconnect();
    }
}
async function connect(interaction) {
    let user;
    if (client.guilds.cache.get(bot.guild_id).members.cache.get(interaction.member.user.id) != null) {
        user = client.guilds.cache.get(bot.guild_id).members.cache.get(interaction.member.user.id);
    } else if (typeof(await client.guilds.cache.get(bot.guild_id).members.fetch(interaction.member.user.id)) != null) {
        user = await client.guilds.cache.get(bot.guild_id).members.fetch(interaction.member.user.id);
    } else {
        let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Could not find user'));
        setTimeout(function () {
            errorMsg.delete().then().catch(function (error) {});
        }, messageDeleteTime * 1000);
        return false;
    }
    if ('voice' in user && user.voice.channel) {
        vc = user.voice.channel;
    } else {
        let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('You need to join a voice channel first!'));
        setTimeout(function () {
            errorMsg.delete().then().catch(function (error) {});
        }, messageDeleteTime * 1000);
        return false;
    }
    try {
        connection = await vc.join();
        return true;
    } catch (err) {
        let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Failed to connect'));
        setTimeout(function () {
            errorMsg.delete().then().catch(function (error) {});
        }, messageDeleteTime * 1000);
        return false;
    }
}
async function isInVC(interaction) {
    let user;
    if (client.guilds.cache.get(bot.guild_id).members.cache.get(interaction.clicker.id) != null) {
        user = client.guilds.cache.get(bot.guild_id).members.cache.get(interaction.clicker.id);
    } else if (typeof(await client.guilds.cache.get(bot.guild_id).members.fetch(interaction.clicker.id)) != null) {
        user = await client.guilds.cache.get(bot.guild_id).members.fetch(interaction.clicker.id);
    } else {
        return false;
    }
    if ('voice' in user && user.voice.channel) {
        vc = user.voice.channel;
    } else {
        return false;
    }
    return vc.guild.members.cache.some(usr => usr.id === user.id);
}
function disconnect() {
    if (connection != null) {
        if (playingMsg != null) {
            playingMsg.delete().then().catch(function (error) {});
        }
        connection.disconnect();
        if (currentSong != null) {
            deleteFile(currentSong.path);
            currentSong = null;
        }
        playing = false;
        streamOptions.seek = 0;
        seeking = false;
        if (playbackBar) {
            clearInterval(playbackInterval);
            playbackInterval = null;
            playbackMsg.delete().then().catch(function (error) {});
        }
    }
}
async function playSong(interaction, embeddedSong) {
    if (currentSong != null) {
        dispatcher = connection.play(currentSong.path, streamOptions);
        playing = true;
        lastPlayingUser = await getUser(interaction);
        await updatePlaybackMessages(interaction, embeddedSong);
        if (!seeking) {
            updateSongStats(currentSong);
        }
        dispatcher.on('error', async() => {
            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setDescription(new Discord.MessageEmbed().setDescription('Dispatcher error occurred')));
            return setTimeout(function () {
                errorMsg.delete().then().catch(function (error) {});
            }, messageDeleteTime * 1000);
        });
        dispatcher.on('finish', async() => onFinish(interaction));
    } else {
        let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
        setTimeout(function () {
            errorMsg.delete().then().catch(function (error) {});
        }, messageDeleteTime * 1000);
    }
}
async function discographyRefresh(interaction, force) {
    if (discographyRefreshTime != null) {
        if (((new Date()).getTime() - discographyRefreshTime.getTime()) / 1000 > refreshTime * 60 || (force != null && force === 'force')) {
            await authorize(updateDiscography);
            discographyRefreshTime = new Date();
            let refreshMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(artistName + ` discography refreshed ${loadedEmojis.get('finished')}`));
            setTimeout(function () {
                refreshMessage.delete().then().catch(function (error) {});
            }, messageDeleteTime * 1000);
        }
    } else {
        await authorize(updateDiscography);
        discographyRefreshTime = new Date();
        let refreshMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(artistName + ` discography refreshed ${loadedEmojis.get('finished')}`));
        setTimeout(function () {
            refreshMessage.delete().then().catch(function (error) {});
        }, messageDeleteTime * 1000);
    }
}
async function discographyInfoRefresh(interaction, force) {
    if (discographyInfoRefreshTime != null) {
        if (((new Date()).getTime() - discographyInfoRefreshTime.getTime()) / 1000 > refreshTime * 60 || (force != null && force === 'force')) {
            await authorize(updateDiscographyInfo);
            discographyInfoRefreshTime = new Date();
            let refreshMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(artistName + ` discography info refreshed ${loadedEmojis.get('finished')}`));
            setTimeout(function () {
                refreshMessage.delete().then().catch(function (error) {});
            }, messageDeleteTime * 1000);
        }
    } else {
        await authorize(updateDiscographyInfo);
        discographyInfoRefreshTime = new Date();
        let refreshMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(artistName + ` discography info refreshed ${loadedEmojis.get('finished')}`));
        setTimeout(function () {
            refreshMessage.delete().then().catch(function (error) {});
        }, messageDeleteTime * 1000);
    }
}
function fixURL(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        return "http://" + url;
    } else {
        return url;
    }
}
async function printSongLyrics(interaction, song, embeddedSong) {
    if (song.geniusUrl != null) {
        let lyrics = await getLyrics(song.geniusUrl);
        let annotation;
        if (interaction.data != null && interaction.data.options != null) {
            annotation = `Lyrics search result for "${interaction.data.options[0].value.trim()}":`;
            await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, annotation));
        } else {
            annotation = 'Lyrics:';
            let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, annotation));
            setTimeout(function () {
                msg.delete().then().catch(function (error) {});
            }, lyricsDeleteTime * 60 * 1000);
        }
        let lyricsArr = lyrics.match(/[\s\S]{1,2048}/g);
        let msgArr = [];
        if (interaction.data != null && interaction.data.options != null) {
            for (let lyric of lyricsArr) {
                let lyricsMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.lyrics).setDescription(lyric));
                lyricsMsg.push(lyricsMsg);
            }
            if (autodelete) {
                setTimeout(function () {
                    for (let msg of msgArr) {
                        msg.delete().then().catch(function (error) {});
                    }
                }, lyricsDeleteTime * 60 * 1000);
            }
        } else {
            let index = 0;
            for (let lyric of lyricsArr) {
                let lyricsMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.lyrics).setDescription(lyric));
                msgArr.push(lyricsMsg);
                setTimeout(function () {
                    for (let msg of msgArr) {
                        msg.delete().then().catch(function (error) {});
                    }
                }, lyricsDeleteTime * 60 * 1000);
            }
        }
        if (embeddedSong != null) {
            await updatePlaybackMessages(interaction, embeddedSong);
        }
    } else {
        let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No lyrics found'));
        setTimeout(function () {
            errorMsg.delete().then().catch(function (error) {});
        }, messageDeleteTime * 1000);
    }
}
async function printSongInfoLyrics(interaction, song, embeddedSong) {
    if (song.geniusUrl != null) {
        let lyrics = await getLyrics(song.geniusUrl);
        await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, 'Lyrics:'));
        let lyricsArr = lyrics.match(/[\s\S]{1,2048}/g);
        for (let lyric of lyricsArr) {
            await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.lyrics).setDescription(lyric));
        }
        if (embeddedSong != null) {
            await updatePlaybackMessages(interaction, embeddedSong);
        }
    } else {
        let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No lyrics found'));
        setTimeout(function () {
            errorMsg.delete().then().catch(function (error) {});
        }, messageDeleteTime * 1000);
    }
}
async function createInteractionDeferredResponse(interaction) {
    await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 5
        }
    });
    return {
        interaction: interaction,
        clear(embed) {
            client.api.webhooks(client.user.id, this.interaction.token).messages('@original').patch({
                data: {
                    embeds: [embed]
                }
            });
        }
    };
}
whiteListPerms = new Map([
            ['serverAdmin', 'Server Administrator'],
            ['directMessageSupport', 'Direct Message Support']
        ]);
whiteListedFunctions = ['updateleaktracker', 'newleak', 'newstemedit', 'sendembed', 'whitelist', 'join', 'ogfileupdate', 'autodelete'];
const commands = [{
        name: "play",
        description: "Play song",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "playrandom",
        description: "Play random song",
    }, {
        name: "playing",
        description: "Show currently playing, paused, or queued song"
    }, {
        name: "queue",
        description: "Queue song",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "queuerandom",
        description: "Queue random song"
    }, {
        name: "queueremove",
        description: "Remove song from queue",
        options: [{
                name: "integer",
                description: "Number in queue",
                type: 4,
                required: true
            }
        ]
    }, {
        name: "queueclear",
        description: "Clear queue"
    }, {
        name: "queueinsert",
        description: "Insert song to queue",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }, {
                name: "integer",
                description: "Number in queue",
                type: 4,
                required: true
            }
        ]
    }, {
        name: "queuereplace",
        description: "Replace song to queue",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }, {
                name: "integer",
                description: "Number in queue",
                type: 4,
                required: true
            }
        ]
    }, {
        name: "queueprint",
        description: "Print queue"
    }, {
        name: "search",
        description: "Search song",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "searchrandom",
        description: "Search random song"
    }, {
        name: "list",
        description: "List search query",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "quicksearch",
        description: "Quick song search",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "pause",
        description: "Pause song"
    }, {
        name: "resume",
        description: "Resume song"
    }, {
        name: "disconnect",
        description: "Disconnect"
    }, {
        name: "skip",
        description: "Skip song"
    }, {
        name: "replay",
        description: "Toggle replay mode"
    }, {
        name: "shuffle",
        description: "Toggle shuffle mode"
    }, {
        name: "volume",
        description: "Change or display volume level",
        options: [{
                name: "integer",
                description: "Volume level (0 - 100)",
                type: 4,
                required: false
            }
        ]
    }, {
        name: "playback",
        description: "Toggle playback controls"
    }, {
        name: "seek",
        description: "Seek song",
        options: [{
                name: "timestamp",
                description: "Seeks the playing track to the specified timestamp (mm:ss)",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "lyrics",
        description: "Show song lyrics",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "refresh",
        description: "Refresh music library"
    }, {
        name: "refreshinfo",
        description: "Refresh music info"
    }, {
        name: "stats",
        description: "Show top queried songs",
        options: [{
                name: "integer",
                description: "Number of top songs queried",
                type: 3,
                required: false
            }
        ]
    }, {
        name: "updateleaktracker",
        description: "Update leak tracker"
    }, {
        name: "newleak",
        description: "Post new leak",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "newstemedit",
        description: "Post new stem edit",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "newsong",
        description: "Post new song",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "ogfileupdate",
        description: "Notify leaks channel of updated OG file",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "join",
        description: "Join the current voice channel"
    }, {
        name: "sendembed",
        description: "Post new embed",
        options: [{
                name: "description",
                description: "Set description",
                type: 3,
                required: true
            }, {
                name: "author",
                description: "Set author text",
                type: 3,
                required: false
            }, {
                name: "title",
                description: "Set title",
                type: 3,
                required: false
            }, {
                name: "titleurl",
                description: "Set title URL",
                type: 3,
                required: false
            }, {
                name: "imageurl",
                description: "Set image",
                type: 3,
                required: false
            }, {
                name: "thumbnailurl",
                description: "Set thumbnail",
                type: 3,
                required: false
            }, {
                name: "color",
                description: "Set color",
                type: 3,
                required: false
            }
        ]
    }, {
        name: "info",
        description: "Show song info",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "infolyrics",
        description: "Show song info and lyrics",
        options: [{
                name: "keywords",
                description: "Name of song",
                type: 3,
                required: true
            }
        ]
    }, {
        name: "whitelist",
        description: "Add user to whitelist",
        options: [{
                name: "user",
                description: "User @",
                type: 6,
                required: true
            }, {
                name: "permission",
                description: "Permission to grant",
                type: 3,
                required: true,
                choices: [{
                        name: whiteListPerms.get('serverAdmin'),
                        value: "serverAdmin"
                    }, {
                        name: whiteListPerms.get('directMessageSupport'),
                        value: "directMessageSupport"
                    }
                ]
            }
        ]
    }, {
        name: "autodelete",
        description: "Toggle auto delete mode"
    }, {
        name: "help",
        description: "List all commands"
    }
];

async function createCommand(command) {
    console.log('Adding: ', command.name);
    try {
        await client.api.applications(client.user.id).commands.post({
            data: command
        });
    } catch (error) {
        if (error.response == null || error.response.data.retry_after == null) {
            return console.log(error);
        }
        console.log(`Waiting ${error.response.data.retry_after}s`);
        await new Promise(resolve => setTimeout(resolve, error.response.data.retry_after * 1000));
        await createCommand(command);
    }
    console.log('Added');
}
async function deleteCommand(command) {
    console.log('Deleting: ', command.name);
    try {
        await client.api.applications(client.user.id).commands(command.id).delete();
    } catch (error) {
        if (error.response.data.retry_after == null) {
            return console.log(error);
        }
        console.log(`Waiting ${error.response.data.retry_after}s`);
        await new Promise(resolve => setTimeout(resolve, error.response.data.retry_after * 1000));
        await deleteCommand(command);
    }
    console.log('Deleted');
}
async function updateCommands(commands) {
    return new Promise(async resolve => {
        let currentCommands = await client.api.applications(client.user.id).commands.get();
        for (let command of commands) {
            let included = false;
            for (let currentCommand of currentCommands) {
                if (currentCommand.name === command.name) {
                    included = true;
                    break;
                }
            }
            if (!included) {
                await createCommand(command);
            }
        }
        for (let currentCommand of currentCommands) {
            let included = false;
            for (let command of commands) {
                if (currentCommand.name === command.name) {
                    included = true;
                    break;
                }
            }
            if (!included) {
                await deleteCommand(currentCommand);
            }
        }
        resolve(await client.api.applications(client.user.id).commands.get());
    });
}
function loadWhiteList() {
    if (!fs.existsSync(whiteListFile)) {
        fs.writeFileSync(whiteListFile, JSON.stringify([{
                        id: '215276753566826497',
                        perms: {
                            serverAdmin: true,
                            directMessageSupport: true
                        }
                    }
                ]));
    }
    for (let user of JSON.parse(fs.readFileSync(whiteListFile))) {
        whiteList.set(user.id, user.perms);
    }
}
async function loadEmojis() {
    let madeChanges = false;
    if (bot.emojis == null) {
        bot.emojis = {};
        for (let e in emojis) {
            if ((await client.guilds.fetch(bot.guild_id)).emojis.cache.some(em => (em.name === e))) {
                console.log(`Found existing emoji with name ${e}`);
                let emojiFound = (await client.guilds.fetch(bot.guild_id)).emojis.cache.find(em => (em.name === e));
                bot.emojis[e] = emojiFound.id;
            } else {
                let emojiUpload = await client.guilds.cache.get(bot.guild_id).emojis.create(emojis[e], e);
                console.log(`Created new emoji with name ${e}`);
                bot.emojis[e] = emojiUpload.id;
            }
        }
        madeChanges = true;
    } else {
        for (let e in emojis) {
            let included = false;
            for (let emoji in bot.emojis) {
                if (emoji === e && (await client.guilds.fetch(bot.guild_id)).emojis.cache.some(em => (em.name === emoji && em.id === bot.emojis[emoji]))) {
                    included = true;
                    break;
                }
            }
            if (!included) {
                let emojiUpload = await client.guilds.cache.get(bot.guild_id).emojis.create(emojis[e], e);
                console.log(`Created new emoji with name ${e}`);
                bot.emojis[e] = emojiUpload.id;
                madeChanges = true;
            }
        }
    }
    if (madeChanges) {
        let tokenMap = JSON.parse(fs.readFileSync(tokenMapPath));
        for (let i = 0; i < tokenMap.length; i++) {
            if (tokenMap[i].name === fileName) {
                tokenMap[i] = bot;
                break;
            }
        }
        fs.writeFileSync(tokenMapPath, JSON.stringify(tokenMap));
    }
    for (let emoji in bot.emojis) {
        loadedEmojis.set(emoji, client.emojis.cache.get(bot.emojis[emoji]));
    }
}
async function hasPermission(interaction, channel) {
    if (channel.type === 'dm' &&
        ((await(await client.guilds.fetch(bot.guild_id)).members.fetch(interaction.user.id)).roles.cache.some(role => role.id === bot.booster_role_id) ||
            (whiteList.get(interaction.user.id) != null && whiteList.get(interaction.user.id).directMessageSupport))) {
        return true;
    } else if (interaction.guild_id != null && interaction.guild_id === bot.guild_id) {
        return true;
    } else {
        return false;
    }
}
const functionMap = new Map([
            ['play', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let lastSongPath = null;
                        if (playing && currentSong != null) {
                            lastSongPath = currentSong.path;
                        }
                        currentSong = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (currentSong != null) {
                            streamOptions.seek = 0;
                            seeking = false;
                            if (!(await connect(interaction)))
                                return;
                            await playSong(interaction, await songEmbed(interaction, currentSong, 'Playing:'));
                            if (lastSongPath && currentSong != null && lastSongPath !== currentSong.path) {
                                deleteFile(lastSongPath);
                            }
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['playrandom', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let lastSongPath = null;
                        if (playing && currentSong != null) {
                            lastSongPath = currentSong.path;
                        }
                        currentSong = await authorize(download, discography[Math.floor(Math.random() * discography.length)]);
                        streamOptions.seek = 0;
                        seeking = false;
                        if (!(await connect(interaction)))
                            return;
                        await playSong(interaction, await songEmbed(interaction, currentSong, 'Playing:'));
                        if (lastSongPath && currentSong != null && lastSongPath !== currentSong.path) {
                            deleteFile(lastSongPath);
                        }
                    }
                }
            ],
            ['playing', {
                    async execute(interaction) {
                        if (playing && currentSong != null) {
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Playing:'));
                        } else if (currentSong != null && dispatcher != null && dispatcher.paused) {
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Paused:'));
                        } else if (queue.length > 0) {
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, queue[0], 'Queued:'));
                        }
                    }
                }
            ],
            ['queue', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let song = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (song != null) {
                            queue.push(song);
                            let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, 'Queued:'));
                            setTimeout(function () {
                                msg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['queuerandom', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let randomSong = await authorize(download, discography[Math.floor(Math.random() * discography.length)]);
                        queue.push(randomSong);
                        let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, randomSong, 'Queued random song:'));
                        setTimeout(function () {
                            msg.delete().then().catch(function (error) {});
                        }, messageDeleteTime * 1000);
                    }
                }
            ],
            ['queueremove', {
                    async execute(interaction) {
                        if (interaction.data.options[1].value > queue.length || interaction.data.options[1].value <= 0) {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Invalid queue number'));
                            return setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                        let removedSong = queue.splice(interaction.data.options[0].value - 1, 1)[0];
                        deleteFile(removedSong.path);
                        let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, removedSong, 'Removed from queue:'));
                        setTimeout(function () {
                            msg.delete().then().catch(function (error) {});
                        }, messageDeleteTime * 1000);
                    }
                }
            ],
            ['queueclear', {
                    async execute(interaction) {
                        if (queue.length > 0) {
                            for (let song of queue) {
                                deleteFile(song.path);
                            }
                        }
                        queue = [];
                        let msg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setDescription(`Queue cleared ${loadedEmojis.get('finished')}`));
                        setTimeout(function () {
                            msg.delete().then().catch(function (error) {});
                        }, messageDeleteTime * 1000);
                    }
                }
            ],
            ['queueinsert', {
                    async execute(interaction) {
                        if (interaction.data.options[1].value > queue.length || interaction.data.options[1].value <= 0) {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Invalid queue number'));
                            return setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                        await discographyRefresh(interaction);
                        let song = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (song != null) {
                            queue.splice(interaction.data.options[1].value - 1, 0, song);
                            let orderOnes = Math.floor(interaction.data.options[1].value % 10);
                            let orderTens = Math.floor(interaction.data.options[1].value / 10 % 10);
                            let orderSuffix;
                            if (orderOnes > 3 || orderTens == 1 || orderOnes == 0) {
                                orderSuffix = `th`;
                            } else if (orderOnes == 1) {
                                orderSuffix = `st`;
                            } else if (orderOnes == 2) {
                                orderSuffix = `nd`;
                            } else if (orderOnes == 3) {
                                orderSuffix = `rd`;
                            }
                            let order = interaction.data.options[1].value.toString().concat(orderSuffix);
                            let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, `Inserted to the ${order} song in queue:`));
                            setTimeout(function () {
                                msg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['queuereplace', {
                    async execute(interaction) {
                        if (interaction.data.options[1].value > queue.length || interaction.data.options[1].value <= 0) {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Invalid queue number'));
                            return setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                        await discographyRefresh(interaction);
                        let song = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (song != null) {
                            queue.splice(interaction.data.options[1].value - 1, 1, song);
                            let orderOnes = Math.floor(interaction.data.options[1].value % 10);
                            let orderTens = Math.floor(interaction.data.options[1].value / 10 % 10);
                            let orderSuffix;
                            if (orderOnes > 3 || orderTens == 1) {
                                orderSuffix = `th`;
                            } else if (orderOnes == 1) {
                                orderSuffix = `st`;
                            } else if (orderOnes == 2) {
                                orderSuffix = `nd`;
                            } else if (orderOnes == 3) {
                                orderSuffix = `rd`;
                            }
                            let order = interaction.data.options[1].value.toString().concat(orderSuffix);
                            let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, `Replaced the ${order} song in queue:`));
                            setTimeout(function () {
                                msg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['queueprint', {
                    async execute(interaction) {
                        if (lastQueuePrintButtonTime != null) {
                            if (((new Date()).getTime() - lastQueuePrintButtonTime.getTime()) / 1000 < buttonRefreshTime * 60) {
                                return;
                            } else {
                                lastQueuePrintButtonTime = new Date();
                            }
                        } else {
                            lastQueuePrintButtonTime = new Date();
                        }
                        if (queue.length > 0) {
                            let embedFieldSize = 0;
                            let embed = new Discord.MessageEmbed().setColor(color.queuePrint).setAuthor('Queue:');
                            let orderSuffix;
                            for (let i = 0; i < queue.length; i++) {
                                if (embedFieldSize == 25) {
                                    embedFieldSize = 0;
                                    let msg = await client.channels.cache.get(interaction.channel_id).send(embed);
                                    setTimeout(function () {
                                        msg.delete().then().catch(function (error) {});
                                    }, messageDeleteTime * 1000);
                                    embed = new Discord.MessageEmbed().setColor(color.queuePrint);
                                }
                                let orderOnes = Math.floor((i + 1) % 10);
                                let orderTens = Math.floor((i + 1) / 10 % 10);
                                if (orderOnes > 3 || orderTens == 1) {
                                    orderSuffix = `th`;
                                } else if (orderOnes == 1) {
                                    orderSuffix = `st`;
                                } else if (orderOnes == 2) {
                                    orderSuffix = `nd`;
                                } else if (orderOnes == 3) {
                                    orderSuffix = `rd`;
                                }
                                let orderNum = i + 1;
                                let order = orderNum.toString().concat(orderSuffix);
                                embed.addField(order, `[${queue[i].name}](${queue[i].url})`, true);
                                embedFieldSize++;
                            }
                            let msg = await client.channels.cache.get(interaction.channel_id).send(embed);
                            setTimeout(function () {
                                msg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.queuePrint).setDescription('Queue empty'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['search', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let song = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (song != null) {
                            if (currentSong == null || currentSong.path !== song.path) {
                                deleteFile(song.path);
                            }
                            let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, `Search result for "${interaction.data.options[0].value.trim()}":`));
                            if (autodelete) {
                                setTimeout(function () {
                                    msg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                            updateSongStats(song);
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['searchrandom', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let randomSong = await authorize(download, discography[Math.floor(Math.random() * discography.length)]);
                        if (randomSong != null) {
                            if (currentSong == null || currentSong.path !== randomSong.path) {
                                deleteFile(randomSong.path);
                            }
                            let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, randomSong, 'Searched random song:'));
                            if (autodelete) {
                                setTimeout(function () {
                                    msg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                            updateSongStats(randomSong);
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['list', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let embedArr = await fileSearchList(interaction, discography);
                        let msgArr = [];
                        if (embedArr !== null) {
                            for (let embed of embedArr) {
                                let msg = await client.channels.cache.get(interaction.channel_id).send(embed);
                                msgArr.push(msg);
                            }
                            if (autodelete) {
                                setTimeout(function () {
                                    for (let msg of msgArr) {
                                        msg.delete().then().catch(function (error) {});
                                    }
                                }, messageDeleteTime * 1000);
                            }
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['quicksearch', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let song = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/), true);
                        if (song != null) {
                            let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbedLink(interaction, song));
                            if (autodelete) {
                                setTimeout(function () {
                                    msg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                            updateSongStats(song);
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['pause', {
                    async execute(interaction) {
                        if (dispatcher != null) {
                            dispatcher.pause();
                            playing = false;
                            seeking = false;
                            clearInterval(playbackInterval);
                            playbackInterval = null;
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Paused:'));
                        }
                    }
                }
            ],
            ['resume', {
                    async execute(interaction) {
                        if (!(await connect(interaction)))
                            return;
                        //resume from pause
                        if (dispatcher != null && dispatcher.paused) {
                            if (seeking) {
                                seeking = false;
                                dispatcher = connection.play(currentSong.path, streamOptions);
                            } else {
                                dispatcher.resume();
                            }
                            playing = true;
                            lastPlayingUser = await getUser(interaction);
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Resumed from pause:'));
                        }
                        //resume from queue
                        else if (!playing && queue.length > 0) {
                            currentSong = queue.splice(0, 1)[0];
                            await playSong(interaction, await songEmbed(interaction, currentSong, 'Resumed from queue:'));
                        } else {
                            client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setDescription('Nothing to resume'));
                        }
                    }
                }
            ],
            ['disconnect', {
                    async execute(interaction) {
                        disconnect();
                    }
                }
            ],
            ['skip', {
                    async execute(interaction) {
                        if (playing) {
                            if (queue.length > 0) {
                                let lastSongPath = currentSong.path;
                                currentSong = queue.splice(0, 1)[0];
                                streamOptions.seek = 0;
                                seeking = false;
                                await playSong(interaction, await songEmbed(interaction, currentSong, 'Playing next in queue:'));
                                if (lastSongPath !== currentSong.path) {
                                    deleteFile(lastSongPath);
                                }
                            } else if (shuffle) {
                                let lastSongPath = currentSong.path;
                                currentSong = await authorize(download, discography[Math.floor(Math.random() * discography.length)]);
                                streamOptions.seek = 0;
                                seeking = false;
                                await playSong(interaction, await songEmbed(interaction, currentSong, 'Playing:'));
                                if (lastSongPath && currentSong != null && lastSongPath !== currentSong.path) {
                                    deleteFile(lastSongPath);
                                }
                            } else {
                                disconnect();
                            }
                        } else if (dispatcher != null && dispatcher.paused && queue.length > 0) {
                            let skipped = currentSong;
                            deleteFile(skipped.path);
                            client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, skipped, 'Skipped:'));
                            currentSong = queue.splice(0, 1)[0];
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Paused:'));
                        } else if (dispatcher == null && queue.length > 1) {
                            let skipped = queue.splice(0, 1)[0];
                            deleteFile(skipped.path);
                            client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, skipped, 'Skipped:'));
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, queue[0], 'Queued:'));
                        } else if (shuffle) {
                            let lastSongPath = null;
                            if (currentSong != null) {
                                lastSongPath = currentSong.path;
                            }
                            currentSong = await authorize(download, discography[Math.floor(Math.random() * discography.length)]);
                            await playSong(interaction, await songEmbed(interaction, currentSong, 'Playing:'));
                            if (lastSongPath && currentSong != null && lastSongPath !== currentSong.path) {
                                deleteFile(lastSongPath);
                            }
                        } else {
                            disconnect();
                        }
                    }
                }
            ],
            ['replay', {
                    async execute(interaction) {
                        replay = !replay;
                        let replayMsg;
                        if (replay) {
                            replayMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setAuthor('Replay on').setColor(color.replay));
                        } else {
                            replayMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setAuthor('Replay off').setColor(color.replay));
                        }
                        setTimeout(function () {
                            replayMsg.delete().then().catch(function (error) {});
                        }, messageDeleteTime * 1000);
                    }
                }
            ],
            ['shuffle', {
                    async execute(interaction) {
                        shuffle = !shuffle;
                        let shuffleMsg;
                        if (shuffle) {
                            shuffleMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setAuthor('Shuffle on').setColor(color.shuffle));
                        } else {
                            shuffleMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setAuthor('Shuffle off').setColor(color.shuffle));
                        }
                        setTimeout(function () {
                            shuffleMsg.delete().then().catch(function (error) {});
                        }, messageDeleteTime * 1000);
                    }
                }
            ],
            ['volume', {
                    async execute(interaction) {
                        if (interaction.data != null && interaction.data.options != null && ((interaction.data.options[0].value > 100 || interaction.data.options[0].value < 0))) {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setAuthor(`Invalid volume level`));
                            return setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                        let volumeString;
                        if (interaction.data != null && interaction.data.options != null) {
                            if (dispatcher != null) {
                                dispatcher.setVolume(interaction.data.options[0].value / 100.0);
                            }
                            streamOptions.volume = interaction.data.options[0].value / 100.0;
                            volumeString = `Set volume to ${streamOptions.volume*100}%  `;
                        } else {
                            volumeString = `Volume at ${streamOptions.volume*100}%  `;
                        }
                        if (streamOptions.volume > 0.66) {
                            volumeString = volumeString + `${loadedEmojis.get('speaker3')}`;
                        } else if (streamOptions.volume > 0.33) {
                            volumeString = volumeString + `${loadedEmojis.get('speaker2')}`;
                        } else if (streamOptions.volume > 0) {
                            volumeString = volumeString + `${loadedEmojis.get('speaker1')}`;
                        } else if (streamOptions.volume == 0) {
                            volumeString = volumeString + `${loadedEmojis.get('speaker0')}`;
                        }
                        let volumeMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.volume).setDescription(volumeString));
                        setTimeout(function () {
                            volumeMessage.delete().then().catch(function (error) {});
                        }, messageDeleteTime * 1000);
                    }
                }
            ],
            ['playback', {
                    async execute(interaction) {
                        if (playing) {
                            if (!playbackBar) {
                                playbackBar = true;
                            } else {
                                playbackBar = false;
                                clearInterval(playbackInterval);
                                playbackInterval = null;
                                playbackMsg.delete().then().catch(function (error) {});
                            }
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Playing:'));
                        } else if (dispatcher != null && dispatcher.paused) {
                            if (!playbackBar) {
                                playbackBar = true;
                            } else {
                                playbackBar = false;
                                playbackMsg.delete().then().catch(function (error) {});
                            }
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Paused:'));
                        } else if (queue.length > 0) {
                            if (!playbackBar) {
                                playbackBar = true;
                            } else {
                                playbackBar = false;
                                playbackMsg.delete().then().catch(function (error) {});
                            }
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, queue[0], 'Queued:'));
                        } else {
                            if (!playbackBar) {
                                playbackBar = true;
                            } else {
                                playbackBar = false;
                            }
                        }
                    }
                }
            ],
            ['seek', {
                    async execute(interaction) {
                        let seekTime;
                        if (interaction.quickSeekTime != null && dispatcher != null) {
                            seekTime = streamOptions.seek + Math.round(dispatcher.streamTime / 1000) + interaction.quickSeekTime;
                        } else {
                            let mmss = interaction.data.options[0].value.split(':');
                            seekTime = (parseInt(mmss[0]) * 60) + parseInt(mmss[1]);
                        }
                        streamOptions.seek = seekTime;
                        seeking = true;
                        if (playing) {
                            if (seekTime > currentSong.duration || seekTime < 0) {
                                let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Invalid seek time'));
                                return setTimeout(function () {
                                    errorMsg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                            playSong(interaction, await songEmbed(interaction, currentSong, 'Playing:'));
                        } else if (dispatcher != null && dispatcher.paused) {
                            if (seekTime > currentSong.duration || seekTime < 0) {
                                let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Invalid seek time'));
                                return setTimeout(function () {
                                    errorMsg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, currentSong, 'Paused:'));
                        } else if (queue.length > 0) {
                            if (seekTime > queue[0].duration || seekTime < 0) {
                                let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Invalid seek time'));
                                return setTimeout(function () {
                                    errorMsg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                            await updatePlaybackMessages(interaction, await songEmbed(interaction, queue[0], 'Queued:'));
                        }
                    }
                }
            ],
            ['lyrics', {
                    async execute(interaction) {
                        if (interaction.data == null || interaction.data.options == null) {
                            if (lastLyricsButtonTime != null) {
                                if (((new Date()).getTime() - lastLyricsButtonTime.getTime()) / 1000 < buttonRefreshTime * 60) {
                                    return;
                                } else {
                                    lastLyricsButtonTime = new Date();
                                }
                            } else {
                                lastLyricsButtonTime = new Date();
                            }
                            if (playing) {
                                printSongLyrics(interaction, currentSong, await songEmbed(interaction, currentSong, 'Playing:'));
                            } else if (dispatcher != null && dispatcher.paused) {
                                printSongLyrics(interaction, currentSong, await songEmbed(interaction, currentSong, 'Paused:'));
                            } else if (queue.length > 0) {
                                printSongLyrics(interaction, queue[0], await songEmbed(interaction, queue[0], 'Queued:'));
                            }
                        } else {
                            await discographyRefresh(interaction);
                            let songMatch = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                            if (songMatch != null) {
                                if (playing) {
                                    printSongLyrics(interaction, songMatch, await songEmbed(interaction, currentSong, 'Playing:'));
                                } else if (dispatcher != null && dispatcher.paused) {
                                    printSongLyrics(interaction, songMatch, await songEmbed(interaction, currentSong, 'Paused:'));
                                } else if (queue.length > 0) {
                                    printSongLyrics(interaction, songMatch, await songEmbed(interaction, queue[0], 'Queued:'));
                                } else {
                                    printSongLyrics(interaction, songMatch);
                                }
                                updateSongStats(songMatch);
                                if (currentSong == null || songMatch.path !== currentSong.path) {
                                    deleteFile(songMatch.path);
                                }
                            } else {
                                let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                                setTimeout(function () {
                                    errorMsg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                        }
                    }
                }
            ],
            ['refresh', {
                    async execute(interaction) {
                        await discographyRefresh(interaction, 'force');
                    }
                }
            ],
            ['refreshinfo', {
                    async execute(interaction) {
                        await discographyInfoRefresh(interaction, 'force');
                    }
                }
            ],
            ['stats', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let user = await getUser(interaction);
                        if (interaction.data.options == null) {
                            let embedArr = printStats(10);
                            embedArr[embedArr.length - 1] = embedArr[embedArr.length - 1].setFooter(`${user.username}`, user.avatarURL({
                                        dynamic: true
                                    }));
                            for (let embed of embedArr) {
                                client.channels.cache.get(interaction.channel_id).send(embed);
                            }
                        } else {
                            let embedArr = printStats(interaction.data.options[0].value);
                            embedArr[embedArr.length - 1] = embedArr[embedArr.length - 1].setFooter(`${user.username}`, user.avatarURL({
                                        dynamic: true
                                    }));
                            for (let embed of embedArr) {
                                client.channels.cache.get(interaction.channel_id).send(embed);
                            }
                        }
                    }
                }
            ],
            ['updateleaktracker', {
                    async execute(interaction) {
                        let leakTrackerChannel = await client.channels.cache.find(channel => (channel.id === bot.leak_tracker_channel_id && channel.guild.id === bot.guild_id));
                        let pastMessages = await getMessages(leakTrackerChannel);
                        if (pastMessages.length > 0) {
                            for (let msg of pastMessages) {
                                await msg.delete().then().catch(function (err) {});
                            }
                        }
                        for (let embed of await authorize(updateGbs)) {
                            await leakTrackerChannel.send(embed);
                        }
                    }
                }
            ],
            ['newleak', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let songMatch = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (songMatch != null) {
                            await client.channels.cache.find(channel => (channel.id === bot.leaks_channel_id && channel.guild.id === bot.guild_id)).send(await songEmbed(interaction, songMatch, 'New Leak:'));
                            if (currentSong == null || songMatch.path !== currentSong.path) {
                                deleteFile(songMatch.path);
                            }
                        }
                    }
                }
            ],
            ['newstemedit', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let songMatch = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (songMatch != null) {
                            await client.channels.cache.find(channel => (channel.id === bot.leaks_channel_id && channel.guild.id === bot.guild_id)).send(await songEmbed(interaction, songMatch, 'New Stem Edit:'));
                            if (currentSong == null || songMatch.path !== currentSong.path) {
                                deleteFile(songMatch.path);
                            }
                        }
                    }
                }
            ],
            ['newsong', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let songMatch = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (songMatch != null) {
                            await client.channels.cache.find(channel => (channel.id === bot.leaks_channel_id && channel.guild.id === bot.guild_id)).send(await songEmbed(interaction, songMatch, 'New Song:'));
                            if (currentSong == null || songMatch.path !== currentSong.path) {
                                deleteFile(songMatch.path);
                            }
                        }
                    }
                }
            ],
            ['join', {
                    async execute(interaction) {
                        connect(interaction);
                    }
                }
            ],
            ['sendembed', {
                    async execute(interaction) {
                        let embed = new Discord.MessageEmbed();
                        if (interaction.data.options == null) {
                            return client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No arguments given'));
                        } else {
                            for (let option of interaction.data.options) {
                                if (option.name === 'description') {
                                    embed.setDescription(option.value.replace(/\\n/g, '\n'));
                                } else if (option.name === 'author') {
                                    embed.setAuthor(option.value);
                                } else if (option.name === 'title') {
                                    embed.setTitle(option.value);
                                } else if (option.name === 'titleurl') {
                                    embed.setURL(fixURL(option.value));
                                } else if (option.name === 'imageurl') {
                                    embed.setImage(fixURL(option.value));
                                } else if (option.name === 'thumbnailurl') {
                                    embed.setThumbnail(fixURL(option.value));
                                } else if (option.name === 'color') {
                                    embed.setColor(option.value);
                                }
                            }
                        }
                        try {
                            client.channels.cache.get(interaction.channel_id).send(embed);
                        } catch (err) {
                            console.log(err);
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Invalid embed format'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['ogfileupdate', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        let songMatch = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (songMatch != null) {
                            await client.channels.cache.find(channel => (channel.id === bot.leaks_channel_id && channel.guild.id === bot.guild_id)).send(await songEmbed(interaction, songMatch, 'OG File Updated:'));
                            deleteFile(songMatch.path);
                        }
                    }
                }
            ],
            ['info', {
                    async execute(interaction) {
                        if (interaction.data == null || interaction.data.options == null) {
                            if (lastInfoButtonTime != null) {
                                if (((new Date()).getTime() - lastInfoButtonTime.getTime()) / 1000 < buttonRefreshTime * 60) {
                                    return;
                                } else {
                                    lastInfoButtonTime = new Date();
                                }
                            } else {
                                lastInfoButtonTime = new Date();
                            }
                            await discographyInfoRefresh(interaction);
                            let info = await songSearchInfoMatch(currentSong);
                            if (info != null) {
                                let infoMsg = await client.channels.cache.get(interaction.channel_id).send(await songEmbedInfo(interaction, currentSong, info, `Info:`));
                                setTimeout(function () {
                                    infoMsg.delete().then().catch(function (error) {});
                                }, buttonRefreshTime * 60 * 1000);
                            } else {
                                let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                                setTimeout(function () {
                                    errorMsg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                        } else {
                            await discographyRefresh(interaction);
                            await discographyInfoRefresh(interaction);
                            let songMatch = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                            if (songMatch != null) {
                                let info = await songSearchInfoMatch(songMatch);
                                if (info != null) {
                                    let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbedInfo(interaction, songMatch, info, `Info search result for "${interaction.data.options[0].value.trim()}":`));
                                    if (autodelete) {
                                        setTimeout(function () {
                                            msg.delete().then().catch(function (error) {});
                                        }, messageDeleteTime * 1000);
                                    }
                                } else {
                                    let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                                    setTimeout(function () {
                                        errorMsg.delete().then().catch(function (error) {});
                                    }, messageDeleteTime * 1000);
                                }
                                updateSongStats(songMatch);
                                if (currentSong == null || songMatch.path !== currentSong.path) {
                                    deleteFile(songMatch.path);
                                }
                            }
                        }
                    }
                }
            ],
            ['infolyrics', {
                    async execute(interaction) {
                        await discographyRefresh(interaction);
                        await discographyInfoRefresh(interaction);
                        let songMatch = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
                        if (songMatch != null) {
                            let msg = await client.channels.cache.get(interaction.channel_id).send(await songEmbedInfo(interaction, songMatch, await songSearchInfoMatch(songMatch), `Info search result for "${interaction.data.options[0].value.trim()}":`));
                            if (autodelete) {
                                setTimeout(function () {
                                    msg.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                            }
                            if (playing) {
                                printSongLyrics(interaction, songMatch, await songEmbed(interaction, currentSong, 'Playing:'));
                            } else if (dispatcher != null && dispatcher.paused) {
                                printSongLyrics(interaction, songMatch, await songEmbed(interaction, currentSong, 'Paused:'));
                            } else if (queue.length > 0) {
                                printSongLyrics(interaction, songMatch, await songEmbed(interaction, queue[0], 'Queued:'));
                            } else {
                                printSongLyrics(interaction, songMatch);
                            }
                            updateSongStats(songMatch);
                            if (currentSong == null || songMatch.path !== currentSong.path) {
                                deleteFile(songMatch.path);
                            }
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }

                }
            ],
            ['whitelist', {
                    async execute(interaction) {
                        if (!(await client.guilds.cache.get(bot.guild_id).members.fetch(interaction.data.options[0].value)).user.bot) {
                            let whiteListArr = JSON.parse(fs.readFileSync(whiteListFile));
                            let userIncluded = false;
                            for (let i = 0; i < whiteListArr.length; i++) {
                                if (whiteListArr[i].id === interaction.data.options[0].value) {
                                    userIncluded = true;
                                    if (whiteListArr[i].perms[interaction.data.options[1].value] == null || !whiteListArr[i].perms[interaction.data.options[1].value]) {
                                        whiteListArr[i].perms[interaction.data.options[1].value] = true;
                                        let whitelistMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(`Enabled *${whiteListPerms.get(interaction.data.options[1].value)}* for <@${interaction.data.options[0].value}> ${loadedEmojis.get('finished')}`));
                                        setTimeout(function () {
                                            whitelistMessage.delete().then().catch(function (error) {});
                                        }, messageDeleteTime * 1000);
                                    } else {
                                        whiteListArr[i].perms[interaction.data.options[1].value] = false;
                                        let whitelistMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(`Disabled *${whiteListPerms.get(interaction.data.options[1].value)}* for <@${interaction.data.options[0].value}> ${loadedEmojis.get('finished')}`));
                                        setTimeout(function () {
                                            whitelistMessage.delete().then().catch(function (error) {});
                                        }, messageDeleteTime * 1000);
                                    }
                                    whiteList.set(whiteListArr[i].id, whiteListArr[i].perms);
                                    fs.writeFileSync(whiteListFile, JSON.stringify(whiteListArr));
                                    break;
                                }
                            }
                            if (!userIncluded) {
                                let newUser = {
                                    id: interaction.data.options[0].value,
                                    perms: {
                                        [interaction.data.options[1].value]: true
                                    }
                                }
                                whiteList.set(newUser.id, newUser.perms);
                                let whitelistMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(`Enabled *${whiteListPerms.get(interaction.data.options[1].value)}* for <@${interaction.data.options[0].value}> ${loadedEmojis.get('finished')}`));
                                setTimeout(function () {
                                    whitelistMessage.delete().then().catch(function (error) {});
                                }, messageDeleteTime * 1000);
                                whiteListArr.push(newUser);
                                fs.writeFileSync(whiteListFile, JSON.stringify(whiteListArr));
                            }
                        } else {
                            let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('Cannot set a permission for a bot!'));
                            setTimeout(function () {
                                errorMsg.delete().then().catch(function (error) {});
                            }, messageDeleteTime * 1000);
                        }
                    }
                }
            ],
            ['autodelete', {
                    async execute(interaction) {
                        autodelete = !autodelete;
                        let autoDeleteMsg;
                        if (autodelete) {
                            autoDeleteMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setAuthor('Auto delete on').setColor(color.replay));
                        } else {
                            autoDeleteMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setAuthor('Auto delete off').setColor(color.replay));
                        }
                        setTimeout(function () {
                            autoDeleteMsg.delete().then().catch(function (error) {});
                        }, messageDeleteTime * 1000);
                    }
                }
            ],
            ['help', {
                    async execute(interaction) {
                        let user = await getUser(interaction);
                        let embed = new Discord.MessageEmbed().setColor(color.help).setAuthor('Commands:');
                        let embedFieldSize = 0;
                        for (let command of commands) {
                            if (command.name !== 'help' && (!whiteListedFunctions.includes(command.name) || (whiteList.get(interaction.member.user.id) != null && whiteList.get(interaction.member.user.id).serverAdmin))) {
                                if (embedFieldSize == 25) {
                                    embedFieldSize = 0;
                                    user.send(embed);
                                    embed = new Discord.MessageEmbed().setColor(color.help);
                                }
                                let helpString = '```ml\n';
                                helpString = helpString.concat('Description: ', command.description);
                                if (command.options != null) {
                                    for (let i = 0; i < command.options.length; i++) {
                                        helpString = helpString.concat('\nParameter ', i + 1, ': ', command.options[i].name, '\n	Description: ', command.options[i].description, '\n	Type: ');
                                        if (command.options[i].type === 1) {
                                            helpString = helpString.concat('Sub Command');
                                        } else if (command.options[i].type === 2) {
                                            helpString = helpString.concat('Sub Command Group');
                                        } else if (command.options[i].type === 3) {
                                            helpString = helpString.concat('String');
                                        } else if (command.options[i].type === 4) {
                                            helpString = helpString.concat('Integer');
                                        } else if (command.options[i].type === 5) {
                                            helpString = helpString.concat('Boolean');
                                        } else if (command.options[i].type === 6) {
                                            helpString = helpString.concat('User');
                                        } else if (command.options[i].type === 7) {
                                            helpString = helpString.concat('Channel');
                                        } else if (command.options[i].type === 8) {
                                            helpString = helpString.concat('Role');
                                        } else if (command.options[i].type === 9) {
                                            helpString = helpString.concat('Mentionable');
                                        }
                                        helpString = helpString.concat('\n	Required: ', command.options[i].required);
                                    }
                                }
                                helpString = helpString.concat('```');
                                embed.addField(command.name + ':', helpString);
                                embedFieldSize++;
                            }
                        }
                        user.send(embed);
                    }
                }
            ]
        ]);
async function main(interaction) {
    if (interaction.data.custom_id == null) {
        let channel = await getChannel(interaction);
        if (interaction.member.user == null) {
            interaction.member.user = await getUser(interaction);
        }
        if (!(await hasPermission(interaction, channel)) || (whiteListedFunctions.includes(interaction.data.name) && (whiteList.get(interaction.member.user.id) == null || !whiteList.get(interaction.member.user.id).serverAdmin))) {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        embeds: [new Discord.MessageEmbed().setColor(color.error).setDescription('Invalid Permission')]
                    }
                }
            });
            return setTimeout(function () {
                client.api.webhooks(client.user.id, interaction.token).messages('@original').delete();
            }, messageDeleteTime * 1000);
        }
        channel.startTyping();
        client.api.interactions(interaction.id, interaction.token).callback.post({
            data: {
                type: 4,
                data: {
                    embeds: [new Discord.MessageEmbed().setColor(color.loading).setDescription(`Loading ${loadedEmojis.get('loading')}`)]
                }
            }
        });
        await functionMap.get(interaction.data.name).execute(interaction);
        client.api.webhooks(client.user.id, interaction.token).messages('@original').delete();
        channel.stopTyping(true);
    }
}
async function mainButton(interaction) {
    interaction.channel_id = interaction.channel.id;
    interaction.member = {
        user: interaction.clicker.user
    };
    if (!(await isInVC(interaction))) {
        return interaction.reply.defer();
    }
    let loadingMsg;
    if (interaction.id === 'seekForwards') {
        interaction.id = 'seek';
        interaction.quickSeekTime = quickSeekTime;
    } else if (interaction.id === 'seekBackwards') {
        interaction.id = 'seek';
        interaction.quickSeekTime = -quickSeekTime;
    } else if (interaction.id === 'skip') {
        interaction.reply.defer();
        interaction.channel.startTyping();
        loadingMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.loading).setDescription(`Loading ${loadedEmojis.get('loading')}`));
    } else if (interaction.id === 'disconnect' && lastPlayingUser != null && interaction.member.user.id !== lastPlayingUser.id) {
        return interaction.reply.defer();
    }
    await functionMap.get(interaction.id).execute(interaction);
    if (interaction.id === 'skip') {
        loadingMsg.delete().then().catch(function (error) {});
        interaction.channel.stopTyping(true);
    } else {
        interaction.reply.defer();
    }
}
client.on("ready", async() => {
    await updateCommands(commands);
    loadWhiteList();
    await loadEmojis();
    if (!fs.existsSync(basePath)) {
        fs.mkdirSync(basePath);
    }
    console.log("Ready!");
});
client.ws.on("INTERACTION_CREATE", async interaction => main(interaction));
client.on("clickButton", async interaction => mainButton(interaction));
client.login(bot.token);
