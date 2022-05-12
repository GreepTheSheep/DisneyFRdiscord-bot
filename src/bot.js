require('dotenv').config();
const Command = require('./structures/Command'),
    { Client, Intents } = require('discord.js'),
    client = new Client({
        intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_INTEGRATIONS]
    }),
    { readFile, writeFileSync } = require('fs');

client.login().catch(err=>{
    console.error("❌ Connexion to Discord failed: " + err);
    process.exit(1);
});

/**
 * The list of commands the bot will use
 * @type {Command[]}
 */
let commands=[];


client.on('ready', async () => {
    console.log(`🤖 Logged in as ${client.user.tag}!`);
    client.user.setActivity('/aide', {type: 'WATCHING'});

    commands = require('./fetchAllCommands')();

    // Register commands
    client.guilds.cache.forEach(async (guild) => {
        await require('./registerCommandsScript')(guild.id, client.user.id, commands);
    });
});

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isCommand()) {
            const command = commands.find(c => c.name === interaction.commandName);
            if (!command) return;

            await command.execute(interaction, commands);

        } else if (interaction.isSelectMenu()) {

            const command = commands.find(c => c.name === interaction.customId.split('_')[0]);
            if (!command) return;

            let idIndexOf = interaction.customId.indexOf('_')+1,
                categoryId = interaction.customId.substring(idIndexOf, interaction.customId.indexOf('_', idIndexOf)),
                argument = null;

            if (categoryId === command.name+'_') categoryId = interaction.customId.substring(idIndexOf);
            else argument = interaction.customId.substring(interaction.customId.indexOf('_', idIndexOf)+1);

            await command.executeSelectMenu(interaction, categoryId, argument, commands);

        } else if (interaction.isButton()) {

            const command = commands.find(c => c.name === interaction.customId.split('_')[0]);
            if (!command) return;

            let idIndexOf = interaction.customId.indexOf('_')+1,
                buttonId = interaction.customId.substring(idIndexOf, interaction.customId.indexOf('_', idIndexOf)),
                argument = null;

            if (buttonId === command.name+'_') buttonId = interaction.customId.substring(idIndexOf);
            else argument = interaction.customId.substring(interaction.customId.indexOf('_', idIndexOf)+1);

            await command.executeButton(interaction, buttonId, argument, commands);

        }
    } catch (err) {
        interaction.reply({
            content: '❌ An error occurred while executing the command: ' + err,
            ephemeral: true
        });
        console.error(err);
    }
});

client.on('guildCreate', guild=>{
    console.log('📌 New guild joined: ' + guild.name);
    require('./registerCommandsScript')(guild.id, client.user.id, commands);
});

client.on('messageCreate', message=>{
    if (message.channel.parentId == process.env.MODMAIL_CATEGORY_ID) { // modmail
        readFile('.cache/'+ message.channel.name + '.txt', (err, data) => {
            if (err) return console.error(err);
            var attachurl;
            if (message.attachments.size > 0) attachurl = message.attachments.array()[0].url;
            else attachurl = '';

            writeFileSync('.cache/'+ message.channel.name + '.txt', data + `\n${message.author.tag} : ${message.content} ${attachurl}`);
        });
    }
});