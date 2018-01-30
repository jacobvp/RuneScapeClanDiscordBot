const globalFunctions = require("../globalfunctions.js");
const fs = require("fs");

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if (!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }
    //Code to execute on command here
    let args = messageArray.slice(1);
    let oldRsn = args[0];
    let newRsn = args[1];

    let path = `./caps/${message.guild.id}.json`;
    if (!fs.existsSync(path)) {
        message.channel.send("No data found.");
        return;
    }

    let caps = require(`.${path}`);

    caps.caps.forEach(cap => {

        cap.cappedBy.filter(c => c.rsn.toLowerCase() === oldRsn.toLowerCase()).forEach(by => {
            by.rsn = newRsn;
        });

        cap.cappedBy.filter(c => c.loggedBy.toLowerCase() === oldRsn.toLowerCase()).forEach(by => {
            by.loggedBy = newRsn;
        });
    });

    fs.writeFile(path, JSON.stringify(caps, null, 3), err => {
        if (err) {
            message.channel.send(`Unable to update the rsn at the moment`);
            return;
        }

        message.channel.send(`All occurences of ${oldRsn} are changed to ${newRsn}`);
    });
};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["changersnincaplog"],
    description: "Changes an rsn in the cap log",
    args: ["[old rsn]", "[new rsn]"],
    example: "changeRsnInCapLog Zezima Drumgun",
    //command not loaded if set to false
    enabled: true
};