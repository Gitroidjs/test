require("colors");

const { ActivityType } = require("discord.js");
const mongoose = require("mongoose");
const mongoURL = process.env.MONGOURL;

module.exports = async (client) => {
  const serverCount = client.guilds.cache.size;

  console.log("----------------------------");
  console.log(`[INFO] Logged in as ${client.user.tag}!`.green.bold);
  client.user.setActivity(`${serverCount} servers`, { type: ActivityType.Watching });

  if (!mongoURL) return console.log("[ERROR] MONGOURL is not set!".red.bold);
  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoURL);

  if (mongoose.connect) {
    console.log("[INFO] Connected to MongoDB!".green.bold);
  }
};