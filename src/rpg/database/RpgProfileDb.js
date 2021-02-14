const MongoBase = require("../../base/MongoBase");


module.exports = class RpgProfileDb extends MongoBase
{
	constructor()
	{
		super();
	}

	create(userId)
	{
		const profile = new this.schemas.rpg({
			userId,
			lvl: 0,
			xp: 0,
			balance: 0
		});

		profile.save().catch(error => console.error(error));
		return profile;
	}

	async get(userId)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.rpg.findOne({userId}, (error, profile) =>
			{
				if(!profile)
				{
					const newProfile = this.create(userId);
					return resolve(newProfile);
				}
				else return resolve(profile);
			});
		});

		return result;
	}

	async update(userId, callback)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.rpg.findOne({userId}, (error, profile) =>
			{
				if(!profile) return resolve(callback(this.create(userId)));
				else return resolve(callback(profile));
			});
		});

		return result;
	}
}