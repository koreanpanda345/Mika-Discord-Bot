const ManagerBase = require("../base/ManagerBase");
const EventBase = require("../base/EventBase");


module.exports = class EventManager extends ManagerBase
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
		const events = require("fs").readdirSync(`./src/events/${dir}`).filter(d => d.endsWith(".js"));

		for(let file of events)
		{
			/**
			 * @type {EventBase}
			 */
			const event = new(require(`../events/${dir}/${file}`))(this.client);
			this.client.on(event.name, (...args) => event.invoke(...args));
			this.client.logger.info(`Event ${event.name} was loaded.`);
		}
	}
}