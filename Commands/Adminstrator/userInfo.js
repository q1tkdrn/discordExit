const config = require('../../config.json');
const { sendLog } = require('../../struct/sendLog.js');

const { Discord, Permissions, MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, prefix) => {
  if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
    const outcome = "명령어를 수행할 관리자 권한을 소지하고 있지않습니다."
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }
  if (args.length != 1) {
    const outcome = '잘못된 인자 수'
    message.reply(outcome);
    sendLog(message, outcome);
    return
  }
  const fs = require('fs')
  var userJsonFile = `Data/${message.guild.id}/userData.json`;
  var userData = JSON.parse(fs.readFileSync(userJsonFile, "utf-8"));

  let user =
    message.mentions.users.first() ||
    message.guild.members.cache.get(args[0]);
  if (!user) {
    const outcome = "해당 우저를 찾을 수 없습니다."
    message.channel.send(outcome);
    sendLog(message, outcome);
    return
  }
  const userId = user.id;
  const userName = user.username;

  if (!userData.users[userId]) {
    userData.users[userId] = {
      name: userName,
      lastAttendenceCheckTime: null,
      NumberAttendence: 0,
      ConsequenceAttendence: 0
    }
    fs.writeFileSync(userJsonFile, JSON.stringify(userData, null, '\t'));
  }
  if (userName != userData.users[userId].name) {
    userData.users[userId].name = userName;
    fs.writeFileSync(userJsonFile, JSON.stringify(userData, null, '\t'));
  }
  const embed = new MessageEmbed();
  embed.setTitle(`${user.tag}의 정보`);
  embed.setThumbnail(user.avatarURL());
  if (!user.avatarURL()) embed.setThumbnail(user.defaultAvartarURL);
  embed.addField("아이디", user.id);
  embed.addField("출석횟수", `${userData.users[userId].NumberAttendence}`);
  embed.addField("마지막 출석일", `${userData.users[userId].lastAttendenceCheckTime}`);
  embed.addField("연속 출석횟수", `${userData.users[userId].ConsequenceAttendence}`);

  message.reply({ embeds: [embed] });
  const outcome = JSON.stringify(embed, null, '\t');
  sendLog(message, outcome);
}


exports.config = {
  name: 'userinfo',
  aliases: ['user', '유저', '유저정보'],
  category: ['adminstrator'],
  des: ['check user info'],
  use: [`${config.prefix}userinfo <유저아이디/멘션>`]
}