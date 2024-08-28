const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { Moderation } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks a member from the server.")
    .addUserOption((o) =>
      o.setName("user").setDescription("The user to kick").setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("reason")
        .setDescription("The reason for kicking")
        .setRequired(false)
    ),
  userPermissions: [PermissionFlagsBits.KickMembers],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const { options, guild } = interaction;
      const target = options.getUser("user");
      const reason = options.getString("reason") || "No reason provided.";

      const member = guild.members.cache.get(target.id);

      if (!member) {
        await interaction.reply({
          content: "Invalid user provided.",
          ephemeral: true,
        });
        return;
      }

      const kickEmbed = new EmbedBuilder()
        .setColor("#66BB6A")
        .setDescription(`<:Check:1269478400603459715> Successfuly kicked ${target} | ${reason}`)

      member.kick(reason);
      await interaction.reply({
        embeds: [kickEmbed],
        ephemeral: true,
      });

      const logChannel = interaction.guild.channels.cache.get(
        Moderation.logChannel
      );
      logChannel.send(
        `${target} has been kicked by <@${interaction.user.id}> | ${reason}`
      );
    } catch (error) {
      console.log(error);
      return;
    }
  },
};
