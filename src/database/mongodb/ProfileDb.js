const MongoBase = require("../../base/MongoBase");
const UserDb = require("./UserDb");


module.exports = class ProfileDb extends MongoBase
{
	constructor()
	{
		super();
		this.user = new UserDb();
	}
	async create(userId)
	{
		const profile = new this.schemas.profile({
			userId,
			account: await this.user.get(userId),
			votes: 0,
			married: "No one",
			description: "No Description",
			birthday: "Jan, 1st"
		});
		profile.save().catch(error => console.error(error));
		return profile;
	}
	async get(userId)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.profile.findOne({userId}, async(err, profile) =>
			{
				if(!profile)
				{
					const newProfile = await this.create(userId);
					return resolve(newProfile);
				}
				else return resolve(profile);
			})
		});
		return result;
	}

	async getAccount(_id)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.user.findOne({_id}, (error, account) =>
			{
				if(!account) return resolve(false);
				else return resolve(account);
			});
		});

		return result;
	}

	async update(userId, callback)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.profile.findOne({userId}, async(err, profile) =>
			{
				if(!profile)
				{
					const newProfile = await this.create(userId);
					return resolve(callback(newProfile));
				}
				else return resolve(callback(profile));
			});
		});

		return result;
	}
	
}