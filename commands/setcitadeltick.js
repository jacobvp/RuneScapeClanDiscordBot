const Moment = require('moment');
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

    let day = args[0];
    let time = args[1];

    if (!day.toLowerCase().match("^(monday|tuesday|wednesday|thursday|friday|saturday|sunday)$")) {
        message.channel.send("Day has to be the full written day, e.g. wednesday.");
        return;
    }

    let timeMoment = Moment(time, "HH:mm");
    if(!time.match("^([0-9]{2}:[0-9]{2})$") || !timeMoment.isValid()) {
        message.channel.send("Time has to be a valid time in the format `HH:mm`.");
        return;
    }

    //save path for the custom guild settings
    let path = `./guildsettings/${message.guild.id}.json`;

    //if file does not exist => create empty json file
    //using xxSync cause I couldn't find one that returns a promise.
    if (!fs.existsSync(path)) {
        try {
            fs.writeFileSync(path, "{}");
        } catch (err) {
            throw err;
        }
    }

    //read the guildsettings. Can guarantee the file exists, because we just created it if it didn't
    let guildSettings = require(`../guildsettings/${message.guild.id}.json`);
    //set the new prefix
    guildSettings.citadelTick = {day: day, time: timeMoment.format("HH:mm")};
    //write the new settings to the json file (xx, null, 3) makes it indent nicely with 3 spaces
    fs.writeFile(path, JSON.stringify(guildSettings, null, 3), err => {
        if (err) {
            let tick = globalFunctions.getCitadelTick(message.guild.id);
            let formattedTick = "unset"
            if(tick === null)
                formattedTick = tick.day + " at " + tick.time;
            message.channel.send(`Unable to set citadel tick at the moment. Tick remains: ${formattedTick}`);
            return;
        }

        message.channel.send(`Citadel tick changed.`);
    });
};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["setcitadeltick"],
    description: "Sets the citadel tick.",
    args: ["[day]", "[gametime]"],
    example: "setCitadelTick wednesday 23:43",
    //command not loaded if set to false
    enabled: true
};