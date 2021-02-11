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
		const embed = new MessageEmbed();
    let start = Date.now();
		embed.setTitle("Pong");

		ctx.sendMessage(embed).then(async msg =>
    {
      let end = Date.now() - start;
      embed.setDescription(`WS Latency: ${this.client.ws.ping}\nREST Latency: ${end} ms!`);
      embed.setColor(end < 100 ? "GREEN" : end < 200 ? "ORANGE" : "RED");
      msg.edit(embed);
      await msg.delete({timeout: 60000});
    });
	}
}