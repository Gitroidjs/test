const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require("discord.js");
  const mConfig = require("../../messageConfig.json");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("clear")
      .setDescription("Deletes a specified amount of messages.")
      .addIntegerOption((option) =>
        option
          .setName("amount")
          .setDescription("The amount of messages to delete.")
          .setRequired(true)
          .setMinValue(1)
          .setMaxValue(100)
      )
      .addUserOption((option) =>
        option.setName("user").setDescription("The user to delete messages from.")
      )
      .toJSON(),
  
    userPermissions: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
  
    run: async (client, interaction) => {
      const { options, channel } = interaction;
      let amount = options.getInteger("amount");
      const target = options.getUser("user");
      const mutiMsg = amount === 1 ? "message" : "messages";
  
      if (!amount || amount < 1 || amount > 100) {
        return await interaction.reply({
          content: `Please enter a number between 1 and 100.`,
          ephemeral: true,
        });
      }
  
      try {
        const channelMessages = await channel.messages.fetch();
  
        if (!channelMessages.size === 0) {
          return await interaction.reply({
            content: `There are no messages in this channel.`,
            ephemeral: true,
          });
        }
  
        if (amount > channelMessages.size) amount = channelMessages.size;
  
        const clearEmbed = new EmbedBuilder().setColor(mConfig.embedColorSuccess);
  
        await interaction.deferReply({ ephemeral: true });
  
        let messagesToDelete = [];
  
        if (target) {
          let i = 0;
          channelMessages.forEach((m) => {
            if (m.author.id === target.id && messagesToDelete.length < amount) {
              messagesToDelete.push(m.id);
              i++;
            }
          });
  
          clearEmbed.setDescription(
            `<:Check:1269478400603459715> Successfully cleared \`${messagesToDelete.length}\` ${mutiMsg} from ${target.username} in ${channel}.`
          );
        } else {
          messagesToDelete = channelMessages.first(amount);
          clearEmbed.setDescription(
            `<:Check:1269478400603459715> Successfully cleared \`${messagesToDelete.length}\` ${mutiMsg} in ${channel}.`
          );
        }
  
        if (messagesToDelete.length > 0) {
          await channel.bulkDelete(messagesToDelete, true);
        }
  
        await interaction.editReply({
          embeds: [clearEmbed],
        });
      } catch (error) {
        await interaction.followUp({
          content: `There was an error clearing the messages.`,
          ephemeral: true,
        });
      }
    },
  };