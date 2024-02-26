const { logger }= require('./logger.js');

function sendLog(message,outcome) {
    const log = `\n\t${message.channel.name}(${message.channelId})` +
        `:\n${message.member.user.username}(${message.member.id}):` +
        `\n${message}` +
        `\noutcome:${outcome}`
    logger(message, log);
}

module.exports = { sendLog };