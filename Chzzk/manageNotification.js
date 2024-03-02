const JsonManager = require('../struct/JsonManager')
const axios = require('axios')
const { MessageEmbed } = require('discord.js');

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
                                    if (streamerConfig.name != streamerName ||
                                        streamerConfig.isStream != isStream ||
                                        streamerConfig.liveTitle != liveTitle ||
                                        streamerConfig.liveCategoryValue != liveCategoryValue) {
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
                                            console.log(threadChannel)
                                            console.log(threadChannelId)
                                            var name = streamerName
                                            var color = "#f40000"
                                            var status = "방송 꺼짐"
                                            switch (isStream) {
                                                case "OPEN":
                                                    color = "#3bca97"
                                                    name = `${streamerName} 방송 켜짐(${liveTitle})`
                                                    status = `방제: ${liveTitle}\n카테고리: ${liveCategoryValue}`
                                                    break
                                                case "CLOSE":
                                                    color = "#f40000"
                                                    name = `${streamerName} 방송 꺼짐(${liveTitle})`
                                                    status = `방제: ${liveTitle}\n카테고리: ${liveCategoryValue}`
                                                    break
                                                default:
                                                    break
                                            }
                                            const embed = new MessageEmbed()
                                                .setTitle(`${name}`)
                                                .setURL(`https://chzzk.naver.com/live/${channelId}`)
                                                .setColor(color)
                                                .setImage(coverImage)
                                                .addField(`방송 정보`, status)
                                            threadChannel.send({ embeds: [embed] })
                                        })
                                    }
                                })
                            })
                        }
                    })
                }

            })
        }, 5000)
    }
}

module.exports = manageNotification;