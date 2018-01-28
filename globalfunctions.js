const settings = require("./settings");
const fs = require("fs");

module.exports.getPrefix = function(guildId) {
    //get default prefix
    let prefix = settings.prefix;
    if(guildId) {
        //try to read custom prefix from file
        if(fs.existsSync(`./guildsettings/${guildId}.json`)) {
            let guildSettings = require(`./guildsettings/${guildId}.json`);
            //if custom prefix
            if(guildSettings.prefix)
                //overwrite
                prefix = guildSettings.prefix
        }
    }
    return prefix;
};