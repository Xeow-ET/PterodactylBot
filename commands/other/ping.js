const Discord = require('discord.js')
const settings = require("../../config/advance-config.json").command["ping"]
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
        let lang = language["ping"]
         message.channel.send(lang["pinging"]).then(msg=>{
        const _ = new Discord.MessageEmbed()
        .setTitle(lang["title"])
        .setDescription(lang["description"].replace("%ping%", Math.floor(msg.createdTimestamp - message.createdTimestamp)).replace("%api_ping%", Math.round(bot.ws.ping)))
        .setColor('RANDOM')
        msg.edit("\u200B")
        msg.edit(_);
    })
    }
}