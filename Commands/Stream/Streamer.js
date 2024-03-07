const { MessageActionRow } = require('discord.js')
const config = require('../../config.json')
const { sendLog } = require('../../struct/sendLog.js')
const JsonManager = require('../../struct/JsonManager.js')
const axios = require('axios')
const { error } = require('winston')
const { MessageEmbed } = require('discord.js');


exports.run = async (client, message, args, prefix) => {
  if (args[0]) {
    const guildId = message.guild.id
    const jsonManager = new JsonManager(`./Data/${guildId}.json`);
    jsonManager.fileExists().then((isFileExist) => {
      if (!isFileExist) {
        jsonManager.initializeFile({});
        message.reply('1')
      }
      var streamerIDList = []
      var streamerNameList = []
      jsonManager.readJson().then((jsonResult) => {
        if (jsonResult != null && jsonResult != {}) {
          streamerIDList = Object.keys(jsonResult)
          streamerNameList = Object.values(jsonResult).map(item => item.name)
        }
        try {
          if (streamerIDList != null) {
            const channelManager = new JsonManager(`./Data/channel.json`);
            channelManager.readJson().then((channelResult) => {
              if (!channelResult.hasOwnProperty(message.guild.id)) {
                message.reply("'!streamer 채널설정'으로 먼저 포럼 채널을 설정해주세요")
              }
              switch (args[0]) {
                case "add":
                case "추가":
                  const channelId = args[1]
                  axios.defaults.headers.common['User-Agent'] = "Whale/3.24.223.21"
                  const apiUrl = `https://api.chzzk.naver.com/service/v1/channels/${channelId}`
                  var channelData = {}
                  axios.get(apiUrl).then((response) => {
                    channelData = response.data;
                    if (channelData.content.channelId == null || channelData.content.channelType != "STREAMING") {
                      message.reply('존재하지 않는 스트리머입니다.')
                      return
                    }
                    if (streamerIDList.includes(channelId)) {
                      message.reply("이미 있는 스트리머 입니다.")
                      return
                    }
                    axios.get(`https://api.chzzk.naver.com/polling/v2/channels/${channelId}/live-status`).then((liveResponse) => {
                      var liveData = liveResponse.data;
                      const forumChannelId = channelResult[message.guild.id]
                      const forumChannel = message.guild.channels.resolve(forumChannelId)
                      const streamerName = channelData.content.channelName
                      const isStream = liveData.content.status
                      const coverImage = channelData.content.channelImageUrl
                      const liveTitle = liveData.content.liveTitle
                      const liveCategoryValue = liveData.content.liveCategoryValue
                      var threadChannelId = ''
                      forumChannel.threads
                        .create({
                          name: streamerName
                        })
                        .then(threadChannel => {
                          var name = streamerName
                          var color = "#f40000"
                          var status = "방송 꺼짐"
                          var imageUrl = ""
                          axios.get(`https://api.chzzk.naver.com/service/v1/channels/${channelId}/data?fields=banners,topExposedVideos`).then((searchResponse) => {
                            switch (isStream) {
                              case "OPEN":
                                const thumbnailUrl = searchResponse.data.content.topExposedVideos.openLive.liveImageUrl
                                const currentTime = `?date=${Date.now()}`
                                imageUrl = thumbnailUrl.replace('{type}', '720') + currentTime
                                color = "#3bca97"
                                name = `${streamerName} 방송 켜짐(${liveTitle})`
                                status = `방제: ${liveTitle}\n카테고리: ${liveCategoryValue}`
                                break
                              case "CLOSE":
                                color = "#f40000"
                                name = `${streamerName} 방송 꺼짐(${liveTitle})`
                                status = `방제: ${liveTitle}\n카테고리: ${liveCategoryValue}`
                                imageUrl = coverImage
                                break
                              default:
                                break
                            }
                            threadChannelId = threadChannel.id
                            const embed = new MessageEmbed()
                              .setTitle(`${name}`)
                              .setColor(color)
                              .setImage(imageUrl)
                              .addField(`방송 정보`, status)
                            threadChannel.send(`<@${message.member.id}>`)
                              .then((sentMessage) => {
                                setTimeout(() => {
                                  sentMessage.delete();
                                }, 1000)
                              })
                            threadChannel.send({
                              embeds: [embed],
                              userName: streamerName,
                              avatarUrl: coverImage
                            })
                            const jsonData = {
                              name: streamerName,
                              isStream: isStream,
                              coverImage: coverImage,
                              liveTitle: liveTitle,
                              liveCategoryValue: liveCategoryValue,
                              chattingChannel: threadChannelId
                            }
                            jsonManager.updateField(args[1], jsonData)
                            message.reply(`스트리머 ${streamerName}을 등록했습니다`)
                          })
                        })
                        .catch(console.error)
                    })
                  })
                  break
                case "remove":
                case "삭제":
                  const delStreamer = args[1]
                  if (streamerIDList.includes(delStreamer)) {
                    message.guild.channels.resolve(jsonResult[delStreamer].chattingChannel).delete(`<@${message.member.id}>`)
                    jsonManager.removeField(delStreamer)
                  } else if (streamerNameList.includes(delStreamer)) {
                    streamerNameList.shift(delStreamer)
                    for (const key in jsonResult) {
                      if (jsonResult[key].name == delStreamer) {
                        message.guild.channels.resolve(jsonResult[key].chattingChannel).delete(`<@${message.member.id}>`)
                        jsonManager.removeField(key)
                        break
                      }
                    }
                  } else message.reply("해당 streamer는 리스트에 존재하지 않습니다.")
                  break
                case "list":
                case "목록":
                  if (streamerNameList == null || streamerNameList[0] == null) {
                    message.reply("등록된 스트리머가 없습니다")
                    break
                  }
                  message.channel.send(`현제 등록된 스트리머:${streamerNameList.join(', ')}`)
                  break
                case "채널설정":
                case "cs":
                  const serverId = message.guild.id
                  channelManager.fileExists().then((isChannelExist) => {
                    if (!isChannelExist) {
                      const jsonData = {}
                      channelManager.initializeFile(jsonData);
                    }
                    const argString = args[1]
                    let notiChannel =
                      message.guild.channels.resolve(argString.match(/\d+/g)[0]) ||
                      message.guild.channels.cache.get(argString.match(/\d+/g)[0])
                    // message.guild.channels.resolve(args[1].substring(2).substring(0, 18));
                    if (notiChannel) {
                      channelManager.updateField(serverId, args[1].match(/\d+/g)[0]).then(() => {
                        message.reply(`<#${notiChannel.id}>을 알림 채널로 설정했습니다.`)
                      })
                    } else message.reply("해당채널을 찾을 수 없습니다")
                  })
                  break
                default:
                  break
              }
            })
          }
        } catch (error) {
          console.log(error)
        }
      })
    })
  }
  const outcome = ''
  sendLog(message, outcome);
}


exports.config = {
  name: 'streamer',
  aliases: ['스트리머', 'st'],
  category: ['stream'],
  des: ['방송알림 받을 스트리머 관리'],
  use: [`${config.prefix}streamer <추가/삭제/목록/채널설정/add/remove/list/cs>`]
}