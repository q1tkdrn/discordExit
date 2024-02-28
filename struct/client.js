const Discord = require('discord.js');
const { Client, Intents } = require('discord.js');
const manageNotification = require('../Chzzk/manageNotification.js')

const chzzk = new manageNotification()
const config = require('../config.json');
const env = require('dotenv');
env.config();
const token = process.env['TOKEN'];
console.log(token);
const prefix = config.prefix;
const fs = require('fs');
const keepAlive = require('../server.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.category = ['bot', 'stream','adminstrator'];

fs.readdirSync('./Commands/').forEach(dir => {
  const Filter = fs.readdirSync(`./Commands/${dir}`).filter(f => f.endsWith('.js'));

  console.log(Filter);

  Filter.forEach(file => {
    const cmd = require(`../Commands/${dir}/${file}`);

    client.commands.set(cmd.config.name, cmd);

    for (let alias of cmd.config.aliases) {
      client.aliases.set(alias, cmd.config.name);
    }
  });
});

chzzk.run(client)

function runCommand(command, message, args, prefix) {
  const cmd = client.commands.get(command)
    ? client.commands.get(command)
    : client.commands.get(client.aliases.get(command));

  if (cmd) {
    cmd.run(client, message, args, prefix)
  }
  return;
}

client.on('message', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();

  try {
    runCommand(command, message, args, prefix)
  } catch (err) {
    console.error(err);
  }

});
keepAlive();
client.login(token);