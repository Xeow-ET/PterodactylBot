const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const ms = require('ms')
module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "幫助列表",
    usage: "[command | alias]",
    run: async (bot, message, args) => {
        if (args[0]) {
            return getCMD(bot, message, args[0]);
        } else {
            return getAll(bot, message);
        }
    }
}

function getAll(bot, message) {
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

function getCMD(bot, message, input) {
    const embed = new MessageEmbed()

    const cmd = bot.commands.get(input.toLowerCase()) || bot.commands.get(bot.aliases.get(input.toLowerCase()));
    
    let info = `沒有找到指令 **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RANDOM").setDescription(info));
    }

    if (cmd.name) info = `**指令名字**: ${cmd.name}`;
    if (cmd.aliases) info += `\n**执行**: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\n**描述**: ${cmd.description}`;
    if (cmd.usage) {
        info += `\n**用法**: ${cmd.usage}`;
        embed.setFooter(`语法: <> = 必须, [] = 可选`);
    }
    if(cmd.timeout) info += '\n**超时**: '+ms(cmd.timeout)
    return message.channel.send(embed.setColor("RANDOM").setDescription(info));
}