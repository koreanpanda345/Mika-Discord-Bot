const MongoBase = require("../../base/MongoBase");


module.exports = class AfkDb extends MongoBase
{
	constructor()
	{
		super();
	}

	async get(userId)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.afk.findOne({userId}, (error, user) =>
			{
				if(!user) return resolve(false);
				return resolve(user);
			});
		});

		return result;
	}

	async update(userId, callback)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.afk.findOne({userId}, (err, user) =>
			{
				if(!user)
				{
					const newAfk = new this.schemas.afk({
						userId,
						reason: "AFK",
						pings: []
					});
					return resolve(callback(newAfk));
				}
				else return resolve(callback(user));
			});
		});

		return result;
	}

	delete(userId)
	{
		this.schemas.afk.deleteOne({userId}, (err) =>
		{
			if(err) console.error(err);
			console.log("Deleted a afk record.");
		});
	}


}