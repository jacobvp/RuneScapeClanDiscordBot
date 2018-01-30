const globalFunctions = require("../globalfunctions.js");
const settings = require('../settings.json');

module.exports.run = async (bot, logger, message) => {
    let messageArray = message.content.split(/\s+/g);
    let argCheck = globalFunctions.checkArgumentCountAcceptable(messageArray, this.settings.args, message.guild.id);
    if(!argCheck.result) {
        message.channel.send(argCheck.message);
        return;
    }

    //skip the first one, this is the command
    let args = messageArray.slice(1);

    let pollSubject = args[0];
    let timeToRunPoll = parseInt(args[1]);

    if (!Number.isInteger(timeToRunPoll) || timeToRunPoll <= 0) {
        message.channel.send("`[Time to run poll]` has to be a number greater than zero.");
        return;
    }

    //send a message mentioning the author and describing the poll
    let msg = await message.channel.send(`<@${message.author.id}> initiated a poll for the following ${timeToRunPoll} seconds regarding:` +
        `\n"**${pollSubject}**"` +
        `\n\nReact with ${settings.poll.yes} for YES or ${settings.poll.no} for NO. (other reactions will be ignored)`);

    //add YES/NO reactions to enable easier voting
    msg.react(settings.poll.yes);
    msg.react(settings.poll.no);

    //gather all reactions added to the message within TimeToRunPoll seconds
    let responses = await msg.awaitReactions(r => r.emoji.name === settings.poll.yes || r.emoji.name === settings.poll.no, {time: timeToRunPoll * 1000});

    //get the amount of yes/no votes (-1 because of the automated bot vote)
    let yesCount = responses.get(settings.poll.yes).count - 1;
    let noCount = responses.get(settings.poll.no).count - 1;

    //if no votes
    if (yesCount === 0 && noCount === 0) {
        message.channel.send({
            embed: {
                color: settings.embed.color,
                title: `The poll regarding "${pollSubject}" has yielded no result.`,
                description: `Nobody voted on the poll` +
                `\n\n __Voting has been closed__`,
                timestamp: new Date()
            }
        });
        return;
    }

    //if votes
    message.channel.send({
        embed: {
            color: settings.embed.color,
            //passed if yes > no, drawed if yes == no, failed if yes < no
            title: `The poll regarding "${pollSubject}" has ${(yesCount > noCount) ? "PASSED" : (yesCount == noCount) ? "DRAWED" : "FAILED"}.`,
            description: `The poll has ${(yesCount > noCount) ? "PASSED" : (yesCount == noCount) ? "DRAWED" : "FAILED"} with a pass-rate of ${(yesCount / (yesCount + noCount)) * 100}%` +
            `\n\n __Voting has been closed__`,
            timestamp: new Date()
        }
    });
};

module.exports.settings = {
    names: ["poll"],
    description: "Starts a simple yes/no poll, where voting is done by reactions on the message.",
    args: ["[poll-subject]", "[Time to run poll (in seconds)]"],
    example: "poll Should we do x? 60",
    enabled: true
};