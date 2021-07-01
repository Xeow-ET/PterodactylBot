const { stripIndent } = require("common-tags")
const Discord = require("discord.js")
const settings = require("../../config/advance-config.json").command["user-servers"]
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
        let lang = language["user-servers"]
        let url = "/api/client"
        let method = "GET"
        let response = await PteCore.user(url, method, message)
        if(!response) return
        let res = response["data"].slice(0, 20)
        const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setTitle(lang["title"])
        let i = 1
        if(res.length < 1) {
            embed.setDescription(lang["no_server"])
            return message.channel.send(embed)
        }
        for(const temp of res) {
            if(Number.isInteger(i/3)) {
                embed.addField(`**${i}.** ${temp["attributes"].name}${temp["attributes"].server_owner === true ? lang["owner"] : ""}${temp["attributes"].is_suspended === true ? lang[suspended] : ""}${temp["attributes"].is_installing === true ? lang["installing"] : ""}`, "```" + stripIndent`
                ${lang["description"]}: ${temp["attributes"].description}
                ${lang["identifier"]}: ${temp["attributes"].identifier}
                ${lang["uuid"]}: ${temp["attributes"].uuid}
                ${lang["node"]}: ${temp["attributes"].node}
                ${lang["sftp_details"]}: ${temp["attributes"].sftp_details["ip"]}:${temp["attributes"].sftp_details["port"]}
                ${lang["limits"]}:
                ${temp["attributes"].limits["cpu"]}, ${temp["attributes"].limits["memory"]}, ${temp["attributes"].limits["disk"]}, ${temp["attributes"].limits["swap"]}, ${temp["attributes"].limits["io"]}
                ` + "```", true)
                i++
            } else {
                embed.addField(`**${i}.** ${temp["attributes"].name}${temp["attributes"].server_owner === true ? lang["owner"] : ""}${temp["attributes"].is_suspended === true ? lang[suspended] : ""}${temp["attributes"].is_installing === true ? lang["installing"] : ""}`, "```" + stripIndent`
                ${lang["description"]}: ${temp["attributes"].description}
                ${lang["identifier"]}: ${temp["attributes"].identifier}
                ${lang["uuid"]}: ${temp["attributes"].uuid}
                ${lang["node"]}: ${temp["attributes"].node}
                ${lang["sftp_details"]}: ${temp["attributes"].sftp_details["ip"]}:${temp["attributes"].sftp_details["port"]}
                ${lang["limits"]}:
                ${temp["attributes"].limits["cpu"]}, ${temp["attributes"].limits["memory"]}, ${temp["attributes"].limits["disk"]}, ${temp["attributes"].limits["swap"]}, ${temp["attributes"].limits["io"]}
                ` + "```")
                i++
            }
        }
        message.channel.send(embed)
    }
}