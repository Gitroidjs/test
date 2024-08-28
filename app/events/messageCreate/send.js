const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
  PermissionFlagsBits,
} = require("discord.js");
const { prefix, tickets } = require("../../config.json");

module.exports = async (client, message) => {
  try {
    if (tickets.enabled == "true") {
      if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
        return;

      if (message.author.bot) return;

      if (!message.content.startsWith(prefix)) return;

      const command = message.content
        .slice(prefix.length)
        .trim()
        .split(/ +/)[0]
        .toLowerCase();

      const embed = new EmbedBuilder()
        .setTitle("Ticket System")
        .setDescription("Click the button below to create a ticket.")
        .setColor("#513a34")
        .setFooter({ text: "Support Tickets" })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId("ticketBtn")
          .setLabel("Open a Ticket")
          .setStyle(ButtonStyle.Secondary),
      ]);

      if (command === "send") {
        const channel = client.channels.cache.get(tickets.channel);

        channel.send({ embeds: [embed], components: [row] });
      }
    } else {
      console.log("Tickets feature is disabled.");
      return;
    }
  } catch (error) {
    console.log(
      `Error occurred: ${error} \nStack trace: ${error.stack} \nMessage:`
    );
    return;
  }
};
