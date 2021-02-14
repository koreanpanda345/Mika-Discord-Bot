const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const { MessageEmbed } = require("discord.js");
const BackgroundDb = require("../../database/mongodb/BackgroundDb");
const backgroundDb = new BackgroundDb();
const ProfileDb = require("../../database/mongodb/ProfileDb");
const profileDb = new ProfileDb();

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
			enabled: true
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
		const left = ctx.guild.emojis.cache.find(e => e.id === "678784712969289729");
		const right = ctx.guild.emojis.cache.find(e => e.id === "678784396328697880");
        let pages = [];
        let page = 1;
        let desc = "";
        let pageAmount = 10;
        let backgrounds = await backgroundDb.getAll();
        let profile = await profileDb.get(ctx.userId);
        for(let i = 0; i < Math.floor(Math.round(backgrounds.length / 10)); i++)
        {
            for(let n = 1 + pageAmount - 11; n < pageAmount; n++)
            {
                if(backgrounds[n] !== undefined)
                desc += `__**ID: ${backgrounds[n].id}**__ | *${backgrounds[n].name}* - __**${
                    profile.own_bg.includes(backgrounds[n]._id) ? "Owned"       : 
                    backgrounds[n].nitro                    ? `${crystal}`  :
                    backgrounds[n].dev                      ? `${dev}`      :
                    backgrounds[n].staff                    ? `${staff}`    :
                    backgrounds[n].price === 0              ? "Free"        :
                    backgrounds[n].price
                }**__\n`;
            }
            pageAmount += 10;
            pages.push(desc);
            desc = "";
        }

        let embed = new MessageEmbed()
        let id = Number(ctx.args[1]);
        switch(ctx.args[0])
        {
            case "view":
                embed.setTitle(`Preview of ${backgrounds.find(b => b.id === id).name}`);
                embed.setDescription(`Price: ${
                    profile.own_bg.includes(backgrounds.find(b => b.id === id)._id) ? "Owned"       : 
                    backgrounds.find(b => b.id === id).nitro                    ? `${crystal}`  :
                    backgrounds.find(b => b.id === id).dev                      ? `${dev}`      :
                    backgrounds.find(b => b.id === id).staff                    ? `${staff}`    :
                    backgrounds.find(b => b.id === id).price === 0              ? "Free"        :
                    backgrounds.find(b => b.id === id).price
                }`);
                embed.setImage(backgrounds.find(b => b.id === id).url);
                embed.setColor(0xa1dbff);
                ctx.sendMessage(embed).then(async msg => await msg.delete({timeout: 60000}));
                break;
            case "own":
                let _desc = "";
                if(profile.own_bg.length === 0)
                    _desc = "You don't currently have any backgrounds.";
                else
                    for(let bg of profile.own_bg)
                    {
                        let _bg = await backgroundDb.getUserBackground(bg);
                        _desc += `${_bg.id} - ${_bg.name}\n`;
                    }
                embed.setDescription(_desc);
                embed.setTitle("Your backgrounds.");
                embed.setColor(0xa1dbff);
                ctx.sendMessage(embed).then(async msg => await msg.delete({timeout: 60000}));
                break;
            case "buy":
                let devRole = ctx.guild.roles.cache.find(r => r.name === "Bot Developer");
				let nitroRole = ctx.guild.roles.cache.find(r => r.name === "Chonky Flowers");
				let staffRole = ctx.guild.roles.cache.find(r => r.name === "Staff");
                
                let bg = await backgroundDb.get(id);
                if(!bg) return ctx.sendMessage("There doesn't seem to be a background under that id.");
                if((bg.dev && !ctx.member.roles.cache.has(devRole.id)) || ctx.userId !== "304446682081525772")
                    return ctx.sendMessage("Sorry, but this is a Developer Exclusive Background.");
                if((bg.staff && !ctx.member.roles.cache.has(staffRole.id)) || ctx.userId !== "304446682081525772" )
                    return ctx.sendMessage("Sorry, but this is a Staff Exclusive Background.");
                if((bg.nitro && !ctx.member.roles.cache.has(nitroRole.id)) || ctx.userId !== "304446682081525772")
                    return ctx.sendMessage("Sorry, but this is a Nitro Boosters Exclusive Background.");
                if(profile.account.balance < bg.price)
                    return ctx.sendMessage("Sorry, but you do not have enough flower to buy this background.");
                
                await profileDb.update(ctx.userId, (_profile) =>
                {
                    _profile.account.balance -= bg.price;
                    _profile.own_bg.push(bg);
                    _profile.background = bg.url;
                    _profile.save().catch(err => console.error(err));
                });

                embed.setTitle(`You have bought *${bg.name}* Background`);
                embed.setImage(bg.url);
                embed.setColor(0xa1dbff);
                ctx.sendMessage(embed).then(async msg => await msg.delete({timeout: 60000}));
                break;
            case "set":
                let _bg = profile.own_bg.find(b => b.id === id);
                if(!_bg) return ctx.sendMessage("Doesn't seem like you have that background.");
                await profileDb.update(ctx.userId, (_profile) =>
                {
                    _profile.background = _bg.url;
                    _profile.save().catch(err => console.error(err));
                });

                embed.setTitle(`Changed your background to ${_bg.name}`);
                embed.setImage(_bg.url);
                embed.setColor(0xa1dbff);
                ctx.sendMessage(embed).then(async msg => await msg.delete({timeout: 60000}));
                break;
            default:
                embed.setTitle("Available Backgrounds");
                embed.setDescription(pages[page - 1]);
                embed.setColor(0xffd1dc);
                embed.setFooter(`Page ${page} of ${pages.length}`);

                ctx.sendMessage(embed).then(msg =>
                {
                    msg.react(left.id).then(r =>
                    {
                        msg.react(right.id);

                        const backwardFilter = (reaction, user) => reaction.emoji.id === left.id && user.id === ctx.userId;
                        const forwardFilter = (reaction, user) => reaction.emoji.id === right.id && user.id === ctx.userId;

                        const backwards = msg.createReactionCollector(backwardFilter, {
                            time: 60000
                        });
                        const forwards = msg.createReactionCollector(forwardFilter, {
                            time: 60000
                        });

                        backwards.on("collect", () =>
                        {
                            if(page === 1) return;
                            --page;
                            embed.setDescription(pages[page - 1]);
                            embed.setFooter(`Page ${page} of ${pages.length}`);
                            msg.edit(embed);
                        });

                        forwards.on("collect", () =>
                        {
                            if(page === pages.length) return;
                            ++page;
                            embed.setDescription(pages[page - 1]);
                            embed.setFooter(`Page ${page} of ${pages.length}`);
                            msg.edit(embed);
                        });

                        backwards.on("end", async () =>
                        {
                            await msg.delete();
                        });

                        forwards.on("end", async() =>
                        {
                            await msg.delete();
                        })
                    });
                })
                break;
        }
	}
}