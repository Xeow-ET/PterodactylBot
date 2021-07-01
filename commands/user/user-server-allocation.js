const settings = require("../../config/advance-config.json").command["user-server-allocation"]
const Discord = require("discord.js")
const { stripIndent } = require("common-tags")
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
        let lang = language["user-server-allocation"]
        let ServerID = args[0]
        let id = args[2]
        let type = args[1]
        let notes = args[3]
        if(!type || !ServerID) {
            return message.channel.send(lang["wrong_usage"])
        }
        if (type === settings.options["1"]) {
            let method = "GET"
            let url = `/api/client/servers/${ServerID}/network/allocations`
            let response = await PteCore.user(url, method, message)
            if (!response) return
            const embed = new Discord.MessageEmbed()
                .setTitle(lang["list"].title.replace("%ServerID%", ServerID))
                .setColor("RANDOM")

            let i = 1
            for (const temp of response["data"]) {
                embed.addField(`**${i}. ${temp.attributes["ip"]}:${temp.attributes["port"]} ${temp.attributes["is_default"] === true ? lang["default"] : ""}**`, stripIndent`
                ${lang["id"]}: ${temp.attributes["id"]}
                ${lang["ip_alias"]}: ${temp.attributes["ip_alias"]}
                ${lang["note"]}: ${temp.attributes["notes"] === null ? lang["no_note"] : temp.attributes["note"]}`)
                i++
            }
            message.channel.send(embed)
        } else if (type === settings.options["2"]) {
            let url = `/api/client/servers/${ServerID}/network/allocations`
            let method = "POST"
            let response = await PteCore.user(url, method, message)
            if (!response) return
            const embed = new Discord.MessageEmbed()
                .setTitle(lang["create"].title)
                .setDescription(stripIndent`
                    ${lang["id"]}: ${response["attributes"].id}
                    ${lang["ip"]}: ${response["attributes"].ip}:${response["attributes"].port} ${response["attributes"].is_default === true ? lang["default"] : ""}
                    ${lang["ip_alias"]}: ${response["attributes"].ip_alias}
                    ${lang["note"]}: ${response["attributes"].notes === null ? lang["no_note"] : response.attributes["notes"]}`)
                .setColor("RANDOM")
            message.channel.send(embed)
        } else if (type === settings.options["3"]) {
            if (!notes || !id) {
                return message.channel.send(lang["wrong_usage"])
            }
            let url = `/api/client/servers/${ServerID}/network/allocations/${id}`
            let method = "POST"
            let body = JSON.stringify({
                "notes": notes
            })
            let response = await PteCore.user(url, method, message, body)
            if (!response) return
            const embed = new Discord.MessageEmbed()
                .setTitle(lang["notes"].title)
                .setDescription(stripIndent`
                ${lang["id"]}: ${response["attributes"].id}
                ${lang["ip"]}: ${response["attributes"].ip}:${response["attributes"].port} ${response["attributes"].is_default === true ? lang["default"] : ""}
                ${lang["ip_alias"]}: ${response["attributes"].ip_alias}
                ${lang["note"]}: ${response["attributes"].notes === null ? lang["no_note"] : response.attributes["notes"]}`)
                .setColor("RANDOM")
            message.channel.send(embed)
        } else if (type === settings.options["4"]) {
            if (!id) {
                return message.channel.send(lang["wrong_usage"])
            }
            let url = `/api/client/servers/${ServerID}/network/allocations/${id}/primary`
            let method = "POST"
            let response = await PteCore.user(url, method, message)
            if (!response) return
            const embed = new Discord.MessageEmbed()
                .setTitle(lang["primary"].title)
                .setDescription(stripIndent`
                ${lang["id"]}: ${response["attributes"].id}
                ${lang["ip"]}: ${response["attributes"].ip}:${response["attributes"].port} ${response["attributes"].is_default === true ? lang["default"] : ""}
                ${lang["ip_alias"]}: ${response["attributes"].ip_alias}
                ${lang["note"]}: ${response["attributes"].notes === null ? lang["no_note"] : response.attributes["notes"]}`)
                .setColor("RANDOM")
            message.channel.send(embed)
        } else if (type === settings.options["5"]) {
            if (!id) {
                return message.channel.send(lang["wrong_usage"])
            }
            let url = `/api/client/servers/${ServerID}/network/allocations/${id}`
            let method = "DELETE"
            let response = await PteCore.user(url, method, message)
            if(response === "empty") {
                message.channel.send(lang["delete"].success)
            }
        } else {
            message.channel.send(lang["wrong_usage"])
        }
    }
}