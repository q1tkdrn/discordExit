const JsonManager = require('../struct/JsonManager')
const axios = require('axios')
const { MessageEmbed } = require('discord.js');
const { sendLog } = require('../struct/sendLog');
const { error } = require('winston');
const fs = require('fs')
const https = require('https');
const Discord = require(`discord.js`)

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
                                    let case1
                                    let doUpdate
                                    if(streamerConfig.isStream != isStream) {
                                        case1 = 0
                                        doUpdate = true
                                    } else if(streamerConfig.liveTitle != liveTitle) {
                                        case1 = 1
                                        doUpdate = true
                                    } else doUpdate = false
                                    if (doUpdate) {
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
                                            axios.get(`https://api.chzzk.naver.com/service/v1/channels/${channelId}/data?fields=banners,topExposedVideos`).then(async (searchResponse) => {
                                                switch (isStream) {
                                                    case "OPEN":
                                                        if(case1 == 1) {
                                                            const thumbnailUrl = searchResponse.data.content.topExposedVideos.openLive.liveImageUrl
                                                            const fileName = `${Date.now()}.jpg`

                                                            await this.downloadImage(thumbnailUrl.replace('{type}', '720'), fileName)
                                                            imageUrl = `${fileName}`
                                                            name = `${streamerName} 방제 변경(${liveTitle})`
                                                        } else {
                                                            imageUrl = coverImage
                                                            name = `${streamerName} 방송 켜짐(${liveTitle})`
                                                        }
                                                        color = "#3bca97"
                                                        status = `방제: ${liveTitle}\n카테고리: ${liveCategoryValue}`
                                                        break
                                                    case "CLOSE":
                                                        if(case1 == 1) {
                                                            name = `${streamerName} 방제 변경(${liveTitle})`
                                                        } else {
                                                            name = `${streamerName} 방송 꺼짐(${liveTitle})`
                                                        }
                                                        color = "#f40000"
                                                        name = `${streamerName} 방송 꺼짐(${liveTitle})`
                                                        status = `방제: ${liveTitle}\n카테고리: ${liveCategoryValue}`
                                                        imageUrl = coverImage
                                                        break
                                                    default:
                                                        break
                                                }
                                                if (isStream == "OPEN" && case1 == 1) {
                                                    const embed = new MessageEmbed()
                                                    .setTitle(`${name}`)
                                                    .setURL(`https://chzzk.naver.com/live/${channelId}`)
                                                    .setColor(color)
                                                    .setImage(`attachment://${imageUrl}`)
                                                    .addField(`방송 정보`, status)
                                                threadChannel.send({ embeds: [embed], files: [`./${imageUrl}`] }).then(() => {
                                                    fs.unlink(`./${imageUrl}`, (err) => {
                                                        if (err) {
                                                            console.error('파일 삭제 실패:', err);
                                                            return;
                                                        }
                                                    })
                                                })
                                                } else {
                                                    const embed = new MessageEmbed()
                                                        .setTitle(`${name}`)
                                                        .setURL(`https://chzzk.naver.com/live/${channelId}`)
                                                        .setColor(color)
                                                        .setImage(imageUrl)
                                                        .addField(`방송 정보`, status)
                                                    threadChannel.send({ embeds: [embed] })
                                                }
                                            })
                                                .catch((error) => {
                                                    throw error;
                                                })
                                        })
                                            .catch((error) => {
                                                throw error;
                                            })
                                    }
                                })
                            })
                                .catch((error) => {
                                    throw error;
                                })
                        }
                    })
                        .catch((error) => {
                            throw error;
                        })
                }

            })
                .catch((error) => {
                    throw error;
                })
        }, 30000)
    }

    async downloadImage(url, filePath) {
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        // 스트림을 파일로 저장
        response.data.pipe(fs.createWriteStream(filePath));

        return new Promise((resolve, reject) => {
            response.data.on('end', () => {
                resolve();
            });
    
            response.data.on('error', (err) => {
                reject(err);
            });
        });
    }
}

module.exports = manageNotification;
