const { PermissionFlagsBits } = require("discord.js");
const userTicket = require("../schemas/userTicket");

module.exports = {
  customId: "confirmCloseBtn",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { channel } = interaction;

      await interaction.deferReply({ ephemeral: true });

      const ticketData = await userTicket.findOne({ channelId: channel.id });
      if (!ticketData) {
        return interaction.editReply({
          content: "This ticket does not exist in the database.",
          ephemeral: true,
        });
      }

      await channel.delete("Ticket closed by user");

      await userTicket.deleteOne({ channelId: channel.id });
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
