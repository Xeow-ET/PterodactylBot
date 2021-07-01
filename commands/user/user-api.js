const { stripIndent } = require("common-tags")
const Discord = require("discord.js")
const settings = require("../../config/advance-config.json").command["user-api"]
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
        let lang = language["user-api"]
        let url = "/api/client/account/api-keys"
        if (args[0] === settings.options["1"]) {
            let method = "GET"
            let response = await PteCore.user(url, method, message)
            if (!response) return
            const embed = new Discord.MessageEmbed()
                .setTitle(lang["list"].title)
                .setColor("RANDOM")
            let i = 1
            for (const temp of response["data"]) {
                embed.addField("**" + `${i}. ` + temp["attributes"].description + "**", stripIndent`${lang["list"].identifier}: ${temp["attributes"].identifier}
                ${lang["list"].allowed_ips}: ${temp["attributes"].allowed_ips.join(" ") === "" ? lang["list"].none : temp["attributes"].allowed_ips.join(" ")}
                ${lang["list"].lastest_use}: ${temp["attributes"].last_used_at === null ? lang["list"].unused : temp["attributes"].last_used_at}
                ${lang["list"].creation_date}: ${temp["attributes"].created_at}`)
                i++
            }
            message.channel.send(embed)
        } else if (args[0] === settings.options["2"]) {
            if (!args[1]) {
                return message.channel.send(lang["wrong_usage"])
            }
            let method = "POST"
            let body = {
                "description": args[1]
            }
            if (args[2]) {
                body["allowed_ips"] = args[2].split(",")
            }
            body = JSON.stringify(body)
            let response = await PteCore.user(url, method, message, body)
            message.channel.send(`${lang["created"].replace("%secret_token%", response["meta"].secret_token)}`)
        } else if (args[0] === settings.options["3"]) {
            if(!args[1]) {
                return message.channel.send(lang["wrong_usage"])
            }
            let method = "DELETE"
            url = `/api/client/account/api-keys/${args[1]}`
            let response = await PteCore.user(url, method, message)
            if(response === "empty") {
                message.channel.send(lang["deleted"])
            }
        } else {
            message.channel.send(lang["wrong_usage"])
        }
    }
}