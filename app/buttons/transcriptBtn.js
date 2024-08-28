const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { createTranscript } = require("discord-html-transcripts");
const userTicket = require("../schemas/userTicket.js");

module.exports = {
  customId: "transcriptBtn",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { channel } = interaction;

      await interaction.deferReply({ ephemeral: true });

      // Generate the transcript
      const attachment = await createTranscript(channel);

      // Optionally, reply to the user who clicked the button
      await interaction.editReply({
        content: "Here is the transcript of this ticket:",
        files: [attachment],
      });

      // Optionally delete the reply after a short delay
      setTimeout(async () => {
        try {
          await interaction.deleteReply();
        } catch (error) {
          console.error("Failed to delete reply:", error);
        }
      }, 10000);
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error occurred while generating the transcript.",
        ephemeral: true,
      });
    }
  },
};
