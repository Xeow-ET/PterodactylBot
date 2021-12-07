const fetch = require("node-fetch")
const PteConfig = require("../../config/pterodactyl.json")
let IP = PteConfig["IP"]
if (!IP.startsWith("https://") && !IP.startsWith("http://")) {
    IP = "https://" + IP
}
if (IP.endsWith("/")) {
    IP = IP.replace(/.$/, "")
}
const BotConfig = require("../../config/bot.json")
const LangPath = `../../resource/language/${BotConfig["language"]}.json`
const lang = require(LangPath)
module.exports = {
    admin: async function (url, method, message, body) {
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        if (PteConfig.application["type"].toLowerCase() === "key") {
            if (!PteConfig.application["api-key"]) {
                message.channel.send("没有设置API密钥")
                return undefined
            }
            headers["Authorization"] = `Bearer ${PteConfig.application["api-key"]}`
        } else if (PteConfig.application["type"].toLowerCase() === "cookie") {
            if (!PteConfig.application["cookie"]) {
                message.channel.send("没有设置Cookie")
                return undefined
            }
            headers["cookie"] = `pterodactyl_session=${PteConfig.application["cookie"]}`
        } else {
            message.channel.send("不支持")
            return 
        }
        let head = {
            headers: headers,
            method: method
        }
        if (body) {
            head["body"] = body
        }
        let response = await fetch(`${IP}${url}`, head).then(url => url.text()).catch(err => console.error(err))
        if(!response) return "empty"
        try {
            response = JSON.parse(response)
            if(response["errors"]) {
                message.channel.send(`[错误代码 ${response["errors"][0].status}] ${response["errors"][0].code}: ${response["errors"][0].detail}`)
                return undefined
            }
        } catch(e) {
            console.debug("Detected Not A Json Format")
        }
        return response
    },
    user: async function (url, method, message, body) {
        let headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        if (PteConfig.client["type"].toLocaleLowerCase() === "key") {
            if (!PteConfig.client["api-key"]) {
                message.channel.send(lang["core"].no_key)
                return ""
            }
            headers["Authorization"] = `Bearer ${PteConfig.client["api-key"]}`
        } else if(PteConfig.client["type"].toLocaleLowerCase() === "cookie") {
            if (!PteConfig.client["cookie"]){
                message.channel.send(lang["core"].no_cookie)
                return ""
            }
            headers["cookie"] = `pterodactyl_session=${PteConfig.client["cookie"]}`
        } else {
            message.channel.send(lang["core"].not_supported)
            return 
        }
        let head = {
            headers: headers,
            method: method
        }
        if (body) {
            head["body"] = body
        }
        let response = await fetch(`${IP}${url}`, head).then(url => url.text()).catch(err => console.error(err))
        if(!response) return "empty"
        try {
            response = JSON.parse(response)
            if(response["errors"]) {
                message.channel.send(`[${lang["core"].error_code} ${response["errors"][0].status}] ${response["errors"][0].code}: ${response["errors"][0].detail}`)
                return undefined
            }
        } catch(e) {
            console.debug(lang["code"].not_json)
        }
        return response
    }
}
