const config = require('../../config.json');
const { sendLog } = require('../../struct/sendLog.js');

exports.run = async (client, message, args, prefix) => {
    const fs = require('fs')
    const guild = message.guild.id;
    const dir = `./Data/${guild}`
    if(!fs.existsSync(dir)) fs.mkdirSync(dir);
    var userJsonFile = `${dir}/userJsonFile.json`;
    var defaultJson = {users: {}}
    if(!fs.existsSync(userJsonFile)) fs.writeFileSync(userJsonFile, JSON.stringify(defaultJson, null, '\t'));
    var userData = JSON.parse(fs.readFileSync(userJsonFile, "utf-8"));

    const userId = message.member.user.id;
    const userName = message.member.user.username;
    const date = new Date();

    if (!userData.users[userId]) {
        userData.users[userId] = {
            name: userName,
            lastAttendenceCheckTime: null,
            NumberAttendence: 0,
            ConsequenceAttendence: 0
        }
        fs.writeFileSync(userJsonFile, JSON.stringify(userData, null, '\t'));
    }
    const lastDate = userData.users[userId].lastAttendenceCheckTime;
    const nowDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    if (lastDate == nowDate) {
        const outcome = `이미 출석체크를 하셨습니다.`
        message.reply(outcome)
        sendLog(message, outcome);
        return;
    }

    userData.users[userId].lastAttendenceCheckTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    userData.users[userId].NumberAttendence += 1;
    const yesterday = new Date(date.setDate(date.getDate() - 1));
    if (lastDate == `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`) {
        userData.users[userId].ConsequenceAttendence += 1;
    } else {
        userData.users[userId].ConsequenceAttendence = 1
    }
    fs.writeFileSync(userJsonFile, JSON.stringify(userData, null, '\t'));

    const outcome = `출석 완료`;
    message.reply(outcome);
    sendLog(message, outcome);
}


exports.config = {
    name: '출석체크',
    aliases: ['출첵', 'ㅊㅊ', 'cc', 'cnfcpr', 'cnftjrcpzm'],
    category: ['bot'],
    des: ['출석체크'],
    use: [`${config.prefix}출첵`]
}