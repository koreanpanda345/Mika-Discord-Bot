const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const { MessageEmbed } = require("discord.js");


module.exports = class LatencyCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "latency",
			aliases: ["ping"],
			description: "Displays my latency",
			category: "Miscellaneous",
			enabled: true
		});
	}
	/**
	 * 
	 * @param {CommandContextBase} ctx 
	 */
	async invoke(ctx)
	{
		const latency = this.client.ws.ping;
		const embed = new MessageEmbed();
		embed.setTitle("Pong!");
		embed.setDescription(`My latency is ${latency} ms!`);
		embed.setColor(`${(latency < 100 ? "GREEN" : latency < 200 ? "ORANGE" : "RED")}`);

		ctx.sendMessage(embed);
	}
}