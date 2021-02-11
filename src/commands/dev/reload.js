const CommandBase = require("../../base/CommandBase");

module.exports = class ReloadCommands extends CommandBase {
    constructor(client) {
        super(client, {
            name: "reload",
            description: "Reloads a command. Only Developers can use this command.",
            category: "Dev",
            preconditions: [
                (ctx) => {
                    if (!ctx.member.roles.cache.has("673572050945966130"))
                        return "You are not a developer.";
                    else return true;
                }
            ]
        });
    }

    async invoke(ctx) {
        if (!ctx.member.roles.cache.has("673572050945966130"))
            return;
        if (!ctx.args.length) return ctx.sendMessage("You didn't provided a command to reload.");
        const commandName = ctx.args[0].toLowerCase();
        const command = this.client.commands.get(commandName) || this.client.commands.find(cmd => cmd.props.aliases && cmd.props.aliases.includes(commandName));

        if (!command) return ctx.sendMessage(`There is no command called ${commandName}`);

        delete require.cache[require.resolve(`../${command.props.category.toLowerCase()}/${command.props.name}.js`)];

        try {
            const newCommand = new (require(`../${command.props.category.toLowerCase()}/${command.props.name}.js`))(this.client);
            this.client.commands.set(newCommand.props.name, newCommand);
            ctx.sendMessage(`Command \`${command.props.name}\` was reloaded!`).then(async msg => {
                await msg.delete({ timeout: 5000 });
            });
        }
        catch (error) {
            this.client.logger.error(error);
            ctx.sendMessage(`There was an error while reloading a command \`${command.props.name}\`:\n\`\`${error.message}\`\``).then(async msg => {
                await msg.delete({ timeout: 60000 });
            });
        }
    }
}