const {
  PermissionFlagsBits,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} = require("discord.js");
const { tickets } = require("../config.json");
const userTicket = require("../schemas/userTicket.js");

module.exports = {
  customId: "unlockTicketBtn",
  userPermissions: [PermissionFlagsBits.ManageChannels],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { channel } = interaction;

      const staffRole = channel.guild.roles.cache.get(tickets.supportRole);

      await interaction.deferReply();

      const ticketData = await userTicket.findOne({ channelId: channel.id });

      if (!ticketData) {
        return interaction.editReply({
          content: "Ticket data not found.",
          ephemeral: true,
        });
      }

      const ticketMessageId = ticketData.messageId;
      if (!ticketMessageId) {
        return interaction.editReply({
          content: "Ticket message not found.",
          ephemeral: true,
        });
      }

      const ticketMessage = await channel.messages.fetch(ticketMessageId);

      const ticketButtons = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId("closeTicketBtn")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("lockTicketBtn")
          .setLabel("Lock Ticket")
          .setStyle(ButtonStyle.Success),
      ]);

      channel.permissionOverwrites.set([
        {
          id: channel.guild.roles.everyone.id,
          deny: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
          ],
        },
        {
          id: ticketData.userId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
        {
          id: staffRole.id,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
          ],
        },
      ]);

      await ticketMessage.edit({ components: [ticketButtons] });

      const reply = await interaction.editReply({
        content: "Ticket has been unlocked.",
        fetchReply: true,
      });
      setTimeout(async () => {
        try {
          await reply.delete();
        } catch (error) {
          console.error("Failed to delete reply:", error);
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      interaction.editReply({
        content: "An error occurred while unlocking the ticket.",
        ephemeral: true,
      });
    }
  },
};
