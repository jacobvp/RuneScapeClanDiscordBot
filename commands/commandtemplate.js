const globalFunctions = require("../globalfunctions.js");

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if(!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }
    //Code to execute on command here
};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["name1", "name2"],
    description: "",
    args: [],
    example: "",
    //command not loaded if set to false
    enabled: false
};