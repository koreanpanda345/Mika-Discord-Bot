const EventBase = require("../../base/EventBase");
const { Message, MessageEmbed } = require("discord.js");
const CommandContextBase = require("../../base/CommandContextBase");
const UserProfile = require("../../database/UserProfile");
const XpSystem = require("../../systems/XpSystem");
const MongoBase = require("../../base/MongoBase");
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
        const mongoBase = new MongoBase();
        if((await mongoBase.getUserData(message.author.id)).username !== message.author.username)
            await mongoBase.updateUserData(message.author.id, (user) =>
            {
                user.username = message.author.username;

                user.save().catch(err => console.error(err));
            });
        //console.debug(await mongoBase.getUserData(message.author.id));
		if(!["732253194721427496", "759388434216517632", "747462348977209436"].includes(message.channel.id))
		{
			await new XpSystem(message.author.id).addXp(1);
			if(await new XpSystem(message.author.id).canLevelUp())
			{
				let embed = new MessageEmbed();
				embed.setTitle("Level Up");
				embed.setColor(0xa1dbff);
				await new XpSystem(message.author.id).LevelUp();
				let user = await mongoBase.getUserData(message.author.id);
				embed.setDescription(`You are level ${user.lvl}`);
				embed.setThumbnail(message.author.displayAvatarURL());

				message.channel.send(embed).then(async msg =>
        {
          await msg.delete({timeout: 30000});
        });
			}
		}
    if(message.mentions.users.size)
    {

      let user = message.mentions.users.first();
      if(await mongoBase.getAfk(message.author.id) !== false)
      {

        let pinger = message.author.id;
        let content = message.content;
        let time = new Date(Date.now());

        await mongoBase.updateAfk(user.id, (user) =>
        {
            user.pings.push({author: pinger, content: content, time: time});
            user.save().catch(error => console.error(error));
        });
        let afk = await mongoBase.getAfk(user.id);
        let embed = new MessageEmbed();
        embed.setTitle("They are afk.");
        embed.setDescription(`Reason: ${afk.reason}\n I will let them know them know what you pinged them for.`);
        embed.addField("Message", message.content);
        embed.setColor("RANDOM");
        message.channel.send(embed).then(async msg =>
        {
          await msg.delete({timeout: 10000});
        });
      }
    }
    if(await mongoBase.getAfk(message.author.id) !== false)
    {
        let afk = await mongoBase.getAfk(message.author.id);
      let embed = new MessageEmbed();
      embed.setTitle(`${(afk.pings.length ? "Some messages that pinged you" : "Nothing happened while you were away")}`);
      embed.setDescription("Btw I removed your afk status.");
      
      for(let msg of afk.pings)
      {
          let user;
        if(msg.author !== undefined)
            user = message.client.users.cache.get(msg.author);
        embed.addField(`Author: ${user !== undefined ? user.username : "--"}\nAt: ${msg.time}`, msg.content);
      }
      embed.setColor("RANDOM");
      message.channel.send(embed).then(async msg =>
      {
        await msg.delete({timeout: 60000});
      })

      let nickname = message.member.nickname;
        if(nickname !== null)
        {
        nickname = nickname.replace("[🌸]", "").trim();
        message.member.setNickname(nickname);
        }
      mongoBase.deleteAfk(message.author.id);
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
				else pass = true;
			});

			if(!pass)
				return;

			try
			{
        if(pass)
				  await command.invoke(ctx);
			}
			catch(error)
			{
				this.client.logger.error(error);
			}
		}
	}
};