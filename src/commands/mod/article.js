const Command = require('../../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu, MessageAttachment} = require('discord.js'),
    reglesArticlesImg = require('../../../assets/regles_articles.json');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'article';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Affiche une image sur une article du règlement';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'numero',
        description: 'Numero de l\'article',
        type: 'number',
        required: true,
        choices: [
            {
                name: 'Article 1',
                value: 0
            },
            {
                name: 'Article 2',
                value: 1
            },
            {
                name: 'Article 3',
                value: 2
            },
            {
                name: 'Article 4',
                value: 3
            },
            {
                name: 'Article 5',
                value: 4
            },
            {
                name: 'Article 6',
                value: 5
            },
            {
                name: 'Article 7',
                value: 6
            },
            {
                name: 'Article 8',
                value: 7
            },
            {
                name: 'Article 9',
                value: 8
            },
            {
                name: 'Article 10',
                value: 9
            }
        ]
    }
];

/**
 * Set the usage here, this is what will show up when you type the command
 * This part is executed as slash command
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 */
exports.execute = async (interaction, commands) => {
    let number = interaction.options.getNumber('numero'),
        embed = new MessageEmbed().setImage(reglesArticlesImg[number]),
        role = await interaction.guild.roles.fetch(process.env.SERVER_ADMIN_ROLE_ID),
        isStaff = role.members.some(member => member.id === interaction.member.id) || interaction.member.id == process.env.OWNER_ID;

    interaction.reply({
        embeds: [embed],
        ephemeral: !isStaff
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