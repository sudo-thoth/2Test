const axios = require("axios")
const lastfmModel = require("../../../MongoDB/db/schemas/schema_lastfm.js") 
const { SlashCommandBuilder } = require("discord.js");
const jsdom = require("jsdom");
const scripts = require("../../functions/scripts/scripts.js")
const createEmb = require("../../functions/create/createEmbed.js")
require("dotenv").config({ path: "./my.env" }); 
const { lastFM_API_ID } = process.env;


module.exports = {
    data: new SlashCommandBuilder()
    .setName("np")
    .setDescription("LastFM users most recently played track.")
    .addUserOption(option => option.setName("username").setDescription("Input User You want to Query").setRequired(false)
    ),
    async execute(interaction) {
        let userinfoget = interaction.options.getUser("username") || interaction.user;
        try {
            await interaction.deferReply({ ephemeral: true });
          } catch (error) {
            console.log(error, `error deferring reply`);
          }
        let LFuser;
            try{
                LFuser = await lastfmModel.findOne({ userID: userinfoget.id });
                if(!LFuser){
                    if (userinfoget.id === interaction.user.id){
                    return interaction.editReply({embeds: [createEmb.createEmbed({color: scripts.getErrorColor(), description: "Before you can check your account, set your LastFM username -> `/set-lastfm`"})]})
                    } else {
                        return interaction.editReply({embeds: [createEmb.createEmbed({color: scripts.getErrorColor(), description: `Before you can check <@${userinfoget.id}>'s account, they need to set their LastFM username`})]})
                    }
                }
            } catch(err) {
                console.log(err);
            }

        let uri = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LFuser.lastfmID}&api_key=${lastFM_API_ID}&limit=1`
        
        
        const recenttrack = await axios.get(uri) // the data

        
        const dom1 = new jsdom.JSDOM(recenttrack.data, {
            contentType: "text/xml",
        });
        if(!dom1?.window?.document?.querySelector("name")?.textContent){
            try {
                return await interaction.editReply({embeds: [createEmb.createEmbed({title: 'Error!', description: `<a:Error:1005725142015549621> \`an error occured while retrieving ${userinfoget.id === interaction.user.id ? 'your' : `@${userinfoget.username}'s`} LastFM stats, Please verify ${userinfoget.id === interaction.user.id ? 'your' : `@${userinfoget.username}'s`} account has valid data to be shown\` <:ArrowDCL:1079572493318246451> \`${LFuser.lastfmID}\``, color: scripts.getErrorColor(), 
                thumbnail: userinfoget.avatarURL({ dynamic: true})})    
               ]})
           } catch (error) {
               return console.log(error)
             }
        }
        let trackname = dom1.window.document.querySelector("name").textContent;
        let artistname = dom1.window.document.querySelector("artist").textContent;
        let album = dom1.window.document.querySelector("album").textContent;
        let trackurl = dom1.window.document.querySelector("url").textContent;
        let artisturlTEMP1 = trackurl.slice(0, -trackname.length);
        let artisturlTEMP2 = artisturlTEMP1.replace(`/_/`, "");
        let artisturl = artisturlTEMP2.replace(" ", "+");
        let albumimage = dom1.window.document.querySelector('image[size="extralarge"]').textContent;

        let tracknameXML = trackname.replace(` `, "+");
        let artistnameXML = artistname.replace(` `, "+");

        let uri1 = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${lastFM_API_ID}&artist=${artistnameXML}&track=${tracknameXML}&user=${LFuser.lastfmID}`

        const trackinfo = await axios.get(uri1) // the data

        //console.log(alltracks.data)
        // get artist info from API
let artistUri = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistname}&api_key=${lastFM_API_ID}&format=json`;
const artistInfo = await axios.get(artistUri);

// get the artist profile image url
let artistImageURL = artistInfo.data.artist.image[3]["#text"];

        const dom2 = new jsdom.JSDOM(trackinfo.data)
        let playcount;
        try {
            playcount = dom2.window.document.querySelector("userplaycount").textContent;
        } catch (error) {
            console.log(error)
            playcount = "?"
        }
        
        let totalscrobbles = dom1.window.document.querySelector("recenttracks").getAttribute('total');
        let avatar = userinfoget?.displayAvatarURL({dynamic: true})
        if (albumimage == '') {
            albumimage = 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fstackoverflow.com%2Fquestions%2F65441963%2Fhtml-file-upload-uploads-missing-icon-instead-of-chosen-image&psig=AOvVaw15V_is7ApKvri_t8awEQAf&ust=1681025684216000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCKDC3ujimf4CFQAAAAAdAAAAABAF';
        }
        const embed = createEmb.createEmbed({color: userinfoget.hexAccentColor,author:{name: `LastFM User: ${LFuser.lastfmID}`, iconURL: `${avatar}`, url: `https://www.last.fm/user/${LFuser.lastfmID}`}, footer: { text: `Playcount: ${playcount} | Total Scrobbles: ${totalscrobbles} | Album: ${album}`, iconURL: artistname === "Juice WRLD" || "Juice Wrld" ? "https://lastfm.freetls.fastly.net/i/u/ar0/d6e904e50bb79e7877711efe9463c675.jpg" : artistImageURL}, fields: [
                {name: 'Track', value: `> [${trackname}](${trackurl})`},
                {name: 'Artist', value: `> [${artistname}](${artisturl})`}], thumbnail: albumimage})
           
        await interaction.channel.send({embeds: [embed]}).then(sentEmbed => {
            sentEmbed.react("<a:Up_Vote:1094169827201007667>")
            sentEmbed.react("<a:down_red_arow:1094172682318266481>")
        })
        
    }
}