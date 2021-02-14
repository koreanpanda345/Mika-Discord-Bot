const MongoBase = require("../../base/MongoBase");

module.exports = class CooldownDb extends MongoBase
{
	constructor()
	{
		super();
	}

	create(userId)
	{
		const cooldown = new this.schemas.cooldown({
			userId,
			daily: 0,
			vote: 0
		});

		cooldown.save().catch(error => console.error(error));
		return cooldown;
	}

	async get(userId)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.cooldown.findOne({userId}, (error, cooldown) =>
			{
				if(!cooldown) return resolve(false);
				else return resolve(cooldown);
			});
		});

		return result;
	}

	async update(userId, callback)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.cooldown.findOne({userId}, (err, cooldown) =>
			{
				if(!cooldown)
				{
					const newCooldown = this.create(userId);
					return resolve(callback(newCooldown));
				}
				else return resolve(callback(cooldown));
			});
		});
		return result;
	}
}