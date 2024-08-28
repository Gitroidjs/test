const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userAccount = require("../../schemas/userAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your current balance")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("The user whose balance you want to check")
        .setRequired(false)
    ),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { options, user } = interaction;
      const targetUser = options.getUser("user") || user;

      await interaction.deferReply();

      // Fetch user data from the database
      const userData = await userAccount.findOne({ userId: targetUser.id });

      // Handle case where userData is null
      if (!userData) {
        return await interaction.editReply("User data not found.");
      }

      // Extract and handle possible undefined values
      const userBalance = userData.balance || 0;
      const bankBalance = userData.BankBal || 0;
      const totalBalance = userBalance + bankBalance;

      // Format the balances
      const formattedBal = userBalance.toLocaleString();
      const formattedBankBal = bankBalance.toLocaleString();
      const formattedTotalBal = totalBalance.toLocaleString();

      const embed = new EmbedBuilder().setColor("#513a34").setFields(
        {
          name: "Shards",
          value: `<:shard:1269163798929870872> ${formattedBal}`,
          inline: true,
        },
        {
          name: "Bank",
          value: `<:shard:1269163798929870872> ${formattedBankBal}`,
          inline: true,
        },
        {
          name: "total",
          value: `<:shard:1269163798929870872> ${formattedTotalBal}`,
          inline: true,
        }
      );

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "An error occurred while retrieving the balance.",
      });
    }
  },
};
