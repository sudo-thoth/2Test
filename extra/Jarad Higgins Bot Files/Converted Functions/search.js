require("dotenv").config({ path: "./my.env" });

async function search(interaction) {
  // This function is an asynchronous function that takes an "interaction" object as an input.

  async function discographyRefresh(interaction, force) {
    let discographyRefreshTime;
    // This function is an asynchronous function that takes an "interaction" object and a "force" parameter as inputs.
  
    if (discographyRefreshTime != null) {
      // This line checks if "discographyRefreshTime" is not null.
  
      if (((new Date()).getTime() - discographyRefreshTime.getTime()) / 1000 > refreshTime * 60 || (force != null && force === 'force')) {
        // This line calculates the time difference between the current time and the time when "discographyRefreshTime" was last updated.
        // If the time difference is greater than the "refreshTime" variable (in minutes) or the "force" parameter is equal to "force", the function proceeds.

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
        
          let token = JSON.parse(google_token_info_xNine)
          // This line reads the token file and assigns the contents to the "token" variable.
        // HERE Working here
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
          

          if (token == null)
              return getAccessToken(oAuth2Client, callback);
          // This line checks if the "token" variable is null.
          // If it is, the function calls the "getAccessToken" function to retrieve a new access token using the OAuth2 client and the "callback" function.
        
          oAuth2Client.setCredentials(token);
          // This line sets the credentials of the OAuth2 client using the parsed contents of the "token" file.
        
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
        
          discography = res.data.files;
          // This line assigns the list of files (with the "url" property added to each file object) to the "discography" variable.
        }
        
  
        await authorize(updateDiscography);
        // This line calls the "authorize" function to authorize the bot and then calls the "updateDiscography" function to update the discography information.
  
        discographyRefreshTime = new Date();
        // This line updates the "discographyRefreshTime" variable to the current time.
  
        let refreshMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(artistName + ` discography refreshed ${loadedEmojis.get('finished')}`));
        // This line sends a success message to the channel where the "interaction" occurred.
  
        setTimeout(function () {
          refreshMessage.delete().then().catch(function (error) {});
          // This line deletes the "refreshMessage" object and catches any errors that may occur.
        }, messageDeleteTime * 1000);
      }
    } else {
      await authorize(updateDiscography);
      // This line calls the "authorize" function to authorize the bot and then calls the "updateDiscography" function to update the discography information.
  
      discographyRefreshTime = new Date();
      // This line updates the "discographyRefreshTime" variable to the current time.
  
      let refreshMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.success).setDescription(artistName + ` discography refreshed ${loadedEmojis.get('finished')}`));
      // This line sends a success message to the channel where the "interaction" occurred.
  
      setTimeout(function () {
        refreshMessage.delete().then().catch(function (error) {});
        // This line deletes the "refreshMessage" object and catches any errors that may occur.
      }, messageDeleteTime * 1000);
    }
  }
  

  await discographyRefresh(interaction);
  // This line calls the "discographyRefresh" function to refresh the discography information.

  let song = await fileSearchMatch(discography, interaction.data.options[0].value.trim().split(/ +/));
  // This line calls the "fileSearchMatch" function to search for a file that matches the input provided in "interaction" and returns an object called "song".
  // The "song" object contains information about the matching file.

  if (song != null) {
    // This line checks if "song" is not null.

    if (currentSong == null || currentSong.path !== song.path) {
      deleteFile(song.path);
      // This line deletes the file corresponding to the "currentSong" object if it exists and is not the same as the "song" object.
    }

    client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, `Search result for "${interaction.data.options[0].value.trim()}":`));
    // This line sends an "embed" object to the channel where the "interaction" occurred.
    // The "embed" object contains information about the "song" object and the input provided in "interaction".

    updateSongStats(song);
    // This line calls the "updateSongStats" function to update the statistics for the "song" object.
  } else {
    let errorMsg = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setColor(color.error).setDescription('No results found'));
    // This line sends an error message to the channel where the "interaction" occurred if "song" is null.

    setTimeout(function () {
      errorMsg.delete().then().catch(function (error) {});
      // This line deletes the "errorMsg" object and catches any errors that may occur.
    }, messageDeleteTime * 1000);
  }
}
