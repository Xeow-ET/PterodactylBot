const { stripIndent } = require("common-tags")
const Discord = require("discord.js")
const settings = require("../../config/advance-config.json").command["user-database"]
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
        let lang = language["user-database"]
        let ServerID = args[0]
        if(!ServerID) return message.channel.send(lang["wrong_usage"])
        let url = `/api/client/servers/${ServerID}/databases`
        let database = args[2]
        let remote = args[3]
        if (args[1] === settings.options["1"]) {
            let method = "GET"
            let response = await PteCore.user(url, method, message)
            if (!response) return
            const embed = new Discord.MessageEmbed()
                .setColor("RANDOM")
                .setTitle(lang["list"].title)
            let data = response["data"].slice(0, 20)
            if (data.length < 1) {
                embed.setDescription(lang["list"].no_database)
                return message.channel.send(embed)
            }
            for (const temp of data) {
                let attr = temp["attributes"]
                if (Number.isInteger(i / 3)) {
                    embed.addField(`**${attr["name"]}**`, stripIndent`${lang["id"]}: ${attr["id"]}
                    ${lang["host"]}: ${attr.host["address"]}:${attr.host["port"]}
                    ${lang["username"]}: ${attr["username"]}
                    ${lang["connections_from"]}: ${attr["connections_from"]}
                    ${lang["max_connections"]}: ${attr["max_connections"]}`, true)
                } else {
                    embed.addField(`**${attr["name"]}**`, stripIndent`${lang["id"]}: ${attr["id"]}
                    ${lang["host"]}: ${attr.host["address"]}:${attr.host["port"]}
                    ${lang["username"]}: ${attr["username"]}
                    ${lang["connections_from"]}: ${attr["connections_from"]}
                    ${lang["max_connections"]}: ${attr["max_connections"]}`)
                }
            }
            message.channnel.send(embed)
        } else if (args[1] === settings.options["2"]) {
            if(!database) return message.channel.send(lang["wrong_usage"])
            let method = "POST"
            let body = JSON.stringify({
                "database": database,
                "remote": remote === undefined ? "%" : remote
            })
            let response = await PteCore.user(url, method, message, body)
            if(!response) return
            const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(lang["create"].title)
            .setDescription(stripIndent`${lang["name"]}: ${response["attributes"].name}
            ${lang["host"]}: ${response["attributes"].host["address"]}:${response["attributes"].host["port"]}
            ${lang["username"]}: ${response["attributes"].username}
            ${lang["password"]}: ${response["attributes"].relationships["password"][0].attributes["password"]}
            ${lang["connections_from"]}: ${response["attributes"].connections_from}
            ${lang["max_connections"]}: ${response["attributes"].max_connections}`)
            message.channel.send(embed)
        } else if (args[1] === settings.options["3"]) {
            if(!database) return message.channel.send(lang["wrong_usage"])
            url = `/api/client/servers/${ServerID}/databases/${database}`
            let method = "DELETE"
            let response = await PteCore.user(url, method, message)
            if(response === "empty") {
                message.channel.send(lang["deleted"])
            }
        } else if(args[1] === settings.options["4"]) {
            if(!database) return message.channel.send(lang["wrong_usage"])
            url = `/api/client/servers/${ServerID}/databases/${database}/rotate-password`
            let method = "POST"
            let response = await PteCore.user(url, method, message)
            if(!response) return
            const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(lang["rotate_password"].title)
            .setDescription(stripIndent`${lang["name"]}: ${response["attributes"].name}
            ${lang["host"]}: ${response["attributes"].host["address"]}:${response["attributes"].host["port"]}
            ${lang["username"]}: ${response["attributes"].username}
            ${lang["password"]}: ${response["attributes"].relationships["password"][0].attributes["password"]}
            ${lang["connections_from"]}: ${response["attributes"].connections_from}
            ${lang["max_connections"]}: ${response["attributes"].max_connections}`)
            message.channel.send(embed)
        }
    }
}