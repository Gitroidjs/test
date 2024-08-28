const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
  } = require("discord.js");
  const { Moderation } = require("../../config.json");
  
  module.exports = {
    data: new SlashCommandBuilder()
      .setName("ban")
      .setDescription("Bans a member from the server.")
      .addUserOption((o) =>
        o.setName("user").setDescription("The user to ban").setRequired(true)
      )
      .addStringOption((o) =>
        o
          .setName("reason")
          .setDescription("The reason for the ban")
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

        const banEmbed = new EmbedBuilder()
        .setColor("#66BB6A")
        .setDescription(`<:Check:1269478400603459715> Successfuly banned ${target} | ${reason}`)
  
        member.ban({ reason: reason});
        await interaction.reply({
          embeds: [banEmbed],
          ephemeral: true,
        });
  
        const logChannel = interaction.guild.channels.cache.get(
          Moderation.logChannel
        );
        logChannel.send(
          `${target} has been banned by <@${interaction.user.id}> | ${reason}\nRun \`/unban ${target.id}\` to unban them`
        );
      } catch (error) {
        console.log(error);
        return;
      }
    },
  };
  