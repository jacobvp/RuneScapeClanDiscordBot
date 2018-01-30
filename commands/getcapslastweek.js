const globalFunctions = require("../globalfunctions.js");
const settings = require("../settings.json");
const Moment = require("moment");
const fs = require("fs");

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if(!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }

    let path = `./caps/${message.guild.id}.json`;
    if (!fs.existsSync(path)) {
        message.channel.send("No data found.");
        return;
    }

    let caps = require(`.${path}`);

    try {
        //Code to execute on command here
        let lastWeek = caps.caps.find(c => c.lastWeek);
        if(!lastWeek) throw new Error();

        message.channel.send({
            embed: {
                color: settings.embed.color,
                title: `The following people capped last week (${lastWeek.startOfWeek} to ${lastWeek.endOfWeek}):`,
                description: `The total amounts of caps was ${lastWeek.total}!\n\n- ${lastWeek.cappedBy.map(c => `__${c.rsn}__ (${Moment(c.at).format("ddd HH:mm")}, logged by: *${c.loggedBy}*)`).join("\n- ")}`,
                timestamp: new Date()
            }
        });
    } catch(err) {
        message.channel.send("No data found.");
    }
};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["getcapslastweek"],
    description: "Gets the caps of last week",
    args: [],
    example: "getCapsLastWeek",
    //command not loaded if set to false
    enabled: true
};