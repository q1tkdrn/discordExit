const config = require('../../config.json');
const { logger } = require('../../struct/logger.js');
const { sendLog } = require('../../struct/sendLog');
const { Permissions } = require('discord.js');

exports.run = async (client, message, args, prefix) => {
  if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    const outcome = "명령어를 수행할 관리자 권한을 소지하고 있지않습니다."
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }
  if (!args[0]) {
    const outcome = '지울 값을 자연수로 적어주세요.'
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }
  if (!Number(args[0])) {
    const outcome = '지울 값을 자연수로 적어주세요.'
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }
  if (args[0] < 1) {
    const outcome = '1 이상의 수를 입력 하세요.'
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }

  if (args[0] > 99) {
    const outcome = '한번에 지울 수 있는 값dms 99 이하입니다.'
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }

  var num = (parseInt(args[0]) + 1 * 1);

  message.channel.bulkDelete(num)
    .catch(console.error);
  message.channel.send(`${args[0]}만큼의 메시지를 성공적으로 삭제했습니다.`)
    .then(msg => {
      setTimeout(() => msg.delete(), 3000)
    })
    .catch(console.error);
  const outcome = `${args[0]}만큼의 메세지를 성공적으로 삭제하였습니다.`
  sendLog(message, outcome);
}


exports.config = {
  name: 'clear',
  aliases: ['clean', 'purge'],
  category: ['adminstrator'],
  des: ['delete message'],
  use: [`${config.prefix}clear/clean/purge <자연수>`]
}