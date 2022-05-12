const Command = require('../../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu, MessageAttachment} = require('discord.js'),
    { unlinkSync } = require('fs'),
    wait = require('util').promisify(setTimeout);

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'mmaccess';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Ajouter des membres dans un ticket (staff seulement)';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'user',
        description: 'Ajouter un utilisateur',
        type: 'user',
        required: false
    },
    {
        name: 'role',
        description: 'Ajouter un groupe d\'utilisateurs par leur rôle',
        type: 'role',
        required: false
    },
    {
        name: 'viewChannel',
        description: 'Autoriser l\'utilisateur à voir le ticket',
        type: 'boolean',
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
    if (interaction.member.roles.includes(r=>r.id == "600643775978799115") || interaction.member.id == process.env.OWNER_ID) {
        if (interaction.channel.parentId != "757559028661354536") return interaction.reply({
            ephemeral:true,
            content: "Vous n'êtes pas dans la catégorie des modmails"
        });

        let user = interaction.options.getUser('user'),
            role = interaction.options.getRole('role'),
            viewChannel = interaction.options.getBoolean('viewChannel') | false;

        if (!user && !role) return interaction.reply({
            ephemeral:true,
            content: "Veuillez entrer un utilisateur et/ou un rôle"
        });

        await interaction.deferReply({ephemeral:true});

        let users = [];

        if (user) {
            await interaction.channel.permissionOverwrites.edit(user, {
                VIEW_CHANNEL: viewChannel,
            });

            users.push(user);
        }
        if (role) {
            await interaction.channel.permissionOverwrites.edit(role, {
                VIEW_CHANNEL: viewChannel,
            });

            role.members.forEach(user => {
                users.push(user);
            });
        }

        interaction.editReply({
            content: `${users.length} membres ${viewChannel?"ajoutés":"partis"}: ${users.map(user => `<@${user.id}>`).join(', ')}`,
        });

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