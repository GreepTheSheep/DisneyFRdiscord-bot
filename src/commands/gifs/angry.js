const Command = require('../../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu} = require('discord.js'),
    gifsObj = require('../../../assets/command-gifs.json');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'angry';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Pas content';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'personne',
        description: 'A qui rejeter la faute?',
        type: 'user',
        required: false
    }
];

/**
 * Set the usage here, this is what will show up when you type the command
 * This part is executed as slash command
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 */
exports.execute = async (interaction, commands) => {
    let personne = interaction.options.getUser('personne'),
        array = gifsObj[this.name],
        gifUrl = randomItem(array),
        embed = new MessageEmbed();

    embed.setImage(gifUrl);
    embed.setColor('DARK_RED');

    if (personne) embed.setDescription(`<@${interaction.member.id}> n'est pas content de <@${personne.id}> 😠`);
    else embed.setDescription(`<@${interaction.member.id}> n'est pas content 😠`);

    interaction.reply({
        embeds: [embed]
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

function randomItem(array){
    return array[Math.floor(Math.random() * array.length)];
}