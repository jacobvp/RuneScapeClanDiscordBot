const globalFunctions = require("../globalfunctions.js");
const settings = require('../settings');

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if(!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }

    message.channel.send({
        embed: {
            color: settings.embed.color,
            fields: [
                {
                    name: "Full Username",
                    value: `${message.author.tag}`
                },
                {
                    name: "ID",
                    value: message.author.id
                },
                {
                    name: "Created at",
                    value: message.author.createdAt
                }
            ],
            timestamp: globalFunctions.getUTCMoment()
        }
    });
};

module.exports.settings = {
    names: ["userinfo"],
    description: "Displays your userinfo.",
    args: [],
    example: "userinfo",
    enabled: false
};