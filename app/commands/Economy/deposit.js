const { SlashCommandBuilder } = require("discord.js");
const userAccount = require("../../schemas/userAccount");
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposits shards into your account.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The number of shards to deposit.")
        .setRequired(true)
    ),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { user, options } = interaction;
      const amount = options.getInteger("amount");

      await interaction.deferReply();

      if (amount <= 0) {
        return interaction.editReply({
          content: "Please enter a positive number.",
        });
      }

      let userData = await userAccount.findOne({ userId: user.id });

      if (!userData) {
        return interaction.editReply({
          content: "User data not found.",
        });
      }

      const userBalance = userData.balance;

      if (amount > userBalance) {
        return interaction.editReply({
          content: "Insufficient funds.",
        });
      }

      const embed = new EmbedBuilder()
        .setColor(0x66bb6a) // Use hexadecimal number directly
        .setDescription(
          `<:Check:1269478400603459715> Deposited <:shard:1269163798929870872> ${amount} into your bank!`
        );

      userData.balance -= amount;
      userData.BankBal += amount;
      await userData.save();

      await interaction.editReply({
        embeds: [embed],
      });
    } catch (error) {
      console.log(error);
      await interaction.editReply({ content: "An error occurred." });
    }
  },
};
