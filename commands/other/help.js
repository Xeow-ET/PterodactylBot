const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const ms = require('ms')
const settings = require("../../config/advance-config.json").command["help"]
module.exports = {
    enabled: settings.enabled,
    aliases: settings.aliases,
    name: settings.name,
    category: settings.category,
    description: settings.description,
    usage: settings.usage,
    roles: settings.roles,
    timeout: settings.timeout,
    run: async (bot, message, args, PteCore, language) => {
        let lang = language["help"]
        if (args[0]) {
            return getCMD(bot, message, args[0], lang);
        } else {
            return getAll(bot, message, lang);
        }
    }
}

function getAll(bot, message, lang) {
    
    const embed = new MessageEmbed()
        .setColor("RANDOM")

    const commands = (category) => {
        return bot.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join(" ");
    }

    const info = bot.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}

function getCMD(bot, message, input, lang) {
    const embed = new MessageEmbed()

    const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));

    let info = lang["command_not_found"].replace("%command%", input.toLowerCase());

    if (!cmd) {
        return message.channel.send(embed.setColor("RANDOM").setDescription(info));
    }

    if (cmd.name) info = `**${lang["command_name"]}**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**${lang["aliases"]}**: ${cmd.aliases.map(a => `\`${a}\``).join(", ") === "" ? lang["no_alias"] : cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**${lang["description"]}**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**${lang["usage"]}**: ${cmd.usage}`;
        embed.setFooter(lang["footer"]);
    }
    if (cmd.timeout) info += `\n**${lang["cooldown"]}**: ` + ms(cmd.timeout)
    return message.channel.send(embed.setColor("RANDOM").setDescription(info));
}