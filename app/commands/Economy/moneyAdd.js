const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const userAccount = require("../../schemas/userAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("add-shards")
    .setDescription("Add shards to a user's balance.")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("The user to add shards to")
        .setRequired(true)
    )
    .addIntegerOption(
      (o) =>
        o
          .setName("amount")
          .setDescription("The amount of shards to add")
          .setRequired(true) // Use setRequired instead of required
    ),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { options } = interaction;
      const target = options.getUser("user");
      const amount = options.getInteger("amount")

      await interaction.deferReply();

      if (isNaN(amount) || amount <= 0) {
        return await interaction.editReply(
          "Please specify a valid positive amount."
        );
      }

      let userData = await userAccount.findOne({ userId: target.id });

      if (!userData) {
        // Handle case where userData is not found
        return await interaction.editReply("User data not found.");
      }

      // Update the balance
      userData.balance = userData.balance + amount;
      await userData.save();

      const embed = new EmbedBuilder()
        .setColor("#66BB6A")
        .setDescription(
          `<:Check:1269478400603459715> Added <:shard:1269163798929870872> ${amount} to ${target.username}'s balance.`
        );

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply("An error occurred.");
    }
  },
};
