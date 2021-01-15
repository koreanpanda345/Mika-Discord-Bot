const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const UserProfile = require("../../database/UserProfile");


module.exports = class BirthdayCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "birthday",
			aliases: ["bday"],
			description: "Allows you to set your birthday for your profile.",
			category: "Profile",
			enabled: true,
			preconditions: [
				/**
				 * @param {CommandContextBase} ctx
				 */
				async (ctx) =>
				{
					if(!await new UserProfile().checkIfDataExist(ctx.userId))
						await new UserProfile().createUserData(ctx.userId);
					return true;
				}
			]
		});
	}
	/**
	 * 
	 * @param {CommandContextBase} ctx 
	 */
	async invoke(ctx)
	{
		if(!ctx.args[0]) return ctx.sendMessage("When is your birthday?");
		let date = ctx.args.join(" ").slice(0);
		let user = await new UserProfile().getUserData(ctx.userId);
		user.birthday = date;
		let data = {id: user.recordId, fields: {birthday: user.birthday}};
		new UserProfile().saveUserData(data);
		
		ctx.sendMessage(`Your birthday is now \`${date}\``);
	}
}