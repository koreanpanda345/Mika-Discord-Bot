const MongoBase = require("../base/MongoBase");
const mongoDb = new MongoBase();
module.exports = class XpSystem
{
	/**
	 * 
	 * @param {string} userId 
	 */
	constructor(userId)
	{
		this.userId = userId;
	}
	/**
	 * 
	 * @param {number} addXp 
	 */
	async addXp(addXp)
	{

        await mongoDb.updateUserData(this.userId, (user) =>
        {
            user.xp += addXp;

            user.save().catch(err => console.error(err));
        });
	}

	async canLevelUp()
	{
		let data = await mongoDb.getUserData(this.userId);
		return data.xp >= 50 * (Math.pow(data.lvl + 1, 2)) - (50 * (data.lvl + 1));
	}

	async LevelUp()
	{

        await mongoDb.updateUserData(this.userId, (user) =>
        {
            user.xp = 0;
            user.lvl++;

            user.save().catch(err => console.error(err));
        });
	}
};