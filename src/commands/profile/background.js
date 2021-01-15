const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const BackgroundShop = require("../../database/BackgroundShop");
const { MessageEmbed } = require("discord.js");
const UserProfile = require("../../database/UserProfile");
const { base } = require("airtable");

module.exports = class BackgroundCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "background",
			aliases: ["bg"],
			description: "Displays your backgrounds that you own, or sets your profile card's background.",
			usage: [".background", ".background set <background id>", ".background <background id>"],
			args: [
				{name: "action", type: "Text", description: "buy -> Buy a background | view -> view a background | own -> see the backgrounds you own | set -> sets your profile card's background | '' -> view the background store", required: false},
				{name: "background id", type: "Number", description: "The background id you want to buy/view/set.", required: false}
			],
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
	 * @param {CommandContextBase} ctx
	 */
	async invoke(ctx)
	{
		const crystal = ctx.guild.emojis.cache.find(e => e.id === "678507116817809418");
		const dev = ctx.guild.emojis.cache.find(e => e.id === "797315420251750420");
		const staff = ctx.guild.emojis.cache.find(e => e.id === "717553342649466932");
		const left = ctx.guild.emojis.cache.find(e => e.name === "FlLeftArrow");
		const right = ctx.guild.emojis.cache.find(e => e.name === "FlRightArrow");
		//{id: user.recordId, fields: {xp: user.xp}}
		const backgrounds = await new BackgroundShop().getAllOfTheBackgrounds();
		let page = 1;
		let pages = [];
		let desc = "";

		let pageAmount = 10;
		for(let i = 0; i < Math.floor(Math.round(backgrounds.bg.length / 10)); i++)
		{
			for(let n = 1 + pageAmount - 11; n < pageAmount; n++)
			{
				if(n != 0)
					desc += `__**ID: ${n}**__ | *${backgrounds.bgName[n - 1]}* - __**${
						backgrounds.nitro[n - 1] === true ? `${crystal}` : 
						backgrounds.dev[n - 1] === true ? `${dev}` :
						backgrounds.staff[n - 1] === true ? `${staff}` : 
						backgrounds.price[n - 1] !== 0 ? backgrounds.price[n - 1] : "Free"
					}**__\n`;
			}
			pageAmount += 10;
			pages.push(desc);
			desc = "";
		}
		let embed = new MessageEmbed()
		let user;
		let data;
		switch(ctx.args[0])
		{

			case "view":
;
          		embed.setTitle(`Preview of ${backgrounds.bgName[ctx.args[1] - 1]}`);
          		embed.setDescription(
            	`Price: ${
              		backgrounds.dev[ctx.args[1] - 1] === true
                	? `${dev}`
                	: backgrounds.nitro[ctx.args[1] - 1] === true
					? `${crystal}`
					: backgrounds.staff[ctx.args[1] - 1] === true
					? `${staff}`
                	: backgrounds.price[ctx.args[1] - 1] === 0
                	? "Free"
                	: `${backgrounds.price[ctx.args[1] - 1]}`
           		}`
          	);
          		embed.setImage(backgrounds.bg[ctx.args[1] - 1]);
          		embed.setColor(0xa1dbff);
        		ctx.sendMessage(embed);
				break;
			case "own":
				user = await new UserProfile().getUserData(ctx.userId);
				let _desc = "";
				if(user.ownBgName.length !== 0)
					for(let i = 0; i < user.ownBgName.length; i++)
				   		_desc += `${i + 1} - ${user.ownBgName[i]}\n`;
				else _desc = "You don't currently have any backgrounds.";

				embed.setDescription(_desc);
				embed.setColor(0xa1dbff);
				ctx.sendMessage(embed);
				break;
			case "buy":
				if(Number(args[1]) > bg.length + 1)
				return ctx.sendMessage("Sorry but that is not a background at the moment.");
				user = await new UserProfile().getUserData(ctx.userId);
				let devRole = ctx.guild.roles.find(r => r.name === "Bot Developer");
				let nitroRole = ctx.guild.roles.find(r => r.name === "Nitro Flower");
				let staffRole = ctx.guild.roles.find(r => r.name === "Staff");
				let bg = backgrounds.bg[ctx.args[1] - 1];
				if(backgrounds.dev[ctx.args[1] - 1] && !ctx.member.roles.cache.has(devRole.id) && ctx.userId !== "304446682081525772")
				   return ctx.sendMessage("Sorry, but this is a Developer Exclusive Background.");
				else if(backgrounds.staff[ctx.args[1] - 1] && !ctx.member.roles.cache.has(staffRole.id) && ctx.userId !== "304446682081525772")
				   return ctx.sendMessage("Sorry, but this is a Staff Exclusive Background.");
				else if(backgrounds.nitro[ctx.args[1] - 1] && !ctx.member.roles.cache.has(nitroRole.id) && ctx.userId !== "304446682081525772")
				   return ctx.sendMessage("Sorry, but this is a Nitro Exclusive Background.");
				else if(user.balance < backgrounds.price[ctx.args[1] - 1])
				   return ctx.sendMessage("Sorry, but you don't have have enough to but this yet.");
				else if(bg === undefined || bg === null === bg === "undefined")
				   return ctx.sendMessage("Sorry, but there was an error. PLEASE TELL THAL TO ABOSE PANDA");

				user.balance -= backgrounds.price[ctx.args[1] - 1];
				user.background = bg;
				user.ownBgName = user.ownBgName.push(backgrounds.bgName[ctx.args[1] - 1]).join(" ");
				user.ownBgUrl = user.ownBgUrl.push(backgrounds.bg[ctx.args[1] - 1]).join(" ");
				data = {id: user.recordId, fields: {balance: user.balance, background: user.background, ownBgName: user.ownBgName, ownBgUrl: user.ownBgUrl}};
				embed.setTitle(`You have bought *${backgrounds.bgName[ctx.args[1] - 1]}* Background`);
				embed.setImage(bg);
				embed.setColor(0xa1dbff);
				ctx.sendMessage(embed);
				new UserProfile().saveUserData(data);

				break;

			case "set":
				   user = await new UserProfile().getUserData(ctx.userId);
				   if(!ctx.args[1]) return ctx.sendMessage("What background you want to set your profile picture to be?");

				   if(user.ownBgName.length < ctx.args[1] - 1) return ctx.sendMessage("Sorry, but you don't own this background yet.");
				   user.background = user.ownBgUrl[ctx.args[1] - 1];
				   
					data = {id: user.recordId, fields: {background: user.background}};
				   new UserProfile().saveUserData(data);
				   embed.setTitle(`Changed your background to ${user.ownBgName[ctx.args[1] - 1]}`);
				   embed.setImage(user.background);
				   embed.setColor(0xa1dbff);
				   ctx.sendMessage(embed);
				break;
			default:
				embed.setTitle(`Available Backgrounds`);
				embed.setDescription(pages[page - 1]);
				embed.setColor(0xffd1dc);
				embed.setFooter(`Page ${page} of ${pages.length}`);

				return ctx.sendMessage(embed).then(msg =>
				{
					msg.react("678784712969289729").then(r =>
					{
						msg.react("678784396328697880");

						const backwardFilter = (reaction, user) => reaction.emoji.id === "678784712969289729" && user.id === ctx.userId;
						const forwardFilter = (reaction, user) => reaction.emoji.id === "678784396328697880" && user.id === ctx.userId;
						
						const backwards = msg.createReactionCollector(backwardFilter, {
							time: 300000
						});
						const forwards = msg.createReactionCollector(forwardFilter, {
							time: 300000
						});

						backwards.on("collect", () =>
						{
							if(page === 1) return;
							--page;
							embed.setDescription(pages[page -1]);
							embed.setFooter(`Page ${page} of ${pages.length}`);
							msg.edit(embed);
						});

						forwards.on("collect", () =>
						{
							if(page === pages.length) return;
							++page;
							embed.setDescription(pages[page -1]);
							embed.setFooter(`Page ${page} of ${pages.length}`);
							msg.edit(embed);
						});
					})
				});
				break;
		}

	}
}