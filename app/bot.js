require("dotenv/config");

const { Client, GatewayIntentBits, Events } = require("discord.js");
const eventHandler = require("./handler/eventHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
});

eventHandler(client);

const economyMessage = new Map();
module.exports = economyMessage;

client.login(process.env.TOKEN);
