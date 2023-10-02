const config = require('../../config.json');
const { sendLog } = require('../../struct/sendLog');
const { Permissions } = require('discord.js');

exports.run = async (client, message, args, prefix) => {
  if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    const outcome = "명령어를 수행할 관리자 권한을 소지하고 있지않습니다."
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }
  if (args.length != 2) {
    const outcome = '인자가 3개가 아닙니다'
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }
  let channel =
    client.channels.cache.get(args[0]) ||
    message.guild.channels.cache.get(args[0].substring(2).substring(0, 18));
  if (!channel) {
    const outcome = "해당 유저를 찾을 수 없습니다."
    message.channel.send(outcome);
    sendLog(message, outcome);
    return
  }
  channel.send(args[1])
  const outcome = '성공'
  sendLog(message, outcome);
}


exports.config = {
  name: 'cm',
  aliases: ['channelmessage'],
  category: ['adminstrator'],
  des: ['send cm'],
  use: [`${config.prefix}dm <채널 아이디/멘션> <메세지>`]
}