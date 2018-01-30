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
    let rsn = messageArray.slice(1)[0];

    let path = `./caps/${message.guild.id}.json`;
    if (!fs.existsSync(path)) {
        message.channel.send("No data found.");
        return;
    }

    let caps = require(`.${path}`);

    try {
        //reduce object to array of caps, only displaying the rsn's
        let rsnsPerCap = caps.caps.map(c => c.cappedBy.map(ca => ca.rsn.toLowerCase()));
        //flatten multiple arrays to one array
        let flattened = rsnsPerCap.reduce((flat, next) => flat.concat(next), []);
        //filter on the wanted rsn
        let filtered = flattened.filter(c => c === rsn.toLowerCase());

        if(filtered.length === 0) throw new Error();
        message.channel.send(`${rsn} has capped ${filtered.length} times!`);
    } catch(err) {
        message.channel.send("No data found.");
    }
};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["getcapcountformember"],
    description: "Gets the amount of caps for this member",
    args: ["[rsn]"],
    example: "getCapCountForMember Zezima",
    //command not loaded if set to false
    enabled: true
};