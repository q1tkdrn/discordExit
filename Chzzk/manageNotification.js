const JsonManager = require('../struct/JsonManager')
const axios = require('axios')
const { MessageEmbed } = require('discord.js');
const { sendLog } = require('../struct/sendLog')

class manageNotification {
    run(client) {
        setInterval(async () => {
            const jsonManager = new JsonManager('./Data/channel.json')
            jsonManager.readJson().then((serverData) => {
                for (const server in serverData) {
                    const streamerJson = new JsonManager(`./Data/${server}.json`)
                    axios.defaults.headers.common['User-Agent'] = "Whale/3.24.223.21"
                    streamerJson.readJson().then((streamerData) => {
                        for (const channelId in streamerData) {
                            axios.get(`https://api.chzzk.naver.com/service/v1/channels/${channelId}`).then((response) => {
                                var channelData = response.data;
                                axios.get(`https://api.chzzk.naver.com/polling/v2/channels/${channelId}/live-status`).then((liveResponse) => {
                                    var liveData = liveResponse.data;
                                    const streamerName = channelData.content.channelName
                                    const isStream = liveData.content.status
                                    const coverImage = channelData.content.channelImageUrl
                                    const liveTitle = liveData.content.liveTitle
                                    const liveCategoryValue = liveData.content.liveCategoryValue
                                    const streamerConfig = streamerData[channelId]
                                    const threadChannelId = streamerConfig.chattingChannel
                                    if (streamerConfig.isStream != isStream ||
                                        streamerConfig.liveTitle != liveTitle) {
                                        const jsonData = {
                                            name: streamerName,
                                            isStream: isStream,
                                            coverImage: coverImage,
                                            liveTitle: liveTitle,
                                            liveCategoryValue: liveCategoryValue,
                                            chattingChannel: threadChannelId
                                        }
                                        streamerJson.updateField(channelId, jsonData).then(() => {
                                            const threadChannel = client.channels.resolve(threadChannelId)
                                            var name = streamerName
                                            var color = "#f40000"
                                            var status = "방송 꺼짐"
                                            var imageUrl = ""
                                            axios.get(`https://api.chzzk.naver.com/service/v1/search/lives?keyword=${encodeURIComponent(liveTitle)}&size=1`).then((searchResponse) => {
                                                switch (isStream) {
                                                    case "OPEN":
                                                        const thumbnailUrl = searchResponse.data.content.data[0].live.liveImageUrl
                                                        imageUrl = thumbnailUrl.replace('{type}', '720')
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
                                                const embed = new MessageEmbed()
                                                    .setTitle(`${name}`)
                                                    .setURL(`https://chzzk.naver.com/live/${channelId}`)
                                                    .setColor(color)
                                                    .setImage(imageUrl)
                                                    .addField(`방송 정보`, status)
                                                threadChannel.send({ embeds: [embed] })
                                            })
                                        })
                                    }
                                })
                            })
                        }
                    })
                }

            })
        }, 30000)
    }
}

module.exports = manageNotification;