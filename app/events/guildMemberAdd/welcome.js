const { EmbedBuilder } = require("discord.js");
const { Channels, Welcomer, Economy } = require("../../config.json");
const userAccount = require("../../schemas/userAccount");
require("colors");

module.exports = async (client, member) => {
  try {
    if (Welcomer.enabled == "true") {
      const role = member.guild.roles.cache.get(Welcomer.role);
      const channel = member.guild.channels.cache.get(Welcomer.channel);

      const memberCount = member.guild.memberCount;

      if (!channel) return;
      if (!role) return;

      // embed
      const embed = new EmbedBuilder()
        .setDescription(
          `<a:welcome:1266845478658769007> New member!\n\nHello and welcome to the **Yoshiwara District**, ${member}! Before you begin your journey with us, take a look to the following:\n\n<:netsubot:1266840963264024617> Go over and read our rules in <#${Channels.Rules}>\n<:netsubot:1266840963264024617> Chat and meet others in <#${Channels.General}>\n<:netsubot:1266840963264024617> Select roles in <#${Channels.Profile}>\n<:netsubot:1266840963264024617> Learn about the features our bots offer in <#${Channels.botInfo}>\n\n<:netsubot:1266840963264024617> We now have ${memberCount} members!`
        )
        .setColor("#513a34")
        .setImage(
          "https://cdn.discordapp.com/attachments/1270862651076907170/1270862712297099296/hu.gif?ex=66b53ea2&is=66b3ed22&hm=42945b3e20b1240aa832a4aacb14a609ba910cbc6127c2093dac9a5bab0630b1&"
        )
        .setAuthor({
          name: "Welcome!",
          iconURL: member.user.displayAvatarURL(),
        })
        .setFooter({
          text: "We are glad to have you!",
        })
        .setTimestamp();

      await channel.send({ embeds: [embed] });
      await member.roles.add(role);

      if (Economy.enabled == "true") {
        const existingAccount = await userAccount.findOne({
          userId: member.user.id,
        });
        if (existingAccount) return;

        if (!existingAccount) {
          newUser = await userAccount.create({
            userId: member.user.id,
            userName: member.user.username,
            balance: 1000,
            BankBal: 0,
          });

          await newUser.save();
        }
      } else {
        return console.log(
          "Economy system is disabled. Skipping user account creation.  \n"
            .yellow.bold
        );
      }
    }
  } catch (error) {
    return console.log(
      `An error occurred: ${error.message} \n${error.stack} \n`.red
    );
  }
};
