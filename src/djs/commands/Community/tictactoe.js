const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const commandName = "tictactoe";
const commandDescription = "play a game of tictactoe with 1 other opponent";
const scripts = require("../../functions/scripts/scripts.js");
const scripts_djs = require("../../functions/scripts/scripts_djs.js");
const createEmb = require("../../functions/create/createEmbed.js");
const client = require("../../index.js");

const createBtn = require("../../functions/create/createbutton.js");
const createActRow = require("../../functions/create/createActionRow.js");
// This command gives you the opportunity to create a completely new nickname with just two simple steps.
module.exports = {
  data: new SlashCommandBuilder()
    .setName(`${commandName}`)
    .setDescription(`${commandDescription}`)
    .addUserOption((option) =>
      option
        .setName("opponent")
        .setDescription("invite an opponent")
        .setRequired(false)
    ),
  execute,
};

async function execute(interaction) {
  const player2 = interaction.options.getUser("opponent");
  const interactionObj = scripts_djs.getInteractionObj(interaction);

  let player1 = interaction.user;
  let ttt_11 = new ButtonBuilder().setCustomId("ttt_11").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let ttt_12 = new ButtonBuilder().setCustomId("ttt_12").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let ttt_13 = new ButtonBuilder().setCustomId("ttt_13").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let ttt_21 = new ButtonBuilder().setCustomId("ttt_21").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let ttt_22 = new ButtonBuilder().setCustomId("ttt_22").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let ttt_23 = new ButtonBuilder().setCustomId("ttt_23").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let ttt_31 = new ButtonBuilder().setCustomId("ttt_31").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let ttt_32 = new ButtonBuilder().setCustomId("ttt_32").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let ttt_33 = new ButtonBuilder().setCustomId("ttt_33").setLabel("‎").setStyle(ButtonStyle.Secondary)
  let row = async (left, middle, right) => await new ActionRowBuilder().setComponents(
    left, middle, right
)
async function getComponents(row1, row2, row3) {
    const components = await Promise.all([row(row1[0], row1[1], row1[2]), row(row2[0], row2[1], row2[2]), row(row3[0], row3[1], row3[2])]);
    return components;
}
  let begin = async (obj)=> {
    let {player1, player2, interaction} = obj;

  let row1 = [ttt_11, ttt_12, ttt_13];
  let row2 = [ttt_21, ttt_22, ttt_23];
  let row3 = [ttt_31, ttt_32, ttt_33];



  let components = await getComponents(row1, row2, row3);
// because auto is true, player2 will be replaced by the computer aka interaction.client.user and after every turn of player1, the computer will make a turn


  // ⭕❌🏅
  const gameBoard = await message.channel.send({ content: `**${player1.username}** vs **${player2.username}**\n\n⏰ You have **30 seconds** to start!\n❌ ${player1}, make your first move.`, components: components })
  let xo;
  let buttoncolor;
  let win;
  let winner;
  const player1Tiles = [];
  const player2Tiles = [];
  const playRound = async (currentPlayersTurn) => {
      const filter = i => {
          i.deferUpdate();
          return i.user.id === currentPlayersTurn.id
      }

      if (currentPlayersTurn === player1) {
          xo = "X"
          buttoncolor = ButtonStyle.Danger
      } else {
          xo = "O"
          buttoncolor = ButtonStyle.Success
      }

     if (currentPlayersTurn !== interaction.client.user) {
         gameBoard.awaitMessageComponent({ filter, componentType: ComponentType.Button, max: 1, time: 30000, errors: ["time"]}).then(async (interaction) => {
             
             switch (interaction.customId) {
                 case 'ttt_11':
                     ttt_11 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row1[0] = ttt_11;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 case 'ttt_12':
                     // code for ttt_12
                     ttt_12 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row1[1] = ttt_12;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 case 'ttt_13':
                     // code for ttt_13
                     ttt_13 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row1[2] = ttt_13;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 case 'ttt_21':
                     // code for ttt_21
                     ttt_21 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row2[0] = ttt_21;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 case 'ttt_22':
                     // code for ttt_22
                     ttt_22 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row2[1] = ttt_22;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 case 'ttt_23':
                     // code for ttt_23
                     ttt_23 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row2[2] = ttt_23;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 case 'ttt_31':
                     // code for ttt_31
                     ttt_31 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row3[0] = ttt_31;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 case 'ttt_32':
                     // code for ttt_32
                     ttt_32 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row3[1] = ttt_32;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 case 'ttt_33':
                     // code for ttt_33
                     ttt_33 = new ButtonBuilder().setCustomId(`${interaction.customId}`).setLabel(xo).
                     setStyle(buttoncolor).setDisabled(true);
                     row3[2] = ttt_33;
                     components = await getComponents(row1, row2, row3);
                     if (currentPlayersTurn === player1) {
                         player1Tiles.push(interaction.customId)
                     } else {
                         player2Tiles.push(interaction.customId)
                     }
                     checkWin(components, currentPlayersTurn)
                     
                     break;
                 default:
                     console.log("shit broke")
                     message.channel.send("i died")
                     break;
                 // code to handle other cases
             }
         }).catch(err => {
             gameBoard.delete()
         })
     } else {
        // calculate the remaining buttons that have yet to be clicked, can be determined by checking the current player1Tiles and player2Tiles and any tiles that are not in either of the two arrays can be one of the computers next moves
        const unavailableTiles = [...player1Tiles, ...player2Tiles];
        const allTiles = ["ttt_11", "ttt_12", "ttt_13",
        "ttt_21", "ttt_22", "ttt_23",
        "ttt_31", "ttt_32", "ttt_33"];
        const remainingButtons = allTiles.filter(i =>!unavailableTiles.includes(i));
        // pick a random number between 0 and the remainingbuttonions length
        const randomNumber = Math.floor(Math.random() * remainingButtons.length);
        const nextMove = remainingButtons[randomNumber];

        const [row, col] = nextMove.split('_').slice(1);


const rowIndex = Number(row) - 1;
const colIndex = Number(col) - 1;

const button = new ButtonBuilder()
    .setCustomId(`${interaction.customId}`)
    .setLabel(xo)
    .setStyle(buttonColor)
    .setDisabled(true);

if (rowIndex === 0) {
    row1[colIndex] = button;
} else if (rowIndex === 1) {
    row2[colIndex] = button;
} else if (rowIndex === 2) {
    row3[colIndex] = button;
}

components = await getComponents(row1, row2, row3);

player2Tiles.push(nextMove)

checkWin(components, currentPlayersTurn)

     }
  }
  playRound(player1)

  const checkWin = async (components, currentPlayersTurn) => {
      const winConditions = [
          {first: "ttt_11", second: "ttt_12", third: "ttt_13"},
          {first: "ttt_21", second: "ttt_22", third: "ttt_23"},
          {first: "ttt_31", second: "ttt_32", third: "ttt_33"},
          {first: "ttt_11", second: "ttt_21", third: "ttt_31"},
          {first: "ttt_12", second: "ttt_22", third: "ttt_32"},
          {first: "ttt_13", second: "ttt_23", third: "ttt_33"},
          {first: "ttt_11", second: "ttt_22", third: "ttt_33"},
          {first: "ttt_13", second: "ttt_22", third: "ttt_31"}
      ]

      for (const winCondition of winConditions) {
          if (player1Tiles.includes(winCondition.first) && player1Tiles.includes(winCondition.second) && player1Tiles.includes(winCondition.third)) {
              winner = player1
              win = true
          } else if (player2Tiles.includes(winCondition.first) && player2Tiles.includes(winCondition.second) && player2Tiles.includes(winCondition.third)) {
              winner = player2
              win = true
          }
      }
      if (win === true) {
          return await gameBoard.edit({ content: `**${player1.username}** vs **${player2.username}**\n\n🏅 ${winner} won!`, components: components })
      } else if (player1Tiles.length === 5) {
          return await gameBoard.edit({ content: `**${player1.username}** vs **${player2.username}**\n\n🔎 Nobody won! It's a tie.`, components: components })
      } else {
          if (currentPlayersTurn === player1) {
              await gameBoard.edit({ content: `**${player1.username}** vs **${player2.username}**\n\n⭕ <@${player2.id}>, your turn`, components: components })
              await scripts.delay(1000)
              playRound(player2)
          } else {
              await gameBoard.edit({ content: `**${player1.username}** vs **${player2.username}**\n\n❌ <@${player1.id}>, your turn`, components: components })
              playRound(player1)
          }
      }
  }
}
  let content = (player1, player2) => {return `||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||||​||  \n<@${player1.id}>  ${player2?`<@${player2.id}>`:``}`}

  if (!player2) {
      // the user has 10 seconds to click one of the two buttons shown with the reply, on the embed the <tr...> time with a countdown of 10 seconds is shown
      // if no button is clicked after 10 seconds, disable both buttons and update the embed message saying no actions were taken in enough time, if you still want to play try `/tictactoe` again
      const friendButton = await createBtn.createButton({
            customId: "ttt_friend",
            label: "Friend",
            style: "primary",
            disabled: false,
          });
            
      
      const computerButton = await createBtn.createButton({
        customId: "ttt_computer",
        label: "Computer",
        style: "danger",
        disabled: false,
      })

      const friendButtonDisabled = await createBtn.createButton({
        customId: "ttt_friend",
        label: "Friend",
        style: "primary",
        disabled: true,
      });
        
  
  const computerButtonDisabled = await createBtn.createButton({
    customId: "ttt_computer",
    label: "Computer",
    style: "danger",
    disabled: true,
  })

  const randomButton = await createBtn.createButton({
    customId: "ttt_member",
    label: "Random Opponent",
    style: "secondary",
    disabled: false,
  })

  const randomButtonDisabled = await createBtn.createButton({
    customId: "ttt_member",
    label: "Random Opponent",
    style: "secondary",
    disabled: true,
  });
      
      const selectionRow = await createActRow({components: [friendButton, computerButton, randomButton]})
      const selectionRowDisabled = await createActRow({components: [friendButtonDisabled, computerButtonDisabled, randomButtonDisabled]})
      const maxTime = Date.now() + 10000;
      let timeLeft = Math.floor(maxTime / 1000);
      timeLeft = `<t:${timeLeft}:R>`;
      const clarifyEmbed = {
        title: `Player 2 was Never Selected`,
        description: `Do you want to play against a Friend, Random Server Member, or vs <@${interaction.client.user.id}>?\nYou have ${timeLeft} to choose`, 
        color: scripts.getColor(),
      }
      // start a timer in a variable named timer so that I can reference this variable again to see if 10 seconds have passed or not
      
    const clarifyPlayer2 = await interaction.reply({ephemeral: true,content: content(player1), components: [selectionRow], embeds: [createEmb.createEmbed(clarifyEmbed)]
    })
    let timer = setTimeout(async () => {
        // Disable the message buttons after 10 seconds
        await clarifyPlayer2.edit({embeds: [createEmb.createEmbed({title:`❗️ You took too long to decide`, description: `If you still wish to play, run \`/tictactoe\` again`, color: scripts.getErrorColor()})], components: [selectionRowDisabled] });
    }, 10000);
    const filter = i => {
        i.deferUpdate();
        return i.user.id === currentPlayersTurn.id
    }
    clarifyPlayer2.awaitMessageComponent({ filter, componentType: ComponentType.Button, max: 1, time: 30000, errors: ["time"]}).then(async (interaction) => {
        if(interaction.user.id !== player1.id) {await interaction.reply({embeds: [createEmb.createEmbed({title: `❌ You are not the player who started this game`, color: scripts.getErrorColor()})], ephemeral: true, content: content(interaction.user)});}

        clearTimeout(timer);
        if(interaction.customId === "ttt_computer"){
            // run the game as the computer as player 2, meaning after eveyry turn of player 1 the computer will make a random move
            await begin({player1: player1, player2: interaction.client.user, interaction: interaction})
        } else if(interaction.customId === "ttt_friend"){
            let timer2 = setTimeout(async () => {
                // Disable the message buttons after 10 seconds
                await clarifyPlayer2.edit({embeds: [createEmb.createEmbed({title:`❗️ You took too long to decide`, description: `If you still wish to play, run \`/tictactoe\` again`, color: scripts.getErrorColor()})], components: [selectionRowDisabled] });
            }, 10000);

            // make it so the user can either select a button on the previous message to get a random opponent or send a message mentionaing a user to play against the user mentioned
            // listen to al incoming messages for the next 10 seconds from the currentPlayersTurn user

client.on('message', async (message) => {
    if (message.author.bot) return; // Ignore messages sent by bots

        if (message.author === currentPlayersTurn && message.mentions.members) { // Check if the message matches your trigger command
      let targetUser = message.mentions.members.first(); // The user you want to monitor
      let originalMessage = message; // The message you want to update later
            
      let filter = (msg) => {
        // Only listen to messages that mention the target user and were not sent by them
        return msg.author.id !== targetUser.id;
      };
  
  let msg = message;

        clearTimeout(timer2)
        // If a message is collected, update the original message and stop listening for more messages
        
        await originalMessage.edit(`The Request to play with user ${targetUser.username} was sent by ${msg.author.username}.`);
        let acceptButton = await createBtn.createButton({
            customID: 'ttt_accept',
            style: `success`,
            label: 'Accept',
        })
        let acceptRow = await createActRow({components: [acceptButton]})
        let timer3 = setTimeout(async () => {
            // Disable the message buttons after 30 seconds
            await msg.edit({content: content(player1, targetUser), embeds: [createEmb.createEmbed({title:`❗️ You took too long to decide`, description: `If you still wish to play, run \`/tictactoe\` again`, color: scripts.getErrorColor()})], components: [] });
        }, 30000);
        const maxTime2 = Date.now() + 30000;
      let timeLeft2 = Math.floor(maxTime2 / 30000);
      timeLeft2 = `<t:${timeLeft2}:R>`;
        let requestMessage = await msg.channel.send({content: content(player1, targetUser),embeds: [createEmb.createEmbed({title: `❓ ${msg.author.username} wants to play Tic Tac Toe with you`, description: `Do you accept? You have ${timeLeft2} left to accept`, color: scripts.getColor()})], components: [acceptRow]})
         filter = (i) => {
            // Only listen to messages that mention the target user and were not sent by them
            return i.user.id === targetUser.id;
          };
        requestMessage.awaitMessageComponent({ filter, componentType: ComponentType.Button, max: 1, time: 30000, errors: ["time"]}).then(async (interaction) => {
            // update the request message to say user has accepted
            clearTimeout(timer3)
            await requestMessage.edit({content: content(player1, targetUser),embeds: [createEmb.createEmbed({title: `✅ ${targetUser.username} has accepted the request`, description: `The game will begin shortly`, color: scripts.getSuccessColor()})], components: []});
            await begin({player1:player1, player2: targetUser, interaction: interaction })
        }).catch(async (err) => {
            console.log("An Error Occurred", err);
            }); 
            
        


    }

    
  });
  
           
        } else if(interaction.customId === "ttt_member"){
            // send an embed with a button, first person to click the button is player2
                // after 1 click the button disables and the message updates saying that player2 has been selected
                let acceptButton = await createBtn.createButton({
                    customID: 'ttt_accept',
                    style: `success`,
                    label: 'Accept',
                })
                let acceptRow = await createActRow({components: [acceptButton]})
                let timer3 = setTimeout(async () => {
                    // Disable the message buttons after 30 seconds
                    await msg.edit({content: content(player1), embeds: [createEmb.createEmbed({title:`❗️ Potential Opponents took too long to decide`, description: `If you still wish to play, run \`/tictactoe\` again`, color: scripts.getErrorColor()})], components: [] });
                }, 30000);
                const maxTime2 = Date.now() + 30000;
              let timeLeft2 = Math.floor(maxTime2 / 30000);
              timeLeft2 = `<t:${timeLeft2}:R>`;
                let requestMessage = await msg.channel.send({content: content(player1),embeds: [createEmb.createEmbed({title: `❓ ${msg.author.username} wants to play Tic Tac Toe with someone here`, description: `Do you accept? You have ${timeLeft2} left to accept`, color: scripts.getColor()})], components: [acceptRow]})
                 filter = (i) => {
                    // Only listen to messages that mention the target user and were not sent by them
                    return true;
                  };
                requestMessage.awaitMessageComponent({ filter, componentType: ComponentType.Button, max: 1, time: 30000, errors: ["time"]}).then(async (interaction) => {
                    let targetUser = interaction.user 
                    // update the request message to say user has accepted
                    clearTimeout(timer3)
                    await requestMessage.edit({content: content(player1, targetUser),embeds: [createEmb.createEmbed({title: `✅ ${targetUser.username} has accepted the request`, description: `The game will begin shortly`, color: scripts.getSuccessColor()})], components: []});
                    await scripts.delay(2000)
                    await begin({player1:player1, player2: targetUser, interaction: interaction })
                }).catch(async (err) => {
                    console.log("An Error Occurred", err);
                    }); 
        }
            
    });
  } else {
    // maybe turn all this into a function called begin and pass in player 1 and player 2 after determining them 
    await begin({player1: player1, player2: player2, interaction: interaction})
}
    


  console.log(`${commandName} Complete: ✅`);
}