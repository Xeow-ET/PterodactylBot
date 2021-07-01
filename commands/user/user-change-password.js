const settings = require("../../config/advance-config.json").command["user-change-password"]
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
        if(!args[0] && !args[1] && !args[2]) {
            return message.channel.send(lang["wrong_usage"])
        }
        let url = "/api/client/account/password"
        let method = "PUT"
        let body = JSON.stringify({
            "current_password": args[0],
            "password": args[1],
            "password_confirmation": args[2]
        })
        let response = await PteCore.user(url, method, message, body)
        if(response === "empty") {
            message.channel.send(lang["changed"])
        }
    }
}