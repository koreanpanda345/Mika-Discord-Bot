const MongoBase = require("../../base/MongoBase");


module.exports = class UserDb extends MongoBase
{
	constructor()
	{
		super();
	}

	async create(userId)
	{
		const user = new this.schemas.user({
			userId,
			xp: 0,
			lvl: 1,
			balance: 200,
			username: ""
		});

		user.save().catch(error => console.error(error));
		return user;
	}

	async get(userId)
	{
		let result = await new Promise(async (resolve) =>
		{
			this.schemas.user.findOne({userId}, async (err, user) =>
			{
				if(!user)
				{
					const newUser = await this.create(userId);
					return resolve(newUser);
				}
				else return resolve(user);
			});
		});
		return result;
	}

	async update(userId, callback)
	{
		let result = await new Promise(async (resolve) =>
		{
			this.schemas.user.findOne({userId}, async (error, user) =>
			{
				if(!user)
				{
					const newUser = await this.create(userId);
					return resolve(callback(newUser));
				}
				else return resolve(callback(user));
			});
		});
	}
}