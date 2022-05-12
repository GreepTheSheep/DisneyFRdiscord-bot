const Command = require('../../structures/Command'),
    {MessageEmbed, MessageButton, CommandInteraction, SelectMenuInteraction, ButtonInteraction, Message, MessageActionRow, MessageSelectMenu} = require('discord.js'),
    categoryInfos = require('../categoryInfo.json');

/**
 * @type {string}
 */
exports.name = 'aide';

/**
 * @type {string}
 */
exports.description = 'Liste des commandes';

/**
 * @type {Command.commandArgs[]}
 */
exports.args = [
    {
        name: 'category',
        description: 'La categorie des commandes',
        type: 'string',
        required: false,
        choices: categoryInfos.map(c=>{
            if (c.dir === "owner") return null;
            return {
                name: c.name,
                value: c.dir
            };
        })
    }
];

/**
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands
 */
exports.execute = async (interaction, commands) => {

    let embed, categoryTyped = interaction.options.getString('category');

    if (categoryTyped == null) {
        embed = embedCategories(commands);

        const categoriesSelectMenu = new MessageActionRow().addComponents(generateCategorySelectMenu(interaction, commands));

        interaction.reply({
            embeds: [embed],
            ephemeral: true,
            components: [categoriesSelectMenu]
        });

    } else {
        embed = embedCommands(categoryTyped, commands);

        interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};

/**
 * @param {ButtonInteraction} interaction
 * @param {string} buttonId
 * @param {string} argument
 * @param {Command[]} commands
 */
exports.executeButton = async (interaction, buttonId, argument, commands) => {};

/**
 * @param {SelectMenuInteraction} interaction
 * @param {string} categoryId
 * @param {string} argument
 * @param {Command[]} commands
 */
exports.executeSelectMenu = async (interaction, categoryId, argument, commands) => {
    if (categoryId == 'select-category') {
        let embed = embedCommands(interaction.values[0].toLowerCase(), commands);
        interaction.update({embeds: [embed]});
    }
};


// INTERNAL COMMAND METHODS

/**
 * Generate a MessageSelectMenu of categories of commands
 * @param {CommandInteraction} interaction
 * @param {Command[]} commands The list of commands
 * @returns {MessageSelectMenu}
 */
function generateCategorySelectMenu(interaction, commands){
    const categories = commandsCategories(commands),
        selectOptions = [];

    let hasUncategorized = false;

    categories.forEach(category => {
        if (category) {
            if (category.dir === "owner" && interaction.member.id !== process.env.OWNER_ID) return;

            selectOptions.push({
                label: category.name,
                description: category.description ? category.description : "",
                value: category.dir ? category.dir : category.name.toLowerCase(),
                emoji: category.emoji ? category.emoji : ""
            });
        }
        else hasUncategorized = true;
    });

    if (hasUncategorized) selectOptions.push({
        label: "Non catégorisée",
        value: "uncategorized",
        emoji: "❔"
    });

    return new MessageSelectMenu()
        .setCustomId('help_select-category')
        .setPlaceholder('Selectionner une categorie')
        .addOptions(selectOptions);
}

/**
 * Generates an embed of commands categories with the list of commands
 * @param {Commands[]} commands The list of commands
 * @returns {MessageEmbed} The embed to send
 */
function embedCategories(commands){
    const embed = new MessageEmbed().setColor('RANDOM'),
        categories = commandsCategories(commands);

    categories.forEach(category => {
        if (category) embed.addField((category.emoji ? category.emoji+" " : "") + category.name, `${category.description}\n\`/help ${category.dir}\``, true);
    });

    return embed;
}

/**
 * Generates an embed of commands in a category
 * @param {string} categoryDir The category dirctory name of commands
 * @param {Command[]} commands The full list of commands
 */
function embedCommands(categoryDir, commands){
    if (categoryDir == 'uncategorized') {
        const commandsInCategory = commands.filter(c => c.category == undefined),
            embed = new MessageEmbed().setColor('RANDOM').setTitle('Commandes non catégorisée');

        if (commandsInCategory.length === 0) embed.setColor("#FF0000").setTitle('Aucune commande!');
        else {
            for (const command of commandsInCategory) {
                embed.addField(`\`/${command.name}\``, command.description, true);
            }
        }

        return embed;
    } else {
        const category = commands.filter(c=>c.category != undefined).find(c=>c.category.dir.toLowerCase() === categoryDir.toLowerCase()).category,
            commandsInCategory = commands.filter(command => command.category === category),
            embed = new MessageEmbed().setColor('RANDOM').setTitle((category.emoji ? category.emoji + " ": "") + category.name);

        if (commandsInCategory.length === 0) embed.setColor("#FF0000").setTitle('Aucune commande!');
        else {
            for (const command of commandsInCategory) {
                embed.addField(`\`/${command.name}\``, command.description, true);
            }
        }

        return embed;
    }
}

/**
 * Generate an array of command categories
 * @param {Command[]} commands The list of commands
 * @returns {Command.categoryInfo[]} The list of categories
 */
function commandsCategories(commands){
    //split array into multiple arrays for categories
    const categories = [];
    let nullCommands = false;

    for (const command of commands) {
        if (command.category === null) {
            nullCommands = true;
            continue;
        }
        if (!categories.includes(command.category)) {
            categories.push(command.category);
        }
    }

    if (nullCommands) {
        categories.push({
            name: "Autres"
        });
    }

    return categories;
}