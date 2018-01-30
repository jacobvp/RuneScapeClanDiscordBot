const globalFunctions = require("../globalfunctions.js");
const fs = require("fs");
const Moment = require("Moment");

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if (!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }
    let args = messageArray.slice(1);
    //Code to execute on command here

    globalFunctions.checkIfUsersInClanAndGetRank(message.guild.id, [args[0], args[1]], (response) => {
        if (response.some(r => !r.result)) {
            message.channel.send(response.find(r => !r.result).message);
            return;
        }

        //save path for the custom guild settings
        let path = `./caps/${message.guild.id}.json`;

        //if file does not exist => create empty json file
        //using xxSync cause I couldn't find one that returns a promise.
        if (!fs.existsSync(path)) {
            try {
                fs.writeFileSync(path, "{\"caps\":[]}");
            } catch (err) {
                throw err;
            }
        }

        //read the capfile. Can guarantee the file exists, because we just created it if it didn't
        let capFile = require(`.${path}`);
        try {
            //Code to execute on command here
            let currWeek = capFile.caps.find(c => c.currentWeek);
            let lastWeek = capFile.caps.find(c => c.lastWeek);
            if (!currWeek) {
                let tickdate = getTickDate(message.guild.id);

                let newWeek = {
                    currentWeek: true,
                    lastWeek: false,
                    total: 1,
                    startOfWeek: tickdate.format("YYYY-MM-DD HH:mm"),
                    endOfWeek: tickdate.add(7, 'day').subtract(1, 'minute').format("YYYY-MM-DD HH:mm"),
                    cappedBy: [{
                        rsn: response.find(r => r.name.toLowerCase() === args[0]).name,
                        rankAtMomentOfCap: response.find(r => r.name.toLowerCase() === args[0]).rank,
                        at: Moment().format("YYYY-MM-DD HH:mm"),
                        loggedBy: response.find(r => r.name.toLowerCase() === args[1]).name
                    }]
                };
                capFile.caps.push(newWeek);
            } else {
                if(Moment(currWeek.endOfWeek) <= Moment()) {
                    currWeek.lastWeek = true;
                    currWeek.currentWeek = false;

                    if(lastWeek) lastWeek.lastWeek = false;

                    let newWeek = {
                        currentWeek: true,
                        lastWeek: false,
                        total: 1,
                        startOfWeek: tickdate.format("YYYY-MM-DD HH:mm"),
                        endOfWeek: tickdate.add(7, 'day').subtract(1, 'minute').format("YYYY-MM-DD HH:mm"),
                        cappedBy: [{
                            rsn: response.find(r => r.name.toLowerCase() === args[0]).name,
                            rankAtMomentOfCap: response.find(r => r.name.toLowerCase() === args[0]).rank,
                            at: Moment().format("YYYY-MM-DD HH:mm"),
                            loggedBy: response.find(r => r.name.toLowerCase() === args[1]).name
                        }]
                    };
                    capFile.caps.push(newWeek);
                } else {
                    currWeek.total += 1;
                    currWeek.cappedBy.push({
                        rsn: response.find(r => r.name.toLowerCase() === args[0]).name,
                        rankAtMomentOfCap: response.find(r => r.name.toLowerCase() === args[0]).rank,
                        at: Moment().format("YYYY-MM-DD HH:mm"),
                        loggedBy: response.find(r => r.name.toLowerCase() === args[1]).name
                    });
                }
            }

            let jsonString = JSON.stringify(capFile, null, 3);
            fs.writeFile(path, jsonString, err => {
                if (err) {
                    message.channel.send(err + `Unable to add cap at the moment.`);
                    return;
                }

                message.channel.send(`cap added`);
            });
        } catch (err) {
            message.channel.send("Unable to add cap at the moment.");
        }
    });

};

module.exports.settings = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["addcap"],
    description: "Logs a cap for the given rsn and also logs who added this cap",
    args: ["[rsn]", "[loggedByRsn]"],
    example: "addcap Zezima Drumgun",
    //command not loaded if set to false
    enabled: true
};

function getTickDate(guildId) {
    let tick = globalFunctions.getCitadelTick(guildId);
    let dayint;
    switch (tick.day.toLowerCase()) {
        case "sunday":
            dayint = 0;
            break;
        case "monday":
            dayint = 1;
            break;
        case "tuesday":
            dayint = 2;
            break;
        case "wednesday":
            dayint = 3;
            break;
        case "thursday":
            dayint = 5;
            break;
        case "friday":
            dayint = 5;
            break;
        case "saturday":
            dayint = 6;
            break;
    }
    let tickdate = Moment().day(dayint).hour(tick.time.split(":")[0]).minute(tick.time.split(":")[1]);
    if (tickdate > Moment()) tickdate = tickdate.subtract(1, "week");
    return tickdate;
}