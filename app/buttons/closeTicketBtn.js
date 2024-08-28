const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const userTicket = require("../schemas/userTicket");

module.exports = {
  customId: "closeTicketBtn",
  userPermissions: [],
  botPermissions: [PermissionFlagsBits.ManageChannels],

  /**
   * @param {ButtonInteraction} interaction
   */

  run: async (client, interaction) => {
    try {
      await interaction.deferReply();

      const embed = new EmbedBuilder()
        .setColor("#513a34")
        .setDescription("Are you sure you want to close this ticket?");

      const row = new ActionRowBuilder().setComponents([
        new ButtonBuilder()
          .setCustomId("confirmCloseBtn")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("transcriptBtn")
          .setLabel("Get Transcript")
          .setStyle(ButtonStyle.Secondary),
      ]);

      return await interaction.editReply({
        embeds: [embed],
        components: [row],
      });
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
