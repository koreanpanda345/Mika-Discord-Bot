const EventBase = require("../../base/EventBase");
const { Message, MessageEmbed } = require("discord.js");
const CommandContextBase = require("../../base/CommandContextBase");
const UserProfile = require("../../database/UserProfile");
const XpSystem = require("../../systems/XpSystem");


module.exports = class MessageEvent extends EventBase
{
	constructor(client)
	{
		super(client, "message");
	}
	/**
	 * 
	 * @param {Message} message 
	 */
	async invoke(message)
	{
		if(message.author.bot || message.channel.type === "dm") return;
		if(message.channel.id !== "759388434216517632")
		{
			if(!await new UserProfile().checkIfDataExist(message.author.id))
				await new UserProfile().createUserData(message.author.id);
			// console.debug(await new UserProfile().getUserData("304446682081525772"));
			await new XpSystem(message.author.id).addXp(1);
			if(await new XpSystem(message.author.id).canLevelUp())
			{
				let embed = new MessageEmbed();
				embed.setTitle("Level Up");
				embed.setColor(0xa1dbff);
				await new XpSystem(message.author.id).LevelUp();
				let user = await new UserProfile().getUserData(message.author.id);
				embed.setDescription(`You are level ${user.level}`);
				embed.setThumbnail(message.author.displayAvatarURL());

				message.channel.send(embed);
			}
		}
		if(message.content.toLowerCase().startsWith(process.env.PREFIX))
		{
			const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
			const commandName = args.shift().toLowerCase();

			const ctx = new CommandContextBase(message, args);

			const command = this.client.commands.get(commandName) || this.client.commands.find(cmd => cmd.props.aliases && cmd.props.aliases.includes(commandName));

			if(!command) return;

			if(!command.props.enabled) return ctx.sendMessage("Command is disabled");

			let pass = true;

			command.permissions.user.forEach(permission =>
			{
				if(!ctx.member.hasPermission(permission))
				{
					pass = false;
					return ctx.sendMessage(`You are missing the permission of ${permission}.`);
				}
				pass = true;
			});

			if(!pass)
				return;
			command.permissions.self.forEach(permission =>
			{
				if(!ctx.self.hasPermission(permission))
				{
					pass = false;
					return ctx.sendMessage(`I am missing the permission of ${permission}`);
				}
				pass = true;
			});

			if(!pass)
				return;

			command.preconditions.forEach(async condition =>
			{
				const result = await condition(ctx);
				if(typeof result === "string")
				{
					pass = false;
					return ctx.sendMessage(result);
				}
				else if(typeof result === "boolean" && !result)
				{
					pass = false;
					return ctx.sendMessage("Something happened in the Precondition check.");
				}
				else if(typeof result !== "boolean")
				{
					pass = false;
					return ctx.sendMessage("Something happened in the Precondition check.");
				}
				pass = true;
			});

			if(!pass)
				return;

			try
			{
				await command.invoke(ctx);
			}
			catch(error)
			{
				this.client.logger.error(error);
			}
		}
	}
};