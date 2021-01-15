const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const UserProfile = require("../../database/UserProfile");
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
		/**
		 * @type {GuildMember}
		 */
		let user;
		if(ctx.args[0])
			user = ctx.message.mentions.members.first() || ctx.message.guild.members.get(ctx.args[0]);
		else
			user = ctx.member;

		let profile = await new UserProfile().getUserData(user.id);
		let buffer = await ProfileCanvas({member: user, background: profile.background, xp: profile.xp, level: profile.level, birthday: profile.birthday, description: profile.description, votes: profile.votes, marry: profile.marry}, ctx);

		const filename = `profile-${ctx.userId}.png`;
		const attachment = new MessageAttachment(buffer, filename);
		await ctx.channel.send(attachment);
	}
};