const UserDb = require("../database/mongodb/UserDb");
const db = new UserDb();
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

        await db.update(this.userId, (user) =>
        {
            user.xp += addXp;

            user.save().catch(err => console.error(err));
        });
	}

	async canLevelUp()
	{
		let data = await db.get(this.userId);
		return data.xp >= 50 * (Math.pow(data.lvl + 1, 2)) - (50 * (data.lvl + 1));
	}

	async LevelUp()
	{

        await db.update(this.userId, (user) =>
        {
            user.xp = 0;
            user.lvl++;

            user.save().catch(err => console.error(err));
        });
	}
};