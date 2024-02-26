const { MessageActionRow } = require('discord.js');
const config = require('../../config.json')
const { sendLog } = require('../../struct/sendLog.js');
const Database = require('@replit/database')
const db = new Database()

exports.run = async (client, message, args, prefix) => {
  if (args[0]) {
    let streamerList = []
    try {
      streamerList = await db.get("streamerList")
      if (streamerList == null) {
        streamerList = ['']
        await db.set('streamerList', streamerList)
        switch (args[0]) {
          case "add":
          case "추가":
            streamerList.push(args[1])
            console.log(streamerList)
            await db.set('streamerList', streamerList)
            break
          case "remove":
          case "삭제":
            const delStreamer = args[1]
            if (delStreamer) {
              streamerList = streamerList.filter(item => item !== delStreamer)
              await db.set('streamerList', streamerList)
            } else message.reply("해당 streamer는 리스트에 존재하지 않습니다.")
            break
          case "list":
          case "목록":
            message.channel.send(streamerList)
            break
          default:
            break
        }
      }
    } catch(err){
      console.log(err)
    }
  } else await db.set('streamerList', [1,2])
  const outcome = ''
  sendLog(message, outcome);
}


exports.config = {
  name: 'streamer',
  aliases: ['스트리머', 'st'],
  category: ['stream'],
  des: ['streamer <추가/삭제/목록/add/remove/list/채널설정>'],
  use: [`${config.prefix}`]
}