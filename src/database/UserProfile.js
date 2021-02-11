const AirtableBase = require("../base/AirtableBase");

module.exports = class UserProfile extends AirtableBase
{
	constructor(){super();}
	async checkIfDataExist(userId)
	{
		let result = await new Promise(async (resolve) =>
		{
			return resolve(await super.checkData("Users", `{ID} = '${userId}'`));
		});

		return result;
	}
  createUserData(userId)
	{ 
    super.createData("Users", {
				fields: {
					ID: userId,
					balance: 200,
					xp: 0,
					level: 1,
					description: "No Description",
					background: "https://i.imgur.com/VI1bAUr.jpg",
					votes: 0,
					birthday: "1-1-2021",
					marry: "No one",
					ownBgName: "Default-Pink",
					ownBgUrl: "https://i.imgur.com/VI1bAUr.jpg"
				}
		})
	}
	async getUserData(userId)
	{
		let user = await new Promise(async (resolve) =>
		{
			return resolve(await super.getData("Users", `{ID} = '${userId}'`,
			(record) =>
			{
				return{
					recordId: record.getId(),
					userId: record.get("ID"),
					balance: record.get("balance"),
					xp: record.get("xp"),
					level: record.get("level"),
					background: record.get("background"),
					description: record.get("description"),
					birthday: record.get("birthday"),
					votes: record.get("votes"),
					marry: record.get("marry"),
					ownBgName: record.get("ownBgName").split(" "),
					ownBgUrl: record.get("ownBgUrl").split(" ")
				};
			}));
		});



		return user;
	}

	saveUserData(data)
	{
		super.saveData("Users", data);
	}
};