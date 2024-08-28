const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userAccount = require("../../schemas/userAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rob")
    .setDescription("Attempts to rob a user's balance.")
    .addUserOption((o) =>
      o.setName("user").setDescription("The user to rob").setRequired(true)
    ),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { options, user } = interaction;
      const target = options.getUser("user");
      const robber = user;
      const FINE_AMOUNT = 50; // Fine for failing
      const successRate = 0.7;

      if (target.id === robber.id) {
        return interaction.reply({
          content: "You can't rob yourself!",
          ephemeral: true,
        });
      }

      const noMoneyEmbed = new EmbedBuilder()
        .setDescription(`${target} has nothing to rob!`)
        .setColor("Red");

      const userData = await userAccount.findOne({ userId: robber.id });
      const targetData = await userAccount.findOne({ userId: target.id });

      if (userData.robCooldownExpiration > Date.now()) {
        const remainingTime = userData.robCooldownExpiration - Date.now();
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);

        const timeLeftFormatted = `**${hours}** hours, **${minutes}** minutes`;
        const cooldownEmbed = new EmbedBuilder()
          .setDescription(`You can rob someone again in ${timeLeftFormatted}.`)
          .setColor("Red");
        return await interaction.reply({
          embeds: [cooldownEmbed],
          ephemeral: true,
        });
      }

      robberBalance = userData.balance;
      targetBalance = targetData.balance;

      if (targetBalance < 0) {
        return interaction.reply({
          embeds: [noMoneyEmbed],
          ephemeral: true,
        });
      }

      const isSuccess = Math.random() < successRate;
      if (isSuccess) {
        // Calculate the amount to rob (e.g., 10% of target's balance)
        const amountStolen = Math.floor(targetBalance * 0.1);

        // Update balances
        targetData.balance -= amountStolen;
        userData.balance += amountStolen;
        targetData.save();
        userData.save();

        const newCooldown = {
          userId: user.id,
          robCooldownExpiration: Date.now() + 24 * 60 * 60 * 1000,
        };

        // Set the cooldown for the user
        await userAccount.findOneAndUpdate(
          {
            userId: user.id,
          },
          newCooldown,
          { upsert: true, new: true }
        );
        const successEmbed = new EmbedBuilder()
          .setDescription(
            `Successfully robbed ${target.username} and stole <:shard:1269163798929870872>${amountStolen}!`
          )
          .setColor("Green");
        const DMEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `You've been robbed and lost <:shard:1269163798929870872>${amountStolen}`
          );
        target.send({
          embeds: [DMEmbed],
        });

        return interaction.reply({
          embeds: [successEmbed],
        });
      } else {
        // Fine the user for failing
        const fine = Math.min(FINE_AMOUNT, robberBalance); // Fine or take as much as the user has
        userData.balance -= fine;
        userData.save();

        const newCooldown = {
          userId: user.id,
          robCooldownExpiration: Date.now() + 24 * 60 * 60 * 1000,
        };

        // Set the cooldown for the user
        await userAccount.findOneAndUpdate(
          {
            userId: user.id,
          },
          newCooldown,
          { upsert: true, new: true }
        );

        const failedEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            `You failed to rob ${target} and was fined <:shard:1269163798929870872>${fine}!`
          );

        return interaction.reply({
          embeds: [failedEmbed],
        });
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
