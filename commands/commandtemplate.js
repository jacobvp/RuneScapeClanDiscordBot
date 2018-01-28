module.exports.run = async (bot, logger, message) => {
   //Code to execute on command here
};

module.exports.help = {
    //assuming prefix: !
    //names array lets you call this command by using either !name1 or !name2
    names: ["name1", "name2"],
    description: "",
    args: [],
    //command not loaded if set to false
    enabled: false
};