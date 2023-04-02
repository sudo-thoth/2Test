const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  Message,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wipe")
    .setDescription(
      "wipes messages from a channel."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("bot-messages")
        .setDescription("wipe a specific number bot of messages from channel")
        
    )
    .addSubcommand((subcommand) =>
    subcommand
      .setName("non-bot-messages")
      .setDescription("wipe a specific number non-bot of messages from channel")
      
  )
  .addSubcommand((subcommand) =>
      subcommand
        .setName("all-messages")
        .setDescription("wipe all messages from channel")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("files")
        .setDescription("wipe all files from channel")
        
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("links")
        .setDescription("wipe all links from channel")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("a-users-messages")
        .setDescription("wipe messages from a specific user.")
        .addUserOption((option) =>
          option
            .setName("target")
            .setDescription("Select a user to wipe their messages from channel")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("num")
            .setDescription("Amount of messages to wipe.")
            .setRequired(false)
        )
    ),

  async execute(interaction) {
    const { channel, options } = interaction;
    const type = options.getSubcommand();
    const amount = options.getInteger("num");
    const target = options.getUser("target");
try{await interaction.deferReply({ephemeral:true})
} catch(error){
console.log(`Failed to defer reply:`, error);
return;
}
    if (amount > 100) {
      const errEmbed = new EmbedBuilder()
        .setDescription(`You can only wipe up to 100 messages at a time.`)
        .setColor(0xc72c3b);
      console.log(`wipe Command Failed to Execute: ❌`);
      return interaction.editReply({ embeds: [errEmbed] });
    }

    let messages;

    try {
      messages = await channel.messages.fetch({
        limit: amount + 1,
      });
    } catch (error) {
      console.error(`Failed Fetch Attempt`, error);
    }

    const res = new EmbedBuilder().setColor(0x5fb041);
let startTime = new Date();
    if (type === "a-users-messages") {
      let i = 0;
      

if (amount) {
        try {
          (await messages).filter((msg) => {
            // make sure message is not from a bot
            if ((msg.author.id === target.id && amount > i) && !msg.pinned && !msg.author.bot) {
              filtered.push(msg);
              i++;
            }
          });
        } catch (error) {
          console.error(`Failed Filter Attempt`, error);
        }
  
        try {
          await channel.bulkDelete(filtered).then((messages) => {
            res.setDescription(
              `:white_check_mark: Successfully deleted ${
                amount != 1 ? `${amount} messages` : `${amount} message`
              } from  <#${interaction.channel.id}>.`
            );
            interaction.editReply({  embeds: [res] });
            console.log(`wipe Command Executed Successfully: ✅`);
          });
        } catch (error) {
          console.error(`Failed Bulk Delete Attempt`, error);
        }
} else {
  try {
    
    let i = 0;
    let messages = [];
    let lastId;
    try {
      await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867>`)]})
    } catch (err) {console.log(err)}

    // Fetch all messages in the channel
    while (true) {
      const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
  
      if (fetchedMessages?.size === 0) break;
  
      messages.push(...fetchedMessages);
      lastId = fetchedMessages.last().id;
    }
  
    console.log(`Fetched ${messages.length} messages`);
  
    // Filter messages and delete them in batches of 100
            for (let msg of messages) {
          // make sure message is not from a bot
          msg = msg[1] 
      // make sure message is not from a bot
      if (msg.author.id === target.id && !msg.pinned && !msg.author.bot) {
        filtered.push(msg);
        i++;
      }
    }
  
    for (let j = 0; j < filtered.length; j += 100) {
      const batch = filtered.slice(j, j + 100);
      await channel.bulkDelete(batch);
    }
  
    res.setDescription(
      `:white_check_mark: Successfully deleted ${
        i != 1 ? `${i} messages` : `${i} message`
      } from  <#${interaction.channel.id}>.`
    );
    await interaction.editReply({  embeds: [res] });
    console.log(`wipe Command Executed Successfully: ✅`);
  } catch (error) {
    console.error(`Failed Bulk Delete Attempt`, error);
await interaction.editReply({content:`Failed to wipe messages\n\`\`\`${error}\n\`\`\``})
  }
  
  
}
    } else if (type === "bot-messages") {
      try {
        
        let i = 0;
        let messages = [];
        let lastId;
        try {
          await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867>`)]})
        } catch (err) {console.log(err)}
        // Fetch all messages in the channel
        while (true) {
          const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
      
          if (fetchedMessages?.size === 0) break;
      
          messages.push(...fetchedMessages);
          i++;
          try {
          await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i * 100}\` messages found | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
        } catch (err) {console.log(err)}
          }
        i = 0; 
      
        console.log(`Fetched ${messages.length} messages`);
      
        // Filter messages and delete them in batches of 100
                for (let msg of messages) {
          // make sure message is not from a bot
          msg = msg[1] 
          // make sure message is not from a bot
          if (!msg.pinned && msg.author.bot) {
           await msg.delete();
              i++;
              try {
              await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i}\` messages deleted  | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
            } catch (err) {console.log(err)}
}
        }
        res.setDescription(
          `:white_check_mark: Successfully deleted ${
            i != 1 ? `${i} messages` : `${i} message`
          } from  <#${interaction.channel.id}>.`
        );
        await interaction.editReply({  embeds: [res] });
        console.log(`wipe Command Executed Successfully: ✅`);
      } catch (error) {
        console.error(`Failed Bulk Delete Attempt`, error);
    await interaction.editReply({content:`Failed to wipe messages\n\`\`\`${error}\n\`\`\``})
      }
    } else if (type === "non-bot-messages") {
      try {
        
        let i = 0;
        let messages = [];
        let lastId;
        try {
          await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867>`)]})
        } catch (err) {console.log(err)}
    
        // Fetch all messages in the channel
        while (true) {
          const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
      
          if (fetchedMessages?.size === 0) break;
          console.log(`Fetched ${fetchedMessages.size} messages`, fetchedMessages);
          messages.push(...fetchedMessages);
          i++;
            try {
            await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i * 100}\` messages found | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
          } catch (err) {console.log(err)}
          }
        i = 0; 
      
        console.log(`Fetched ${messages.length} messages`);
      
        // Filter messages and delete them in batches of 100
        for (let msg of messages) {
          // make sure message is not from a bot
          msg = msg[1] 
          if (!msg.pinned && !msg.author.bot) {
            await msg.delete();
              i++;
              try {
              await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i}\` messages deleted  | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
            } catch (err) {console.log(err)}
}
        }
      
        
      
        res.setDescription(
          `:white_check_mark: Successfully deleted ${
            i != 1 ? `${i} messages` : `${i} message`
          } from  <#${interaction.channel.id}>.`
        );
        await interaction.editReply({  embeds: [res] });
        console.log(`wipe Command Executed Successfully: ✅`);
      } catch (error) {
        console.error(`Failed Bulk Delete Attempt`, error);
    await interaction.editReply({content:`Failed to wipe messages\n\`\`\`${error}\n\`\`\``})
      }
    } else if (type === "all-messages") {
      try {
        
        let i = 0;
        let messages = [];
        let lastId;
        try {
          await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867>`)]})
        } catch (err) {console.log(err)}
    
        
          // Fetch all messages in the channel
          let fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
          messages.push(...Array.from(fetchedMessages.values()));
          lastId = fetchedMessages.last()?.id;
          
          i++;
          while (fetchedMessages?.size > 0) {
            fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
            lastId = fetchedMessages?.last()?.id

          if (fetchedMessages?.size === 0) break;
      
          messages.push(...fetchedMessages);
          i++;
          try {
          await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${messages?.length}\` messages found | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
        } catch (err) {console.log(err)}
          }
        i = 0; 
      
        console.log(`Fetched ${messages.length} messages`);
      
        // Filter messages and delete them in batches of 100
                for (let msg of messages) {
          // make sure message is not from a bot
          if (msg instanceof Message) {
            if (!msg.pinned) {
              try {
                await msg.delete();
                i++;
                try {
                  await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i}\` messages deleted  | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
                } catch (err) {console.log(err)}
              } catch (error) {
                console.log(error);
              }
            }
          } else {
            try {
              const message = await channel.messages.fetch(msg.id);
              if (!message.pinned) {
                try {
                  await message.delete();
                  i++;
                  try {
                    await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i}\` messages deleted  | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
                  } catch (err) {console.log(err)}
                } catch (error) {
                  console.log(error);
                }
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
        res.setDescription(
          `:white_check_mark: Successfully deleted ${
            i != 1 ? `${i} messages` : `${i} message`
          } from  <#${interaction.channel.id}>.`
        );
        await interaction.editReply({  embeds: [res] });
        console.log(`wipe Command Executed Successfully: ✅`);
      } catch (error) {
        console.error(`Failed Delete Attempt`, error);
    await interaction.editReply({content:`Failed to wipe messages\n\`\`\`${error}\n\`\`\``})
      }
      } else if (type === "files") {
        try {
          
          let i = 0;
          let messages = [];
          let lastId;
          try {
            await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867>`)]})
          } catch (err) {console.log(err)}
      
          // Fetch all messages in the channel
          while (true) {
            const fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
        
            if (fetchedMessages?.size === 0) break;
        
            messages.push(...fetchedMessages);
            lastId = fetchedMessages.last().id;
            i++;
            try {
            await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i * 100}\` messages found | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
          } catch (err) {console.log(err)}
          }
        i = 0; 
          console.log(`Fetched ${messages.length} messages`);
        
          // Filter messages and delete them in batches of 100
                  for (let msg of messages) {
          // make sure message is not from a bot
          msg = msg[1] 
            // make sure message is not from a bot
            if (msg.attachments?.size > 0) {
              await msg.delete();
              i++;
              try {
              await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i}\` messages deleted  | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
            } catch (err) {console.log(err)}
            }
        }
        
          res.setDescription(
            `:white_check_mark: Successfully deleted ${
              i != 1 ? `${i} messages` : `${i} message`
            } from  <#${interaction.channel.id}>.`
          );
          await interaction.editReply({  embeds: [res] });
          console.log(`wipe Command Executed Successfully: ✅`);
        } catch (error) {
          console.error(`Failed Bulk Delete Attempt`, error);
      await interaction.editReply({content:`Failed to wipe messages\n\`\`\`${error}\n\`\`\``})
        }
      } else if (type === "links") {
        try {
          
          let i = 0;
          let messages = [];
          let lastId;
          try {
            await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867>`)]})
          } catch (err) {console.log(err)}
      
          // Fetch all messages in the channel
         let fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });

      
          messages.push(...fetchedMessages);
          lastId = fetchedMessages?.last().id;
          i++;
          while (fetchedMessages?.size > 0) {
            fetchedMessages = await channel.messages.fetch({ limit: 100, before: lastId });
        
            if (fetchedMessages?.size === 0) break;
        
            messages.push(...fetchedMessages);
            lastId = fetchedMessages.last().id;
            i++;
            try {
            await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i * 100}\` messages found | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
          } catch (err) {console.log(err)}
          }
        i = 0; 
          console.log(`Fetched ${messages.length} messages`);
        
          // Filter messages and delete them in batches of 100
                  for (let msg of messages) {
          // make sure message is not from a bot
          msg = msg[1] 
            // make sure message is not from a bot
            if (msg.content.match(/https?:\/\/\S+/)) {
              
              await msg.delete();
            i++;
            try {
            await interaction.editReply({embeds: [ new EmbedBuilder().setColor(0x5fb041).setDescription(`<a:verify:1075235392258850867> \`${i}\` messages deleted  | Elapsed Time : <t:${Math.floor(startTime / 1000)}:R>`)]})
          } catch (err) {console.log(err)}
          }
        }
        
          res.setDescription(
            `:white_check_mark: Successfully deleted ${
              i != 1 ? `${i} messages` : `${i} message`
            } from  <#${interaction.channel.id}>.`
          );
          await interaction.editReply({  embeds: [res] });
          console.log(`wipe Command Executed Successfully: ✅`);
        } catch (error) {
          console.error(`Failed Bulk Delete Attempt`, error);
      await interaction.editReply({content:`Failed to wipe messages\n\`\`\`${error}\n\`\`\``})
        }
      }
    console.log(`wipe Command Complete: ✅`);
  }
};
