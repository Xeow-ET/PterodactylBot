const settings = require("../../config/advance-config.json").command["user-server-power"]
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
        let lang = language["user-server-power"]
        let ServerID = args[0]
        let power = args[1]
        if(!ServerID || !power) {
            return message.channel.send(lang["wrong_usage"])
        }
        if(power !== "start" && power !== "stop" && power !== "restart" && power !== "kill") {
            return message.channel.send(lang["wrong_usage"])
        }
        let url = `/api/client/servers/${ServerID}/power`
        let method = "POST"
        let body = JSON.stringify({
            "signal": power
        })
        let response = await PteCore.user(url, method, message, body)
        if(response === "empty") {
            return message.channel.send(lang["sucess"])
        }
    }
}