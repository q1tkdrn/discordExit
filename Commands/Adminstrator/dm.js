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
  let duser =
    message.mentions.users.first() ||
    message.guild.members.cache.get(args[0]);
  if (!duser) {
    const outcome = "해당 유저를 찾을 수 없습니다."
    message.channel.send(outcome);
    sendLog(message, outcome);
    return
  }
  duser.send(args[1]);
  const outcome = '성공'
  sendLog(message, outcome);
}


exports.config = {
  name: 'dm',
  aliases: ['directmessage', '디엠'],
  category: ['adminstrator'],
  des: ['send dm'],
  use: [`${config.prefix}dm <유저 아이디/멘션> <메세지>`]
}