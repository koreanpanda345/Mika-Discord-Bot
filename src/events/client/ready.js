const EventBase = require("../../base/EventBase");


module.exports = class ReadyEvent extends EventBase
{
	constructor(client)
	{
		super(client, "ready");
	}

	invoke()
	{
		this.client.logger.info(`${this.client.user.username} is ready.`);
		this.client.user.setStatus(this.client.status);
		this.client.user.setActivity(this.client.activity);
	}
};