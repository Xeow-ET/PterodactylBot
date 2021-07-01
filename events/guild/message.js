const Timeout = new Set();
const ms = require('ms')
const PteCore = require("../client/core")
module.exports = async (bot, message, DiscordConfig, PteroConfig, language) => {
    let lang = language["handle"].message
    let prefix = DiscordConfig["prefix"]
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    if (message.author.bot) return console.debug(lang["bot"])
    if (!message.member) message.member = await message.guild.fetchMember(message);
    if (!message.guild) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;

    let command = bot.commands.get(cmd);
    if (!command) command = bot.aliases.get(cmd);
    if (command) {
        if (command.roles.length > 0) {
            let roles = []
            message.member.roles.cache.forEach(role => {
                roles.push(role.id)
            })
            let access = false
            for (const temp of roles) {
                if (command["roles"].includes(temp)) {
                    console.debug(lang["roles_found"].replace("%role%", temp).replace("%command%", command.name))
                    access = true
                }
            }
            if (access === false) return console.debug(lang["roles_not_found"])
        }

        if (command.timeout) {
            if (Timeout.has(`${message.author.id}${command.name}`)) {
                return message.reply(lang["have_cooldown"].replace("%cooldown%", ms(command.timeout)))
            } else {
                command.run(bot, message, args);
                Timeout.add(`${message.author.id}${command.name}`)
                setTimeout(() => {
                    Timeout.delete(`${message.author.id}${command.name}`)
                }, command.timeout);
            }
        } else {
            console.log(lang["runned_command"].replace("%user%", message.member.user.tag).replace("%command%", message.content))
            command.run(bot, message, args, PteCore, language["command"])
        }

    }
}
