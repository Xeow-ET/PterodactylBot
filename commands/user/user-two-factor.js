const Discord = require("discord.js")
const settings = require("../../config/advance-config.json").command["user-two-factor"]
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
        let lang = language["user-two-factor"]
        let url = "/api/client/account/two-factor"
        let type = args[0]
        if (type === settings.options["1"]) {
            let method = "GET"
            let response = await PteCore.user(url, method, message)
            if(!response) return
            if (response.data["image_url_data"]) {
                let data = response.data["image_url_data"].split("secret=")[1].split("&issuer=")[0]
                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(lang["require_code"])
                    .setDescription(lang["require_code_description"].replace("%key%", data))
                    .setImage(encodeURI(`https://www.google.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${response.data["image_url_data"]}`))
                    .setTimestamp()
                message.channel.send(embed)
                message.channel
                    .awaitMessages(
                        me =>
                            me.author.id === message.author.id,
                        { max: 1, time: 300000, errors: ['time'] }
                    )
                    .then(async collected => {
                        let url = "/api/client/account/two-factor"
                        let method = "POST"
                        let body = JSON.stringify({ "code": collected.first().content })
                        let response = await PteCore.user(url, method, message, body)
                        if(!response) return
                        const Embed = new Discord.MessageEmbed()
                        .setTitle(lang["backup_codes"])
                        .setDescription(response["attributes"].tokens.join("\n"))
                        message.channel.send(Embed)
                        m.edit(
                            new Discord.MessageEmbed()
                                .setTitle(lang["expired"])
                        )
                    })
                    .catch(() => {
                        m.edit(
                            new Discord.MessageEmbed()
                                .setTitle(lang["expired"])
                        )
                    })
            }
        } else if (type === settings.options["2"]) {
            if (!args[1]) {
                return message.channel.send(lang["wrong_usage"])
            }
            let method = "DELETE"
            let body = JSON.stringify({
                "password": args[1]
            })
            let response = await PteCore.user(url, method, message, body)
            if (response === "empty") {
                message.channel.send(lang["disabled_2fa"])
            }
            message.delete()
        } else {
            message.channel.send(lang["wrong_usage"])
        }
    }
}