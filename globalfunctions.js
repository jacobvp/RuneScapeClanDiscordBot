const settings = require("./settings");
const fs = require("fs");
const request = require("request");
const csv = require("csvtojson");

module.exports.getPrefix = function (guildId) {
    //get default prefix
    let prefix = settings.prefix;
    if (guildId) {
        //try to read custom prefix from file
        if (fs.existsSync(`./guildsettings/${guildId}.json`)) {
            let guildSettings = require(`./guildsettings/${guildId}.json`);
            //if custom prefix
            if (guildSettings.prefix) {
                //overwrite
                prefix = guildSettings.prefix;
            }
        }
    }
    return prefix;
};

module.exports.getClanName = function (guildId) {
    //get default prefix
    let name = null;
    if (guildId) {
        //try to read custom prefix from file
        if (fs.existsSync(`./guildsettings/${guildId}.json`)) {
            let guildSettings = require(`./guildsettings/${guildId}.json`);
            //if custom prefix
            if (guildSettings.name) {
                //overwrite
                name = guildSettings.name;
            }
        }
    }
    return name;
};

module.exports.getCitadelTick = function (guildId) {
    //get default prefix
    let tick = null;
    if (guildId) {
        //try to read custom prefix from file
        if (fs.existsSync(`./guildsettings/${guildId}.json`)) {
            let guildSettings = require(`./guildsettings/${guildId}.json`);
            //if custom prefix
            if (guildSettings.citadelTick) {
                //overwrite
                tick = guildSettings.citadelTick;
            }
        }
    }
    return tick;
};

module.exports.checkArgumentCountAcceptable = function (messageArray, args, guildId) {
    if (messageArray.length - 1 < args.length) {
        return {
            result: false,
            message: `Provide all the parameters, see \`${module.exports.getPrefix(guildId)}help\` for more information.`
        };
    }

    if (messageArray.length - 1 > args.length) {
        return {
            result: false,
            message: `Too many parameters specified, see \`${module.exports.getPrefix(guildId)}help\` for more information.`
        };
    }

    return {result: true, message: ""};
};

module.exports.checkIfUsersInClanAndGetRank = function (guildId, names, responseCallback) {
    let clanname = module.exports.getClanName(guildId);
    let url = `http://services.runescape.com/m=clan-hiscores/members_lite.ws?clanName=${clanname}`;
    let resultArray = [];
    csv().fromStream(request.get(url))
        .transf((jsonObj) => {
            for (let name in jsonObj) {
                if (name.includes(" ")) {
                    var newkey = name.replace(' ', '');
                    jsonObj[newkey] = jsonObj[name];
                    delete jsonObj[name]
                }
            }
        })
        .on('json', (member) => {
            if (names.map(n => n.toLowerCase()).includes(member.Clanmate.toLowerCase())) {
                resultArray.push({
                    result: true,
                    message: `${member.Clanmate} is a member of ${clanname.replace("+", " ")}`,
                    name: member.Clanmate,
                    rank: member.ClanRank
                });
            }
        })
        .on("done", (err) => {
            if (err) {
                resultArray.push({
                    result: false,
                    message: "Unable to check if the user is in the clan at the moment.",
                    name: "",
                    rank: ""
                });
                responseCallback(resultArray);
                return;
            }

            names.forEach(name => {
                if (!resultArray.some(r => r.name.toLowerCase() === name.toLowerCase())) {
                    resultArray.push({
                        result: false,
                        message: `${name} is not a member of ${clanname.replace("+", " ")}`,
                        name: "",
                        rank: ""
                    });
                }
            });

            responseCallback(resultArray);
        });
};