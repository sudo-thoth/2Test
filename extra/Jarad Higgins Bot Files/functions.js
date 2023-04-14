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
                            client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, 'Queued:'));
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
                        client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, randomSong, 'Queued random song:'));
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
                        client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, removedSong, 'Removed from queue:'));
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
                        let clearMessage = await client.channels.cache.get(interaction.channel_id).send(new Discord.MessageEmbed().setDescription(`Queue cleared ${loadedEmojis.get('finished')}`));
                        setTimeout(function () {
                            clearMessage.delete().then().catch(function (error) {});
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
                            client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, `Inserted to the ${order} song in queue:`));
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
                            client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, `Replaced the ${order} song in queue:`));
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
                                    client.channels.cache.get(interaction.channel_id).send(embed);
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
                            client.channels.cache.get(interaction.channel_id).send(embed);
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
                            client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, song, `Search result for "${interaction.data.options[0].value.trim()}":`));
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
                            client.channels.cache.get(interaction.channel_id).send(await songEmbed(interaction, randomSong, 'Searched random song:'));
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
                        if (embedArr !== null) {
                            for (let embed of embedArr) {
                                client.channels.cache.get(interaction.channel_id).send(embed);
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
                            client.channels.cache.get(interaction.channel_id).send(await songEmbedLink(interaction, song));
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
                                    client.channels.cache.get(interaction.channel_id).send(await songEmbedInfo(interaction, songMatch, info, `Info search result for "${interaction.data.options[0].value.trim()}":`));
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
                            client.channels.cache.get(interaction.channel_id).send(await songEmbedInfo(interaction, songMatch, await songSearchInfoMatch(songMatch), `Info search result for "${interaction.data.options[0].value.trim()}":`));
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