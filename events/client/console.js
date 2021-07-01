module.exports = (bot, language) => {
    process.stdin.on("data", data => Console(data))
    async function Console(data) {
        let Data = data.toString().trim()
        const cmd = Data.split(' ')[0]
        if (cmd === "stop") {
            console.log(language["bot"].shutdown_1)
            await bot.destroy()
            console.log(language["bot"].shutdown_2)
            process.exit()
        }
    }
}