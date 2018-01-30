const logger = require("winston");
const authSettings = require("./settings.auth.json");
const Discord = require("discord.js");
const fs = require("fs");
const globalFunctions = require("./globalfunctions.js");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

//create bot handler
const bot = new Discord.Client({
    disableEveryone: true
});

//read in the commands
fs.readdir("./commands", (err, files) => {
    if (err) throw err;

    bot.commandList = new Discord.Collection();

    //only read files that end in .js
    let jsFiles = files.filter(f => f.split('.').pop() === "js" && f !== "commandtemplate.js");

    if (jsFiles.length < 1) {
        logger.info("No commands found.");
        return;
    }

    //add it to the command list
    jsFiles.forEach(file => {
        logger.info(`Loading ${file}`);
        let command = require(`./commands/${file}`);
        //check if command already exists under any of the aliases

        if (command.settings.names.some(v => bot.commandList.keyArray().some(a => a.includes(v))))
            throw new Error("Command defined twice");
        if (command.settings.enabled)
            bot.commandList.set(command.settings.names, command);
    });
});

//connect bot
bot.login(authSettings.authToken);

//when bot is connected
bot.on("ready", async () => {
    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        logger.info(`Invitelink: ${link}`);
    } catch (err) {
        logger.error(err.stack);
    }
});

//when a message is send
bot.on("message", async message => {
    if (message.author.bot) return;
    //disallow direct messages
    if (message.channel.type === "dm") return;

    let messageArray = message.content.split(/\s+/g);
    let command = messageArray[0].toLowerCase();

    //check if the prefix is the right one
    if (!command.startsWith(globalFunctions.getPrefix(message.guild.id))) return;

    //try to find the command
    let commandToExecute = bot.commandList.find(c => c.settings.names.includes(command.slice(1)));
    if (!commandToExecute) {
        message.channel.send("No such command exists.");
        return;
    }

    //execute it
    commandToExecute.run(bot, logger, message);
});