const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const { MessageEmbed } = require("discord.js");


module.exports = class HelpCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "help",
			aliases: ["command", "commands"],
			args: [{name: "command name", type: "Text", description: "The name of the command you want info on.", required: false}],
			description: "Displays a list of my commands, or info about a specific command.",
			usage: [".help", ".help <command name>"],
			category: "Miscellaneous"
		});
	}
	/**
	 * 
	 * @param {CommandContextBase} ctx 
	 */
	async invoke(ctx)
	{
		const embed = new MessageEmbed();

		if(!ctx.args[0])
		{
			const commands = this.client.commands;
			const cat = require("fs").readdirSync("./src/commands");
			for(let dir of cat)
			{
				const cmds = commands.filter(cmd => cmd.props.category.toLowerCase() === dir.toLowerCase());
				let desc = "";
				const keys = cmds.keyArray();
				for(let i = 0; i < keys.length; i++)
				{
					const cmd = cmds.get(keys[i]);
					desc += `${process.env.PREFIX}${cmd.props.name}\n`;
				}

				embed.addField(`${dir}`, desc);
			}

			embed.setTitle("List of commands");
			embed.setDescription(`Prefix: ${process.env.PREFIX}`);
			embed.setColor("RANDOM");
		}
		else
		{
			const command = this.client.commands.get(ctx.args[0]) || this.client.commands.find(cmd => cmd.props.aliases && cmd.props.aliases.includes(ctx.args[0]));
			if(!command) return ctx.sendMessage("I couldn't find a command like that.");

			embed.setTitle(`Information on ${command.props.name}`);
			let usage = "";
			for(let use of command.props.usage)
				usage += `${use} | `;
			usage = usage.trim("|");
			embed.setDescription(`Category: ${command.props.category}\nDescription: ${command.props.description}\nUsage: ${usage}`);
			for(let arg of command.props.args)
				embed.addField(`${arg.name}${arg.required ? "*" : ""}`, `Description: ${arg.description}`);

			embed.setColor("RANDOM");
		}

		ctx.sendMessage(embed);
	}
}