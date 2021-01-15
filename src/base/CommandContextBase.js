const { Message, APIMessage } = require("discord.js");


module.exports = class CommandContextBase
{
	/**
	 * 
	 * @param {Message} message 
	 * @param {string[]} args 
	 */
	constructor(message, args)
	{
		this.message = message;
		this.args = args;
		this.guild = message.guild;
		this.guildId = message.guild.id;
		this.channel = message.channel;
		this.channelId = message.channel.id;
		this.user = message.author;
		this.userId = message.author.id;
		this.member = message.member;
		this.self = message.guild.me;
	}
	/**
	 * 
	 * @param {import("discord.js").StringResolvable | APIMessage} content 
	 */
	sendMessage(content)
	{
		return this.channel.send(content);
	}
}