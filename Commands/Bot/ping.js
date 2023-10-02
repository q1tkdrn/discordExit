const config = require('../../config.json');
const { sendLog } = require('../../struct/sendLog');

exports.run = async (client, message, args, prefix) => {
  if (args[0]) return message.channel.send("불필요한 인자가 있습니다");
  const outcome = `${client.ws.ping}ms`
  message.reply(outcome);
  sendLog(message,outcome);
}


exports.config = {
  name: 'ping',
  aliases: ['핑'],
  category: ['bot'],
  des: ['check ping'],
  use: [`${config.prefix}ping`]
}