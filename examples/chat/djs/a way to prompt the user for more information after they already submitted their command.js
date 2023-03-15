// Q: is there a way, besides a modal, to prompt the user for more information like another role, or channel, or attachment, AFTER they already submitted their clash command

/* A: Yes, there is a way to prompt the user for more information after they already submitted their command using MessageCollector or InteractionCollector. These collectors allow you to listen for user messages or interactions in a channel, and then take action based on the collected data.

Here's an example of using MessageCollector to prompt the user for more information:                    */

// Assume `message` is the original message that triggered the command
const filter = m => m.author.id === message.author.id;
const collector = message.channel.createMessageCollector(filter, { max: 1 });

collector.on('collect', async (m) => {
  // Do something with the additional information provided by the user
});

collector.on('end', async (collected) => {
  if (collected.size === 0) {
    // Handle case where user did not provide additional information
  }
});

/* 
In this example, we're creating a MessageCollector that listens for a single message from the user who sent the original message. Once the user sends a message, the collector will call the collect event and we can do something with the additional information provided. If the user doesn't provide any additional information within a certain amount of time (specified by the max option), the collector will end and call the end event.

You can use similar logic with InteractionCollector to listen for button clicks, dropdown selections, and other types of interactions.                                                                               */