const CommandBase = require("../../base/CommandBase");

module.exports = class LoadCommand extends CommandBase {
    constructor(client) {
        super(client, {
            name: "load",
            description: "Loads a command",
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

        if (!ctx.args.length) return ctx.sendMessage("What category, and name of the command you want to load?");

        const category = ctx.args[0];
        const name = ctx.args[1];

        try {
            const command = new (require(`../${category.toLowerCase()}/${name.toLowerCase()}.js`))(this.client);
            ctx.sendMessage(`Found ${command.props.name}... Loading It!`).then(msg => {
                this.client.commands.set(command.props.name, command);
                msg.edit(`Command ${command.props.name} was loaded in.`);
            });
        }
        catch (error) {
            this.client.logger.error(error);
            ctx.sendMessage(`ERROR when trying to load command.\n\`\`${error.message}\`\``);
        }
    }
}