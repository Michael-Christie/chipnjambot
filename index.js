const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const token = 'NzAzMTg5NzU3ODYxMDM2MTIz.XqK_Hw.1u9RFOD4sqb69Poaoz4UaQkrBh4';
const prefix = '?';

client.on('ready', () => {
    console.log('Bot is online');
    client.user.setActivity('Chip Jam', { type: 'WATCHING' })
})

client.on('message', message => {

    if (message.author.bot)
        return;

    let command = message.content.charAt(0) == prefix;

    if (command) {
        let word = message.content.substring(1);
        let words = word.slice(0).trim().split(/ +/);


        switch (words[0].toLocaleLowerCase()) {

            case 'help':
                const help = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('**Help**')
                    //.setURL('https://discord.js.org/')
                    .setAuthor("Chip 'N Jam", client.user.avatarURL({ format: 'png' }), 'https://itch.io/jam/chip-n-jam')
                    //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
                    .addFields(
                        //{ name: '\u200B', value: '\u200B' },
                        { name: '__Idea__', value: 'Returns an Idea for you' },
                        { name: '__SetReminder__', value: 'Will send you a message after x amount of time is over.\n ?setReminder (Minutes) (Message) \nTime must be between 1 minute to 599 minuets' },
                        { name: '__Time__', value: 'Returns how long is left till the start / end / voting end of the Jam' },
                        { name: '\u200B', value: '\u200B' },
                        { name: '__Other Help__', value: 'If you need other help, try the #❓-help-❓ channel' },
                    )
                    // .addField('Inline field title', 'Some value here', true)
                    // .setImage('https://i.imgur.com/wSTFkRM.png')
                    .setTimestamp()
                    .setFooter('Hope this helps?', 'https://i.imgur.com/wSTFkRM.png');

                message.channel.send(help);
                break;

            case 'idea':
                let ideaWords = fs.readFileSync('./words.json');
                let ideas = JSON.parse(ideaWords);
                const mechanic = ideas["mechanic"];
                const noun = ideas["nouns"];
                const verb = ideas["verbs"];

                let mWord = mechanic[Math.floor(Math.random() * Math.floor(mechanic.length))].word;
                let nWord = noun[Math.floor(Math.random() * Math.floor(noun.length))].word;
                let vWord = verb[Math.floor(Math.random() * Math.floor(verb.length))].word;

                message.channel.send('<@' + message.author + '>' + ' ' + vWord + ' ' + mWord + ' ' + nWord);
                break;

            case 'setreminder':
                let time = parseInt(words[1]);
                console.log(words.length);
                if (words.length > 2) {
                    let m = words.slice(2, words.length).join(' ')

                    if (isNaN(time))
                        return;

                    if (time > 0 && time < 600) {

                        message.author.send("I will remind you in " + time + " minutes!");

                        setTimeout(function () {
                            message.author.send(m);
                        }, 1000 * (time * 60));
                    }
                }
                else {
                    message.channel.send('<@' + message.author + '>' + ", You need to add text!");
                }
                break;

            case 'time':
                //gives the time till jam / time remaining in jam / time left to vote
                let startDate = new Date("May 15, 2020 17:00:00").getTime();
                let endDate = new Date("May 17, 2020 17:00:00").getTime();
                let endVote = new Date("May 22, 2020 17:00:00").getTime();
                let ending = 'Till Start';

                let now = new Date().getTime();
                let diff;
                if (startDate > now) {
                    diff = startDate - now;
                    ending = 'Countdown Till Jam Start';
                }
                else if (endDate > now) {
                    diff = endDate - now;
                    ending = 'Countdown Till Jam End';

                }
                else if (endVote > now) {
                    diff = endVote - now;
                    ending = 'Countdown Till Voting End';
                }
                else {
                    diff = now - now;
                    ending = 'Jam Has Ended';
                }

                let days = Math.floor(diff / (1000 * 60 * 60 * 24));
                let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((diff % (1000 * 60)) / 1000);

                console.log(days + ' ' + hours + ' ' + minutes + ' ' + seconds);

                const cwd = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('**' + ending + '**')
                    //.setURL('https://discord.js.org/')
                    .setAuthor("Chip 'N Jam", client.user.avatarURL({ format: 'png' }), 'https://itch.io/jam/chip-n-jam')
                    //.setThumbnail('https://i.imgur.com/wSTFkRM.png')
                    .addFields(
                        //{ name: '\u200B', value: '\u200B' },
                        { name: 'Days', value: days, inline: false },
                        { name: 'Hours', value: hours, inline: true },
                        { name: 'Minutes', value: minutes, inline: true },
                        { name: 'Seconds', value: seconds, inline: true },

                    )
                    .setTimestamp();
                //.setFooter('Hope this helps?', 'https://i.imgur.com/wSTFkRM.png');

                message.channel.send(cwd);

                break;
            // case 'theme':
            //     message.channel.send('<@' + message.author + '>, The theme are avaliable from Itch : https://itch.io/jam/chip-n-jam');
            //     break;
            // case 'modifiers':
            //     message.channel.send('<@' + message.author + '>, The modifiers are on Itch : https://itch.io/jam/chip-n-jam');
            //     break;

        }
    }
    else {
        //message.channel.send('No Prefix');
    }
})



client.login(token);