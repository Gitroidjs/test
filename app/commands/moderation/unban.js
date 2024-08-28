const {
    SlashCommandBuilder,
    PermissionFlagsBits,
  } = require("discord.js");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("unban")
      .setDescription("Unban a user")
      .addStringOption((option) =>
        option
          .setName("user-id")
          .setDescription("The user to unban")
          .setRequired(true)
      )
      .toJSON(),
  
    userPermissions: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
  
    run: async (client, interaction) => {
      const { options, guild, member } = interaction;
      const userId = options.getString("user-id");
  
      if (userId === member.id) {
        return interaction.reply({ content: "You're unable to interact with yourself", ephemeral: true });
      }
      guild.members.unban(userId);
  
      interaction.reply({ content: `Successfully unbanned **${userId}**`, ephemeral: true });
    },
  };