const Discord = require("discord.js");
const prefix = require('./config.json').prefix;
const token = require('./config.json').token;
const fs = require('fs')
const bot = new Discord.Client({disableMentions:'everyone'});
bot.prefix = prefix;
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.snipes = new Discord.Collection();
bot.categories = fs.readdirSync("./commands/");
require(`./handlers/command`)(bot);
bot.on('ready',()=>{ 
    require('./events/client/ready')(bot)
    bot.user.setActivity("!help");
})
bot.on('message',async message=>{
    message.member //-- GuildMember based
    message.author //-- User based
    require('./events/guild/message')(bot,message)
})
bot.login(token)
