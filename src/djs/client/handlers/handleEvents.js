module.exports = async (client, eventFiles, num) => {
    console.log(`the number is ${num}`)
    switch (num) {
        case 1:
        for (const file of eventFiles) {
            const event = require(`../events/${file}`);
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
        console.log(`Handle Events: ✅`)
        break;
        case 2:
        for (const file of eventFiles) {
            const event = require(`../../../MongoDB/db/config/${file}`);
            
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
            
            
        }
        console.log(`Handle Events: ✅`)
        break;
        default:
        console.log(`Handle Events: ❌`)
        break;
        
    }
    }