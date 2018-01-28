const settings = require('../settings');

module.exports.run = async (bot, logger, message) => {
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
            timestamp: new Date()
        }
    });
};

module.exports.help = {
    names: ["userinfo"],
    description: "Displays your userinfo",
    args: [],
    enabled: false
};