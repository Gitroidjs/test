require("colors");

const commandComparing = require("../../utils/CommandComparing");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const { guildId } = require("../../config.json");

module.exports = async (client) => {
  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(
      client
    );

    for (const localCommand of localCommands) {
      const { data } = localCommand;

      const commandName = data.name;
      const commandDescription = data.description;
      const commandOptions = data.options;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === commandName
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(
            `Application command ${commandName} has been deleted.`.red
          );
          continue;
        }

        if (commandComparing(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            name: commandName,
            description: commandDescription,
            options: commandOptions,
          });
          console.log(
            `Application command ${commandName} has been edited.`.yellow
          );
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `Application command ${commandName} has been skipped, since property "deleted" is set to "true".`
              .grey
          );
          continue;
        }

        await applicationCommands.create({
          name: commandName,
          description: commandDescription,
          options: commandOptions,
        });
        console.log(
          `Application command ${commandName} has been registered.`.green
        );
      }
    }
  } catch (err) {
    console.log(`An error occurred while registering commands! ${err}`.red);
  }
};