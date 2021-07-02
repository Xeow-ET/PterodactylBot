const { stripIndent } = require("common-tags")
const Discord = require("discord.js")
const settings = require("../../config/advance-config.json").command["user-info"]
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
        let lang = language["user-info"]
        let url = "/api/client/account"
        let method = "GET"
        let response = await PteCore.user(url, method, message)
        if(!response) return
        let attr = response["attributes"]
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(lang["your_info"])
        .addField(`${attr["first_name"]} ${attr["last_name"]} ${attr["admin"] === true ? lang["admin"] : lang["user"]}`, stripIndent`${lang["username"]}: ${attr["username"]}
        ${lang["email"]}: ${attr["email"]}
        ${lang["first_name"]}: ${attr["first_name"]}
        ${lang["last_name"]}: ${attr["last_name"]}
        ${lang["language"]}: ${attr["language"]}`)
        message.channel.send(embed)
    }
}