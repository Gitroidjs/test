const userAccount = require("../../schemas/userAccount");
const { Economy } = require("../../config.json");
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily reward."),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { user } = interaction;
      const userData = await userAccount.findOne({ userId: user.id });

      await interaction.deferReply();

      if (userData.coolDownExpiration > Date.now()) {
        const remainingTime = userData.coolDownExpiration - Date.now();
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);

        const timeLeftFormatted = `**${hours}** hours, **${minutes}** minutes`;
        return await interaction.editReply(
          `You can claim your daily reward again in ${timeLeftFormatted}.`
        );
      }

      userData.balance += 500;
      await userData.save();

      const newCooldown = {
        userId: user.id,
        coolDownExpiration: Date.now() + 24 * 60 * 60 * 1000,
      };

      await userAccount.findOneAndUpdate(
        {
          userId: user.id,
        },
        newCooldown,
        { upsert: true, new: true }
      );

      await interaction.editReply(
        `Congratulations! You've earned <:shard:1269163798929870872> 500 shards.`
      );
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "An error occurred while claiming your daily reward."
      );
      return;
    }
  },
};
