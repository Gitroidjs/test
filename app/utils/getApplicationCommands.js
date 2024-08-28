module.exports = async (client, guildId) => {
    let applicationCommands;
  
    if (guildId) {
      const guildId = await client.guilds.fetch(guildId);
      applicationCommands = guildId.commands;
    } else {
      applicationCommands = client.application.commands;
    }
  
    await applicationCommands.fetch();
    return applicationCommands;
  };