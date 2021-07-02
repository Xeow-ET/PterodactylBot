const settings = require("../../config/advance-config.json").command["user-server-details"]
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
        let lang = language["user-server-details"]
        let ServerID = args[0]
        if (!ServerID) {
            return message.channel.send(lang["wrong_usage"])
        }
        let url = `/api/client/servers/${ServerID}`
        let method = "GET"
        let response = await PteCore.user(url, method, message)
        if (!response) return
        let attr = response["attributes"]
        const embed = new Discord.MessageEmbed()
            .setTitle(lang["title"].replace("%ServerID%", ServerID))
            .addField(`**${lang["name"]}: ${attr["name"]}${attr["server_owner"] === true ? lang["owner"] : ""}${attr["is_suspended"] === true ? lang[suspended] : ""}${attr["is_installing"] === true ? lang["installing"] : ""}**`, stripIndent`
                ${lang["description"]}: ${attr["description"]}
                ${lang["identifier"]}: ${attr["identifier"]}
                ${lang["uuid"]}: ${attr["uuid"]}
                ${lang["node"]}: ${attr["node"]}
                ${lang["sftp_details"]}: ${attr.sftp_details["ip"]}:${attr.sftp_details["port"]}
                ${lang["limits"]}:
                ${attr.limits["cpu"]}, ${attr.limits["memory"]}, ${attr.limits["disk"]}, ${attr.limits["swap"]}, ${attr.limits["io"]}
                ${lang["feature_limits"]}:
                ${attr["feature_limits"].databases}, ${attr["feature_limits"].allocations}, ${attr["feature_limits"].backups}`)

            for(const temp of attr["relationships"].allocations["data"]) {
                embed.addField(`**${temp["attributes"].ip}:${temp["attributes"].port}**${temp["attributes"].is_default === true ? lang["main"] : ""}`, stripIndent`
                ${lang["ip_alias"]}: ${temp["attributes"].ip_alias}
                ${lang["notes"]}: ${temp["attributes"].notes === null ? lang["null"] : ""}`)
        }
        message.channel.send(embed)
    }
}