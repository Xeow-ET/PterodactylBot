const settings = require("../../config/advance-config.json").command["user-server-resource"]
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
        let lang = language["user-server-resource"]
        let ServerID = args[0]
        if (!ServerID) return message.channel.send(lang["wrong_usage"])
        let url = `/api/client/servers/${ServerID}/resources`
        let method = "GET"
        let response = await PteCore.user(url, method, message)
        if (!response) return
        const embed = new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setTitle(lang["title"].replace("%ServerID%", ServerID))
            .setDescription(stripIndent`
                ${lang["state"]}: ${response["attributes"].current_state}
                ${lang["is_suspended"]}: ${response["attributes"].is_suspended === true ? lang["suspended"] : lang["not_suspended"]}`)
            .addField(lang["resources_usage"], stripIndent`
                ${lang["memory"]}: ${response["attributes"].resources["memory_bytes"]} bytes
                ${lang["CPU"]}: ${response["attributes"].resources["cpu_absolute"]} %
                ${lang["disk"]}: ${response["attributes"].resources["disk_bytes"]} bytes
                ${lang["network_rx_bytes"]}: ${response["attributes"].resources["network_rx_bytes"]} bytes
                ${lang["network_tx_bytes"]}: ${response["attributes"].resources["network_tx_bytes"]} bytes`)
        message.channel.send(embed)
    }
}