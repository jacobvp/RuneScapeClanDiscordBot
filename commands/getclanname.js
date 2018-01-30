const globalFunctions = require('../globalfunctions.js');

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if(!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }

    //Code to execute on command here
    let name = globalFunctions.getClanName(message.guild.id);
    if(!name) {
        message.channel.send("The clan name is not set");
        return;
    }

    message.channel.send(`The clan name is **${name.replace("+", " ")}**`);
};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["getclanname"],
    description: "Gets the clan name.",
    args: [],
    example: "getClanName",
    //command not loaded if set to false
    enabled: true
};