const config = require('../../config.json');
const { sendLog } = require('../../struct/sendLog');

exports.run = async (client, message, args, prefix) => {
  if (args[0]) return message.channel.send("불필요한 인자가 있습니다");
  const currentTime = new Date().toLocaleTimeString();
  const sentMessage = await message.channel.send(`현재 시간은 ${currentTime} 입니다.`);
  setInterval(async () => {
    const updatedTime = new Date().toLocaleTimeString();
    await sentMessage.edit(`현재 시간은 ${updatedTime} 입니다.`);
  }, 1000);
//   const outcome = `${client.ws.ping}ms`
//   message.reply(outcome);
//   sendLog(message,outcome);
}


exports.config = {
  name: 'time',
  aliases: ['시간'],
  category: ['bot'],
  des: ['check time'],
  use: [`${config.prefix}time`]
}