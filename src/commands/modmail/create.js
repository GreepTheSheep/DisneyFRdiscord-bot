const Command = require('../../structures/Command'),
    {MessageEmbed, CommandInteraction, SelectMenuInteraction, Message, MessageActionRow, MessageButton, MessageSelectMenu} = require('discord.js'),
    { PermissionFlagsBits } = require('discord-api-types/v10'),
    { writeFileSync } = require('fs');

/**
 * Set the command here, it's what we'll type in the message
 * @type {string}
 */
exports.name = 'modmail';


/**
 * Set the description here, this is what will show up when you need help for the command
 * @type {string}
 */
exports.description = 'Créer un ticket';


/**
 * Set the command arguments here, this is what will show up when you type the command
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'raison',
        description: 'La raison de création d\'un ticket',
        type: 'string',
        required: true,
        choices: [
            {
                name: 'Signaler quelqu\'un',
                value: 'report'
            },
            {
                name: 'Poser une question',
                value: 'question'
            },
            {
                name: 'Poser une candidature',
                value: 'candidature'
            },
            {
                name: 'Demande de partenariat',
                value: 'partener'
            },
            {
                name: 'Autre demande',
                value: 'other'
            }
        ]
    },
    {
        name: 'message',
        description: 'Message supplémentaire ?',
        type: 'string',
        required: false,
    }
];

/**
 * Set the usage here, this is what will show up when you type the command
 * This part is executed as slash command
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 */
exports.execute = async (interaction, commands) => {
    let reason = interaction.options.getString('raison'),
        message = interaction.options.getString('message');

    if (reason == 'other' && !message)
        return interaction.reply({
            ephemeral: true,
            content: "Il faut ajouter un message supplémentaire pour donner la raison"
        });

    let channelsCategory = interaction.guild.channels.cache.find(c => c.id == '757559028661354536' && c.type == "GUILD_CATEGORY");
    if (!channelsCategory)
        return interaction.reply({
            ephemeral:true,
            content: "Erreur: la catégorie des salons modmail n'existe pas"
        });

    await interaction.deferReply({ephemeral:true});

    let channel = await interaction.guild.channels.create(reason+'-'+interaction.member.displayName, {
        parent: channelsCategory.id,
        permissionOverwrites: [
            {
                id: interaction.guild.roles.cache.find(r=>r.name == "@everyone").id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: "600643775978799115",
                allow: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: process.env.OWNER_ID,
                allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ManageChannels]
            }
        ]
    });

    channel.send('<:Dipper:832564058447544361> Bienvenue dans le modmail <@' + interaction.member.id + '>!\n- __Vous avez choisi la raison: '+reason+(message ? ("__ avec un message supplémentaire: "+message): "__")+', le <@&600643775978799115> vous répondra !');
    writeFileSync('.cache/'+channel.name+'.txt', ticketHeader(interaction));

    let embed = new MessageEmbed();
    embed.setColor('#12E74D')
        .setTitle('✅ Modmail crée!')
        .setDescription('Veuillez vous rendre sur <#' + channel.id + '>');

    interaction.editReply({
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

/**
 * Create .txt header
 * @param {CommandInteraction} interaction
 * @returns {string}
 */
function ticketHeader(interaction) {
    let reason = interaction.options.getString('raison'),
        message = interaction.options.getString('message'),
        content = `Ticket modmail ouvert par ${interaction.user.tag} le ${date()} à ${time()} pour la raison ${reason} ${message?` (${message})`:""}`;

    return content+"\n"+new Array().fill("-", 0, 20).join();
}

function date() {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Decembre"];
    return new Date().getDate() + ' ' + months[new Date().getMonth()] + ' ' + new Date().getFullYear();
}

function time() {
    return new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
}