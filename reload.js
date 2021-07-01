delete require.cache[require.resolve(`./index.js`)]
const Discord = require("discord.js");
const DiscordConfig = require("./config/discord.json")
const BotConfig = require("./config/bot.json")
const PteroConfig = require("./config/pterodactyl.json")
const fs = require('fs')
const bot = new Discord.Client({ disableMentions: 'everyone' });
const moment = require('moment-timezone');
moment.locale(BotConfig["language"]);
if (BotConfig.timezone["enabled"] === true) {
    moment.tz(BotConfig["timezone"].tz)
}
if (BotConfig["CorrectPath"] === true) {
    process.chdir(__dirname)
}
let includes = ["log", "info", "warn", "error"]
if (BotConfig["debug"] === true) {
    includes.push('debug')
} else {
    console.debug = function() {}
}
if (!fs.existsSync(`./resource/language/${BotConfig["language"]}.json`)) {
    console.log("无法检测到 %language% 的语言文件, 请添加该语言的语言文件后再重新启动")
        .replace("%language%", BotConfig["language"])
    console.log("Could not find language %language% 's language file, please make sure the language file exists then you start again")
        .replace("%language%", BotConfig["language"])
    process.exit()
}
const LangPath = `./resource/language/${BotConfig["language"]}.json`
let language = require(LangPath)
bot.prefix = DiscordConfig.prefix
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.roles = new Discord.Collection();
bot.categories = fs.readdirSync("./commands/");
require('console-stamp')(console, {
    format: `:mydate().blue :prefix().green :label()`,
    include: includes,
    tokens: {
        mydate: () => {
            return `[${moment().format(`${BotConfig["moment-format"]}`)}]`;
        },
        prefix: () => {
            return `[${language["bot"].prefix}]`
        }
    }
});
console.info("\x1b[36m" + language["start"].notice)
console.info("\x1b[36m" + language["start"].notice2)
require(`./handlers/command`)(bot, language);
bot.on('ready', () => {
    bot.user.setPresence({ activity: { name: DiscordConfig["activity"].first["activity"], type: DiscordConfig["activity"].first["type"] }, status: DiscordConfig["activity"].first["status"] })
    setInterval(async () => {
        let textList = DiscordConfig["activity"].activities
        let x = Math.floor(Math.random() * textList.length)
        bot.user.setPresence({ activity: { name: textList[x].activity, type: textList[x].type }, status: textList[x].status })
    }, 30000)
    require("./events/client/ready")(bot, language)
    require("./events/client/console")(bot, language)
    console.log(language["handle"].loading["done_1"])
})
bot.on('message', async message => {
    require('./events/guild/message')(bot, message, DiscordConfig, PteroConfig, language)
})
bot.login(DiscordConfig["token"])
process.on('unhandledRejection', error => {
    let pre = `\n============================================================\n--- DO NOT REPORT THIS TO HS FOREVER AS A BUG OR A CRASH ---\n============================================================\n`
	console.error(pre , error , pre);
});
