const settings = require("../../config/advance-config.json").command["reload"]
const fs = require("fs")
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
        lang = language["reload"]
        await message.channel.send(lang["warning"])
        await message.channel.send(lang["reloading"])
        bot.commands.sweep(() => true)
        await bot.destroy()
        fs.readdirSync("./").map(dir => {
            if (dir.startsWith(".") || dir === "node_modules") return
            if (fs.lstatSync(`./${dir}`).isDirectory()) {
                fs.readdirSync(`./${dir}/`).map(dir2 => {
                    if (fs.lstatSync(`./${dir}/${dir2}`).isDirectory()) {
                        fs.readdirSync(`./${dir}/${dir2}`).map(dir3 => {
                            if (fs.lstatSync(`./${dir}/${dir2}/${dir3}`).isDirectory()) {
                                fs.readdirSync(`./${dir}/${dir2}/${dir3}`).map(dir4 => {
                                    if (fs.lstatSync(`./${dir}/${dir2}/${dir3}/${dir4}`).isDirectory()) {
                                        console.warn("检测到文件夹位置过大:", `./${dir}/${dir2}/${dir3}/${dir4}`)
                                    } else {
                                        delete require.cache[require.resolve(`../../${dir}/${dir2}/${dir3}/${dir4}`)]
                                        console.info(`已将 ${dir4} 文件从系统内存中卸载`)
                                    }
                                })
                            } else {
                                delete require.cache[require.resolve(`../../${dir}/${dir2}/${dir3}`)]
                                console.info(`已将 ${dir3} 文件从系统内存中卸载`)
                            }
                        })
                    } else {
                        delete require.cache[require.resolve(`../../${dir}/${dir2}`)]
                        console.info(`已将 ${dir2} 文件从系统内存中卸载`)
                    }
                })
            } else {
                delete require.cache[require.resolve(`../../${dir}`)]
                console.info(`已将 ${dir} 文件从系统内存中卸载`)
            }
            let Packages = require("../../package.json").dependencies
            Packages = Object.keys(Packages)
            Packages.forEach(function (depens) {
                delete require.cache[require.resolve(depens)]
                console.info(`已将 ${depens} 依赖库从系统内存中卸载`)
            });
        })
        console.info("所有文件已从系统内存中卸载, 加载中...")
        let config = require("../../config/discord.json")
        config["reload_channel"] = message.channel.id
        fs.writeFile ("./config/discord.json", JSON.stringify(config, null, 4), function(err) {
            if (err) console.log(err);
            }
        );
        require("../../reload")
    }
}