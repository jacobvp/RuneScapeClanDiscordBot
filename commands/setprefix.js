const fs = require('fs');
const globalFunctions = require('../globalfunctions.js');

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if(!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }

    //skip the first one, this is the command
    let args = messageArray.slice(1);

    let newPrefix = args[0];
    let currentPrefix = globalFunctions.getPrefix(message.guild.id);

    if(newPrefix === currentPrefix) {
        message.channel.send(`Prefix already was ${currentPrefix}`);
        return;
    }

    //save path for the custom guild settings
    let path = `./guildsettings/${message.guild.id}.json`;

    //if file does not exist => create empty json file
    //using xxSync cause I couldn't find one that returns a promise.
    if(!fs.existsSync(path)) {
        try{
            fs.writeFileSync(path, "{}");
        }catch (err){
            throw err;
        }
    }

    //read the guildsettings. Can guarantee the file exists, because we just created it if it didn't
    let guildSettings = require(`.${path}`);
    //set the new prefix
    guildSettings.prefix = newPrefix;
    //write the new settings to the json file (xx, null, 3) makes it indent nicely with 3 spaces
    fs.writeFile(path, JSON.stringify(guildSettings, null, 3), err => {
        if(err) {
            message.channel.send(`Unable to change prefix at the moment, the prefix remains ${currentPrefix}`);
            return;
        }

        message.channel.send(`Prefix changed to ${newPrefix}`);
    });
};

module.exports.settings = {
    names: ["setprefix"],
    description: "Changes the prefix of this bot for the current server.",
    args: ["[prefix]"],
    example: "setPrefix %",
    enabled: true
};