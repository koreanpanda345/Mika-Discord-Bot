const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const MongoBase = require("../../base/MongoBase");
const mongoDb = new MongoBase();
const { GuildMember, MessageAttachment } = require("discord.js");
const ProfileCanvas = require("../../canvas/ProfileCanvas");


module.exports = class ProfileCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "profile",
			aliases: ["pfp"],
			args: [{name: "user", type: "User", description: "The user whose's profile you want to look at.", required: false}],
			description: "User's Profile",
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
		/**
		 * @type {GuildMember}
		 */
		let user;
		if(ctx.args[0])
			user = ctx.message.mentions.members.first() || ctx.message.guild.members.get(ctx.args[0]);
		else
			user = ctx.member;
        let profile = await mongoDb.getProfile(user.id);
        let account = await mongoDb.getProfileAccount(profile.account);
		let buffer = await ProfileCanvas({member: user, background: profile.background, xp: account.xp, level: account.lvl, birthday: profile.birthday, description: profile.description, votes: profile.votes, marry: profile.marry}, ctx);

		const filename = `profile-${ctx.userId}.png`;
		const attachment = new MessageAttachment(buffer, filename);
		await ctx.channel.send(attachment).then(async msg =>
    {
      await msg.delete({timeout: 60000});
    })
	}
};