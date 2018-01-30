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

    let name = args[0];

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
    guildSettings.name = name;
    //write the new settings to the json file (xx, null, 3) makes it indent nicely with 3 spaces
    fs.writeFile(path, JSON.stringify(guildSettings, null, 3), err => {
        if (err) {
            message.channel.send(`Unable to set name at the moment.`);
            return;
        }

        message.channel.send(`Clan name changed.`);
    });
};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["setclanname"],
    description: "Sets the clan name.",
    args: ["[name (separate spaces with a +)]"],
    example: "setClanName Fake+Clan",
    //command not loaded if set to false
    enabled: true
};