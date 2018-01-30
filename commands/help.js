const globalFunctions = require("../globalfunctions.js");
const settings = require("../settings.json");

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if(!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }

    //get the list of loaded commands
    let commands = bot.commandList;

    //fields will be filled with the command informations
    let fields = [];
    commands.forEach(c => {

        let mainCommand = c.settings.names[0];
        let aliasArray = c.settings.names.slice(1);

        let name = `${globalFunctions.getPrefix(message.guild.id)}${mainCommand}`;
        let aliases = aliasArray.join() || "-";
        let description = c.settings.description;
        let example = `\`${globalFunctions.getPrefix(message.guild.id)}${c.settings.example}\``;
        let joinedArguments = c.settings.args.join(" ");
        if(joinedArguments) joinedArguments = "`" + joinedArguments + "`";

        let field = {
            //concat the prefix and maincommand
            name: name,
            //build the rest of the help-description using discord markup. The \t are tabs to help with layout
            value: `*__Aliases__*:\t\t\t\t${aliases}` +
            `\n*__Description__:*\t\t${description}` +
            `\n\n*__Arguments__:*\t\t${joinedArguments || "-"}` +
            `\n*__Example__*:\t\t\t ${example}` +
            `\n\u2063`
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

module.exports.settings = {
    names: ["help", "commands"],
    description: "Lists the commands.",
    args: [],
    example: "help",
    enabled: true
};