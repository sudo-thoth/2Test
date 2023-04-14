async function main(interaction) {
    // Check if the interaction has a custom ID, if not:
    if (interaction.data.custom_id == null) { //: what is this first check for? What was ur reason for it?
      // Get the channel that the interaction was initiated in
      let channel = await getChannel(interaction); //: fetch channel?
  
      // If the user who initiated the interaction is not available in the member object, get their user object
      if (interaction.member.user == null) {
        interaction.member.user = await getUser(interaction); //:  fetch user?
      }
  
      // Check if the user has permission to perform the action, based on their ID and the action they are trying to perform
      if ( //: user does not have permission OR function is white listed AND ( user is not in the whitelist OR user is not a server admin )
        !(await hasPermission(interaction, channel)) ||  
        (whiteListedFunctions.includes(interaction.data.name) &&  
          (whiteList.get(interaction.member.user.id) == null ||  
            !whiteList.get(interaction.member.user.id).serverAdmin))  
      ) {
        // If the user doesn't have permission or is not whitelisted, send an error message and delete the user's original message
        client.api.interactions(interaction.id, interaction.token).callback.post({
          data: {
            type: 4,
            data: {
              embeds: [
                new Discord.MessageEmbed()
                  .setColor(color.error)
                  .setDescription("Invalid Permission"),
              ],
            },
          },
        });
        return setTimeout(function () {
          client.api
            .webhooks(client.user.id, interaction.token)
            .messages("@original")
            .delete();
        }, messageDeleteTime * 1000);
      }

      //: IF the user has VALID Permissions code continues...
  
      // Start typing in the channel
      channel.startTyping();
  
      // Send a loading message
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            embeds: [
              new Discord.MessageEmbed()
                .setColor(color.loading)
                .setDescription(`Loading ${loadedEmojis.get("loading")}`),
            ],
          },
        },
      });
  
      // Execute the function associated with the interaction's name
      await functionMap.get(interaction.data.name).execute(interaction); //: This calls the function the user selected? (basically triggers the specified command)
  
      // Delete the original message
      client.api
        .webhooks(client.user.id, interaction.token)
        .messages("@original")
        .delete();
  
      // Stop typing in the channel
      channel.stopTyping(true);
    }
  }
  