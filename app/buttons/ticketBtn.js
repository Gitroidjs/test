const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  customId: "ticketBtn",
  run: async (client, interaction) => {
    try {

      const ticketModal = new ModalBuilder()
        .setTitle("Ticket System")
        .setCustomId("ticketMdl")
        .setComponents(
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Ticket subject")
              .setCustomId("ticketSubject")
              .setPlaceholder("Enter a subject for your ticket")
              .setStyle(TextInputStyle.Short)
          ),
          new ActionRowBuilder().setComponents(
            new TextInputBuilder()
              .setLabel("Ticket description")
              .setCustomId("ticketDesc")
              .setPlaceholder("Enter a description for your ticket")
              .setStyle(TextInputStyle.Paragraph)
          )
        );

      return interaction.showModal(ticketModal);
    } catch (err) {
      console.log(err);
    }
  },
};
