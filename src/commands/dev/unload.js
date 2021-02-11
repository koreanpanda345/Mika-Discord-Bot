const CommandBase = require("../../base/CommandBase");

module.exports = class UnloadCommand extends CommandBase {
    constructor(client) {
        super(client, {
            name: "unload",
            description: "Unloads a command",
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

        if (!ctx.args.length) return ctx.sendMessage("You didn't provided a command to unload.");
        const commandName = ctx.args[0].toLowerCase();
        const command = this.client.commands.get(commandName) || this.client.commands.find(cmd => cmd.props.aliases && cmd.props.aliases.includes(commandName));

        if (!command) return ctx.sendMessage(`There is no command called ${commandName}`);

        delete require.cache[require.resolve(`../${command.props.category.toLowerCase()}/${command.props.name}.js`)];

        ctx.sendMessage(`Unloaded command ${command.props.name}`);
    }
}