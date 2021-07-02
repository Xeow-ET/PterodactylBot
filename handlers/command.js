const { readdirSync } = require("fs");
module.exports = (bot, language) => {
    readdirSync("./commands/").map(dir => {
        readdirSync(`./commands/${dir}/`).map(cmd => {
            let pull = require(`../commands/${dir}/${cmd}`)
            let Aliases = []; let other = ""
            if (pull.enabled === true) {
                bot.commands.set(pull.name, pull)
                if (pull.aliases && pull.aliases.length > 0) {
                    pull.aliases.forEach(p => {
                        Aliases.push(p)
                        bot.aliases.set(p, pull)
                    })
                    other = `, ${language.handle["loading"].aliases_is} ` + Aliases.join(", ")
                }
                console.log(language.handle["loading"].loaded.replace("%command%", `${pull.name}${other}`))
            }
        })
    })
}