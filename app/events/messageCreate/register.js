const userAccount = require("../../schemas/userAccount");
const { Economy, prefix } = require("../../config.json");
const { PermissionFlagsBits } = require("discord.js");

module.exports = async (client, message) => {
  try {
    const { channel, member } = message;

    if (!member.permissions.has(PermissionFlagsBits.Administrator)) return;

    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;

    const command = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/)[0]
      .toLowerCase();

    if (command === "register") {
      if (Economy.enabled == "true") {
        const existingAccount = await userAccount.findOne({
          userId: member.user.id,
        });
        if (existingAccount) {
          return channel.send({
            content: "You've already registered.",
            ephemeral: true,
          });
        }

        if (!existingAccount) {
          newUser = await userAccount.create({
            userId: member.user.id,
            userName: member.user.username,
            balance: 1000,
            BankBal: 0,
          });

          await newUser.save();
        }

        channel.send({
          content:
            "Successfully registed your account! Your balance is now 1000 shards",
          ephemeral: true,
        });
      }
    }
  } catch (error) {
    return console.log(error);
  }
};
