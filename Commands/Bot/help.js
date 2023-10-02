const config = require('../../config.json');
const { sendLog } = require('../../struct/sendLog.js');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, prefix) => {
    if (args[0]) {
        if (!client.commands.get(args[0]) && !client.aliases.get(args[0])) {
            return message.reply(`${args[0]}에 대한 정보를 찾을 수 없습니다.`);
        }

        const command = client.commands.get(args[0])
            ? client.commands.get(args[0])
            : client.commands.get(client.aliases.get(args[0]));
        const config = command.config;
        const name = config.name;
        const aliases = config.aliases;
        const category = config.category;
        const description = config.des;
        const use = config.use;

        const Command = new MessageEmbed()
            .setTitle(`${name} 명령어`)
            .setColor('#0ea085')
            .setDescription(`\`\`\`fix\n사용법: ${use}\`\`\``)
            .addField('명령어 설명', `**${description}**`, false)
            .addField('카테고리', `**${category}**`, true)
            .addField('명령어의 별명', `**${aliases}**`, true);

        message.member.send({ embeds: [Command] });
        return;
    }

    const categorys = client.category;

    const Commands = new MessageEmbed()
        .setAuthor(client.user.username + '봇 명령어', client.user.displayAvatarURL())
        .setColor('#0ea085')
        .setFooter(`${prefix}help <명령어>를 입력하여 해당 명령어를 자세히 확인해보세요.`);

    for (const category of categorys) {
        arr1 = Array.from(client.commands.filter(el => el.config.category[0] === category))
        const fd = []
        for (const arr of arr1) {
            fd.push(arr[0])
        }
        Commands.addField(
            category,
            `> **\`${fd.join('`, `')}\`**`
        );
    }

    message.member.send({ embeds: [Commands] });

    const outcome = JSON.stringify(Commands, null, '\t');
    sendLog(message,outcome);
};


exports.config = {
    name: 'help',
    aliases: ['?', '명령어', '도움말'],
    category: ['bot'],
    des: ['봇에 대한 명령어 리스트들을 불러와드립니다.'],
    use: [`${config.prefix}help <명령어>`]
};