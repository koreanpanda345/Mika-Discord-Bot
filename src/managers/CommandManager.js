const ManagerBase = require("../base/ManagerBase");
const Mika = require("../Mika");
const CommandContextBase = require("../base/CommandContextBase");


module.exports = class CommandManager extends ManagerBase
{
	constructor(client)
	{
		super(client);
	}
	/**
	 * 
	 * @param {string} dir 
	 */
	load(dir)
	{
		const commands = require("fs").readdirSync(`./src/commands/${dir}`).filter(d => d.endsWith(".js"));
		for(let file of commands)
		{
			/**
			 * @type {CommandContextBase}
			 */
			const command = new(require(`../commands/${dir}/${file}`))(this.client);
			this.client.commands.set(command.props.name, command);
			this.client.logger.info(`Command ${command.props.name} was loaded.`);
		}
	}
};