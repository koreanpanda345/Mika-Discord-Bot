const UserProfile = require("../database/UserProfile");


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
		let user = await new UserProfile().getUserData(this.userId);
		user.xp += addXp;
		// console.debug(user.xp);
		let data = {id: user.recordId, fields: {xp: user.xp}};
		await new UserProfile().saveUserData(data);
		// console.log("Saved");
	}

	async canLevelUp()
	{
		let data = await new UserProfile().getUserData(this.userId);
		return data.xp >= 50 * (Math.pow(data.level + 1, 2)) - (50 * (data.level + 1));
	}

	async LevelUp()
	{
		let user = await new UserProfile().getUserData(this.userId);
		user.xp = 0;
		user.level++;
		// console.debug(user.xp);
		let data = {id: user.recordId, fields: {xp: user.xp, level: user.level}};
		new UserProfile().saveUserData(data);
	}
};