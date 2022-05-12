const Command = require('../../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu, MessageAttachment} = require('discord.js'),
    { unlinkSync } = require('fs'),
    wait = require('util').promisify(setTimeout);

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'mmclose';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Fermer un ticket (staff seulement)';


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
    if (interaction.member.roles.includes(r=>r.id == "600643775978799115") || interaction.member.id == process.env.OWNER_ID) {
        if (interaction.channel.parentId != "757559028661354536") return interaction.reply({
            ephemeral:true,
            content: "Vous n'êtes pas dans la catégorie des modmails"
        });

        await interaction.reply({
            content: "<:Snap:834854661667815514>"
        });

        const attachment = new MessageAttachment('.cache/' + interaction.channel.name + '.txt');

        await interaction.user.send({
            content: "Chat du modmail de "+interaction.channel.name,
            attachments: [attachment]
        });

        unlinkSync('.cache/' + interaction.channel.name + '.txt');

        await wait(2000);

        interaction.channel.delete("Fin du ticket");

    } else interaction.reply({
        ephemeral:true,
        content: "Vous n'avez pas les permissions de faire ça"
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