const { logger }= require('./logger.js');

function sendLog(message,outcome) {
    const log = `\n\t${message.guild.name}(${message.guild.id}):` +
        `\n\t\t${message.channel.name}(${message.channelId})` +
        `:\n\t\t\t${message.member.user.username}(${message.member.id}):` +
        `\n\t\t\t\t${message}` +
        `\n\t\t\t\t\toutcome:${outcome}`
    logger(message, log);
}

module.exports = { sendLog };