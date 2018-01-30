const globalFunctions = require('../globalfunctions.js');

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if(!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }

    //Code to execute on command here
    let tick = globalFunctions.getCitadelTick(message.guild.id);
    if(!tick) {
        message.channel.send("The citadel tick is not set");
        return;
    }

    message.channel.send(`The citadel ticks on ${tick.day} at ${tick.time}`);
};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["getcitadeltick"],
    description: "Gets when the citadel ticks.",
    args: [],
    example: "getCitadelTick",
    //command not loaded if set to false
    enabled: true
};