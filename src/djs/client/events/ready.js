const scripts = require("../../functions/scripts/scripts.js");
const mongoose = require("mongoose");


module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        

        async function pickPresence () {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,

                        },
                    
                    ],

                    status: statusArray[option].status
                })
            } catch (error) {
                console.error(error);
            }
        }
        client.channelsDB =  require(`../../../MongoDB/db/schemas/schema_channels.js`);
        client.usersDB = require(`../../../MongoDB/db/schemas/schema_users.js`);
        client.groupbuyDB = require("../../../MongoDB/db/schemas/schema_groupbuys.js");
        client.listsDB = require("../../../MongoDB/db/schemas/schema_list.js");
        client.localLog = [];
        client.getChannel = async (channel) => {
  
            let data;
            // searching channels db for the channel
            try {
              data = await client.channelsDB.findOne({ channelID: `${channel.id}`, serverID: `${channel.guild.id}` })
            } catch (error) {
              console.log(`an error occurred while trying to get the data from the database: `, error);
            }
            if (data == null) {
              // console.log(data)
              console.log(`[ data ] NOT found in query`)
          
              return null;
          
            } else {
              // console.log(data)
              console.log(`[ data ] found in query: `)
              return data;
            }
          
          }
        client.setupChannel = async (channel) => {
            // save the message & links & files to the db
            let data;
            if(!(typeof channel === "object") || typeof channel === "string"){
                channel = client.channels.cache.get(channel);
            }
            
          
            try {
              data = await client.getChannel(channel);
            } catch (error) {
              console.log(`an error occurred while trying to get the data from the database: `, error);
            }
            if (data == null) {
              // console.log(data)
              console.log(`[ data ] NOT found in query`)
          
              let obj = {
                _id: `${new mongoose.Types.ObjectId()}`,
                channelID: `${channel?.id}`,
                channelName: `${channel?.name}`,
                createdAt: `${channel?.createdAt}`,
                serverName: `${channel?.guild?.name}`,
                serverID: `${channel?.guild?.id}`,
                manageable: channel?.manageable,
                viewable: channel?.viewable,
                parentCategoryName: `${channel?.parent?.name}`,
                parentCategoryID: `${channel?.parentId}`,
                url: `${channel?.url}`,
                copyright_filterOn: false,
                attachments_filterOn: false,
                links_filterOn: false,
                deletedMessages: [],
              }
              try {
                await client.channelsDB.create(obj);
                console.log(`created & saved to db`);
              } catch (error) {
                scripts.logError(error)
                await client.Devs.LT.send({ content: `new channel not created in db, for channel: ${channel?.name} in server: ${channel?.guild?.name}at ${new Date().toLocaleString()}`});
              }
          
              try {
              data = await client.getChannel(channel);
            } catch (error) {
              console.log(`an error occurred while trying to get the data from the database: `, error);
            }
              return data;
            } else {
              // console.log(data)
              console.log(`[ data ] found in query: `)
              return data;
            }
          
          }

          client.getUser = async (user) => {
  
            let data;
            // searching users db for the user
            // check if user is not obj then fetch user as if user var is user id
            if (!(typeof user === "object") || typeof user === "string") {
                user = client.users.cache.get(user);
              }
              

            try {
              data = await client.usersDB.findOne({ userID: `${user.id || user}` })
            } catch (error) {
              console.log(`an error occurred while trying to get the data from the database: `, error);
            }
            if (data == null) {
              // console.log(data)
              console.log(`[ data ] NOT found in query`)
          
              return null;
          
            } else {
              // console.log(data)
              console.log(`[ data ] found in query: `)
              return data;
            }
          
          }
        client.setupUser = async (user) => {
            // save the message & links & files to the db
            let data;
          
            try {
              data = await client.getUser(user);
            } catch (error) {
              console.log(`an error occurred while trying to get the data from the database: `, error);
            }
            if (!(typeof user === "object") || typeof user === "string") {
              user = client.users.cache.get(user);
              if(!user.id){
                console.log(`user not found in client cache`)
                return null;
              }
            }
            if (data == null) {
              // console.log(data)
              console.log(`[ data ] NOT found in query`)
          /**
          
          {
            _id: Schema.Types.ObjectId,
            userID: { type: String, required: true },
            username: String,
            accentColor: String,
            avatarURL: String,
            bannerURL: String,
            avatar: String,
            banner: String,
            bot: Boolean,
            createdTimestamp: Number,
            defaultAvatarURL: String,
            discriminator: String,
            hexAccentColor: String,
            tag: String,
            createdAt: String,
            // an array of server objects with key as server name and value as server id
            servers: [ {serverName: String, serverID: String,
            member: {
              avatar: String,
              
              avatarURL: String,
              
              displayColor: String,
              displayHexColor: String,
              displayName: String,
              joinedAt: String,
              joinedTimestamp: Number,
              nickname: String,
              roles: [ {roleName: String, roleID: String} ],
              managable: Boolean,
              viewable: Boolean,
              permissions: [ {permissionName: String, permissionID: String} ],
              serverOwner: Boolean,
            },
            } ],
          }
          
           */
              let obj = {
                _id: `${new mongoose.Types.ObjectId()}`,
                userID: `${user.id || user}`,
                username: `${user.username}`,
                accentColor: `${user.accentColor}`,
                avatarURL: `${user.avatarURL()}`,       
                bannerURL: `${user.bannerURL()}`,
                avatar: `${user.avatar}`,
                banner: `${user.banner}`,
                bot: user.bot,
                createdTimestamp: user.createdTimestamp,
                defaultAvatarURL: `${user.defaultAvatarURL}`,
                discriminator: `${user.discriminator}`,
                hexAccentColor: `${user.hexAccentColor}`,
                tag: `${user.tag}`,
                createdAt: `${user.createdAt}`,
                servers: [],
              }

              // calculate servers array and add to obj
              // get every server the user and the bot share together
                let servers = [];
                let guilds = [];

                client.guilds.cache.forEach(guild => {
                    if (guild.members.cache.has(user.id)) {
                        guilds.push(guild);
                    }
                });


                for ( let guild of guilds){

                  // get the users member object for the current guild
                  let member = guild.members.cache.get(user.id);


                    let serverObj = {
                        serverName: `${guild.name}`,
                        serverID: `${guild.id}`,
                        member: {
                            avatar: `${member.avatarURL()}`,
                            bannable: member.bannable,
                            avatarURL: `${member.avatarURL()}`,
                            displayColor: `${member.displayColor}`,
                            displayHexColor: `${member.displayHexColor}`,
                            displayName: `${member.displayName}`,
                            joinedAt: `${member.joinedAt}`,
                            joinedTimestamp: `${member.joinedTimestamp}`,
                            nickname: `${member.nickname}`,
                            roles: [],
                            managable: member.manageable,
                            viewable: member.viewable,
                            permissions: [],
                            serverOwner: member.guild.owner,
                        },
                }
                // calculate roles the user/member has array and add to serverObj
                let roles = [];
                let djsRoles = member._roles;
                for (let role of djsRoles){
                    let roleObj = {
                        roleName: `${role.name}`,
                        roleID: `${role.id}`,
                    }
                    roles.push(roleObj)
                }
                serverObj.member.roles = roles;

                // calculate permissions the user/member has array and add to serverObj
                let permissions = [];
                let djsPermissions = member?.permissions || [];
                for (let permission of djsPermissions){
                    let permissionObj = {
                        permissionName: `${permission.name}`,
                        permissionID: `${permission.id}`,
                    }
                    permissions.push(permissionObj)
                }
                serverObj.member.permissions = permissions;

                servers.push(serverObj);
            }

                obj.servers = servers;

              try {
                await client.usersDB.create(obj);
                console.log(`created & saved to db`);
              } catch (error) {
                scripts.logError(error, 'error creating user in db')
                //await throwNewError({ action: `copyright content not saved`, interaction: interaction, error: error });
              }
          
              try {
              data = await client.getUser(user);
            } catch (error) {
              console.log(`an error occurred while trying to get the data from the database: `, error);
            }
              return data;
            } else {
              // console.log(data)
              console.log(`[ data ] found in query: `)
              return data;
            }
          
          }

        console.log(`Ready! ✅`)
    },
};