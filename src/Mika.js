const {Client, Collection} = require("discord.js");
const {Inscriber} = require("@koreanpanda/inscriber");
const CommandManager = require("./managers/CommandManager");
const EventManager = require("./managers/EventManager");
const CommandBase = require("./base/CommandBase");
/**
 * @this {Mika}
 */
module.exports = class Mika extends Client
{
	constructor()
	{
		super();

		this.logger = new Inscriber();
		/**
		 * @type {Collection<string, CommandBase>}
		 */
		this.commands = new Collection();
		/**
		 * @type {import("discord.js").PresenceStatusData}
		 */
		this.status = "online";
		/**
		 * @type {import("discord.js").ActivityOptions}
		 */
		this.activity = {name: `Prefix: ${process.env.PREFIX}`};
		/**
		 * @type {string[]}
		 */
		this.commandCategories = ["miscellaneous", "profile"];
		/**
		 * @type {string[]}
		 */
		this.eventCategories = ["client", "guild"];
	}

	loadFiles()
	{
		this.commandCategories.forEach(x => new CommandManager(this).load(x));
		this.eventCategories.forEach(x => new EventManager(this).load(x));
		this.logger.info("Loaded all files.");
	}
}