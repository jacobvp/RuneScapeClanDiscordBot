const globalfunctions = require("../globalfunctions.js");
const settings = require("../settings.json");

module.exports.run = async (bot, logger, message) => {
    //get the list of loaded commands
    let commands = bot.commandList;

    //fields will be filled with the command informations
    let fields = [];
    commands.forEach(c => {

        let mainCommand = c.help.names[0];
        let aliases = c.help.names.slice(1);
        let field = {
            //concat the prefix and maincommand
            name: `${globalfunctions.getPrefix(message.guild.id)}${mainCommand}`,
            //build the rest of the help-description using discord markup. The \t are tabs to help with layout
            value:  `*Aliases:*\t\t\t\t${aliases.join() || "-"}` +
                    `\n*Description*:\t\t${c.help.description}` +
                    `\n*Usage*:\t\t\t\t\`${globalfunctions.getPrefix(message.guild.id)}${mainCommand} ${c.help.args.join(" ")}\``
        };
        //add the command info to the list
        fields.push(field);
    });

    //send an embed with the help info for the loaded commands
    message.channel.send({
        embed: {
            color: settings.embed.color,
            description: "The following commands are available",
            fields: fields,
            timestamp: new Date()
        }
    });
};

module.exports.help = {
    names: ["help", "commands"],
    description: "Lists the commands",
    args: [],
    enabled: true
};