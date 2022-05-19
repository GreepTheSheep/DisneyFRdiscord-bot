const Command = require('../../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu, MessageAttachment} = require('discord.js');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'mmadd';


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
        required: true
    }
];

/**
 * Set the usage here, this is what will show up when you type the command
 * This part is executed as slash command
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 */
exports.execute = async (interaction, commands) => {
    await interaction.deferReply({ephemeral:true});
    let role = await interaction.guild.roles.fetch(process.env.SERVER_ADMIN_ROLE_ID);
    if (role.members.some(member => member.id === interaction.member.id) || interaction.member.id == process.env.OWNER_ID) {
        if (interaction.channel.parentId != process.env.MODMAIL_CATEGORY_ID) return interaction.reply({
            ephemeral:true,
            content: "Vous n'êtes pas dans la catégorie des modmails"
        });

        let user = interaction.options.getUser('user');

        if (!user) return interaction.editReply({
            content: "Veuillez entrer un utilisateur"
        });

        await interaction.channel.permissionOverwrites.edit(user, {
            VIEW_CHANNEL: true,
        });

        interaction.editReply({
            content: `<@${user.id}> à été ajoutée`,
        });

    } else interaction.editReply({
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