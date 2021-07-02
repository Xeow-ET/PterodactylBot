const settings = require("../../config/advance-config.json").command["user-change-email"]
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
        let lang = language["user-change-email"]
        if(!args[0] && !args[1]) {
            return message.channel.send(lang["wrong_usage"])
        }
        let url = "/api/client/account/email"
        let method = "PUT"
        let body = JSON.stringify({
            "email": args[0],
            "password": args[1]
        })
        let response = await PteCore.user(url, method, message, body)
        if(response === "empty") {
            message.channel.send(lang["changed"])
        }
    }
}