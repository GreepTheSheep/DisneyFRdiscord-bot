const Command = require('../../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton} = require('discord.js'),
    { execSync } = require('child_process');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'about';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Informations du bot';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [];

/**
 * Set the usage here, this is what will show up when you type the command
 * This part is executed as slash command
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 */
exports.execute = async (interaction, commands) => {

    let package = require('../../../package.json'),
        version = package.version,
        djsVersion = package.dependencies['discord.js'].replace('^', ''),
        gitCommitDate = new Date(execSync('git show -s --format=%ci HEAD').toString().trim());

    let uptimeTotalSeconds = (interaction.client.uptime) / 1000,
        uptimeWeeks = Math.floor(uptimeTotalSeconds / 604800),
        uptimeDays = Math.floor(uptimeTotalSeconds / 86400),
        uptimeHours = Math.floor(uptimeTotalSeconds / 3600);
    uptimeTotalSeconds %= 3600;
    let uptimeminutes = Math.floor(uptimeTotalSeconds / 60);

    const embed = new MessageEmbed()
        .setColor("#9C01C4")
        .setTitle('A propos de ' + interaction.client.user.tag)
        .addField('Version', `v${version}\nDernière MàJ: <t:${gitCommitDate.getTime() / 1000}>`, true)
        .addField('Temps en ligne:', `${uptimeWeeks} semaines, ${uptimeDays} jours, ${uptimeHours} heures, ${uptimeminutes} minutes`, true)
        .addField('Infos techniques:', `Bibliothèque: [Discord.js](https://discord.js.org) (Version ${djsVersion})\nVersion Node.js: ${process.version}`)
        .setThumbnail(interaction.client.user.displayAvatarURL({size:512}))
        .setFooter({
            text: interaction.client.user.tag,
            iconURL: interaction.client.user.displayAvatarURL({size:128})
        });

    interaction.reply({
        embeds: [embed],
        ephemeral: true
    });
};

/**
 * This method is executed when an a button is clicked in the message
 * @param {ButtonInteraction} interaction
 * @param {string} buttonId
 * @param {string} argument
 * @param {Command[]} commands
 */
exports.executeButton = async (interaction, buttonId, argument, commands) => {};

/**
 * This method is executed when an update is made in a selectMenu
 * @param {SelectMenuInteraction} interaction
 * @param {string} categoryId
 * @param {string} argument
 * @param {Command[]} commands
 */
exports.executeSelectMenu = async (interaction, categoryId, argument, commands) => {};