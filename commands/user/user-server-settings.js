const settings = require("../../config/advance-config.json").command["user-server-settings"]
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
        let lang = language["user-server-settings"]
        let ServerID = args[0]
        let Type = args[1]
        let NewName = args[2]
        if(!ServerID || !Type) return message.channel.send(lang["wrong_usage"])
        if(Type === settings.options["1"]) {
            if(!NewName) return message.channel.send(lang["wrong_usage"])
            let url = `/api/client/servers/${ServerID}/settings/rename`
            let method = "POST"
            let body = JSON.stringify({
                "name": NewName
            })
            let response = await PteCore.user(url, method, message, body)
            if(response === "empty") {
                message.channel.send(lang["renamed"])
            }
        } else if(Type === settings.options["2"]) {
            let url = `/api/client/servers/${ServerID}/settings/reinstall`
            let method = "POST"
            let response = await PteCore.user(url, method, message)
            if(!response) return
            message.channel.send(lang["reinstalled"])
        }
    }
}