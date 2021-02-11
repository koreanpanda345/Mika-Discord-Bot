const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const UserProfile = require("../../database/UserProfile");
const MongoBase = require("../../base/MongoBase");
const mongoDb = new MongoBase();

module.exports = class DescriptionCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "description",
			aliases: ["desc"],
			description: "Change your Profile Card's Description",
			category: "Profile",
			enabled: true
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
        await mongoDb.updateProfile(ctx.userId, (profile) =>
        {
            profile.description = desc;
            profile.save().catch(err => console.error(err));
        })
		ctx.sendMessage(`Changed your description to ${desc}`).then(async msg =>
    {
      await msg.delete({timeout: 60000});
    })
	}
};