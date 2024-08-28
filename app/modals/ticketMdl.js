const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ChannelType,
  PermissionFlagsBits,
} = require("discord.js");
const { tickets } = require("../config.json");
const ticket = require("../bot.js");
const userTicket = require("../schemas/userTicket.js");

module.exports = {
  customId: "ticketMdl",
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    try {
      const { fields, guild, member } = interaction;

      const sub = fields.getTextInputValue("ticketSubject");
      const desc = fields.getTextInputValue("ticketDesc");

      await interaction.deferReply({ ephemeral: true });

      const staffRole = guild.roles.cache.get(tickets.supportRole);
      const username = member.user.globalName ?? member.user.username;

      const ticketEmbed = new EmbedBuilder()
        .setColor("#513a34")
        .setAuthor({
          name: username,
          iconURL: member.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(`**Subject:** ${sub}\n**Description:** ${desc}`)
        .setFooter({
          text: `${guild.name} - Ticket`,
          iconURL: guild.iconURL(),
        })
        .setTimestamp();

      const ticketButtons = new ActionRowBuilder().addComponents([
        new ButtonBuilder()
          .setCustomId("closeTicketBtn")
          .setLabel("Close Ticket")
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId("lockTicketBtn")
          .setLabel("Lock Ticket")
          .setStyle(ButtonStyle.Success),
      ]);

      const category = client.channels.cache.get(tickets.category);

      const existingTicket = await userTicket.findOne({ userId: member.id });
      if (existingTicket) {
        return await interaction.editReply({
          content: "You already have an open ticket.",
        });
      }

      // Await the creation of the channel
      const channel = await guild.channels.create({
        name: `ticket-${member.user.id}`,
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: guild.roles.everyone.id,
            deny: [PermissionFlagsBits.ViewChannel],
          },
          {
            id: staffRole.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
          {
            id: member.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ReadMessageHistory,
            ],
          },
        ],
      });

      const ticketMessage = await channel.send({
        content: `${staffRole} - ticket created by ${member}`,
        embeds: [ticketEmbed],
        components: [ticketButtons],
      });

      if (!existingTicket) {
        ticketSchema = await userTicket.create({
          userId: member.id,
          channelId: channel.id,
          messageId: ticketMessage.id,
        });

        await ticketSchema.save();
      }

      //ticket.set(channel.id, ticketMessage.id);

      return await interaction.editReply({
        content: `Your ticket has been created in ${channel}.`,
      });
    } catch (err) {
      console.error(err);
    }
  },
};
