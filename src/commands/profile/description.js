const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const UserProfile = require("../../database/UserProfile");


module.exports = class DescriptionCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "description",
			aliases: ["desc"],
			description: "Change your Profile Card's Description",
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
		if(!ctx.args[0]) return ctx.sendMessage("What would you like your description to be?");
		let desc = ctx.args.join(" ").slice(0);
		if(desc.length > 150) return ctx.sendMessage("Sorry, you can only have a max of 150 characters for your description.");
		let user = await new UserProfile().getUserData(ctx.userId);
		user.description = desc;
		let data = {id: user.recordId, fields: {description: user.description}};
		new UserProfile().saveUserData(data);
		ctx.sendMessage(`Changed your description to ${user.description}`);
	}
};