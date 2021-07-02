const Discord = require("discord.js")
const settings = require("../../config/advance-config.json").command["user-show-permissions"]
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
        let lang = language["user-show-permissions"]
        let url = "/api/client/permissions"
        let method = "GET"
        let response = await PteCore.user(url, method, message)
        if(!response) return
        const embed = new Discord.MessageEmbed()
        .setTitle(lang["title"])
        .addField(lang["allocation"], Object.keys(response["attributes"].permissions["allocation"].keys).join(", "))
        .addField(lang["backup"], Object.keys(response["attributes"].permissions["backup"].keys).join(", "))
        .addField(lang["control"], Object.keys(response["attributes"].permissions["control"].keys).join(", "))
        .addField(lang["database"], Object.keys(response["attributes"].permissions["database"].keys).join(", "))
        .addField(lang["file"], Object.keys(response["attributes"].permissions["file"].keys).join(", "))
        .addField(lang["schedule"], Object.keys(response["attributes"].permissions["schedule"].keys).join(", "))
        .addField(lang["settings"], Object.keys(response["attributes"].permissions["settings"].keys).join(", "))
        .addField(lang["startup"], Object.keys(response["attributes"].permissions["startup"].keys).join(", "))
        .addField(lang["user"], Object.keys(response["attributes"].permissions["user"].keys).join(", "))
        .addField(lang["websocket"], Object.keys(response["attributes"].permissions["websocket"].keys).join(", "))
        message.channel.send(embed)
    }
}