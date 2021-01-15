const { Canvas, resolveImage } = require("canvas-constructor");
const fetch = require("node-fetch");
const superagent = require("node-superfetch");
const { GuildMember } = require("discord.js");
const { loadImage } = require("canvas");
const CommandContextBase = require("../base/CommandContextBase");
/**
 * 
 * @param {{member: GuildMember, description: string, birthday: string, background: string, xp: number, level: number}} data 
 * @param {CommandContextBase} ctx
 */
module.exports = async (data, ctx) =>
{
	const imageUrlRegex = /\>size=2048/g;

	try
	{
		const result = await fetch(data.member.user.displayAvatarURL({format: 'jpg', size: 128}));
		
		if(!result.ok) throw new Error("Failed to get the avatar");
		
		const avatar = await result.buffer();
		let xpNeeded =  50 * (Math.pow(data.level + 1, 2)) - (50 * (data.level + 1));
		let current = 50 *(Math.pow(data.level - 1, 2)) - (50 * (data.level -1)) || 0;

		let user = "No one";

		// if(data.marry !== "No one")
		// {
		// 	let name = ctx.message.client.users.cache.find(m => m.id === data.marry);
		// 	user = name.username;
		// }

		const {body: background} = await superagent.get(data.background)
		return new Canvas(300, 300)
			.printImage(await resolveImage(background), 0,0, 300,300)
			.setGlobalAlpha(0.6)
			.setColor("#ffffff")
			.printRectangle(10, 160, 280 - 90, 130)
			.setGlobalAlpha(1.0)
			.setColor("#575c63")
			.setGlobalAlpha(0.7)
			.printRectangle(200, 160, 90, 130)
			.setGlobalAlpha(1.0)
			.setColor("#020202")
			.setGlobalAlpha(0.6)
			.printRectangle(10, 110, 280, 50)
			.setGlobalAlpha(1.0)
			.setColor("#000000")
			.setShadowColor("(rgba(22, 22, 22, 1)")
			.setShadowOffsetY(5)
			.setShadowBlur(10)
			.printRoundedRectangle(15 + 2, 63 + 17, 70, 70, 20)
			.printRoundedImage(await resolveImage(avatar), 15 + 2, 63 + 17, 70, 70, 20)
			.setShadowColor("rgba(0,0,0,0)")
			.setShadowOffsetY(0)
			.setShadowBlur(0)
			.setColor("#36393f")
			.printRectangle(120, 140, 160, 17)
			.setColor("#A8A8A8")
			.printRectangle(120, 140, Math.floor((((data.xp - current) / xpNeeded) / 0.625) * 100), 17)
			.save()
			.restore()
			.setColor("#000000")
			.printText(`Married to: `, 20, 260)
			.printText(`--`, 25, 272)
			.printText(`Votes: ${data.votes}`, 20, 284)
			.printText(`Birthday: ${data.birthday}`, 20, 180)
			.printWrappedText(`Description: ${data.description}`, 20, 200, 180)
			.setColor("#ffffff")
			.printText(`LEVEL ${data.level}`, 125, 135)
			.printText(`${data.xp} / ${xpNeeded}`, 160, 153)
			.toBuffer();

	}
	catch(error)
	{
		console.error(error);
	}
};