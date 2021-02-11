const CommandBase = require("../../base/CommandBase");
const { MessageEmbed } = require("discord.js");
const MongoBase = require("../../base/MongoBase");
const mongoDb = new MongoBase();
module.exports = class BalanceCommand extends CommandBase {
    constructor(client) {
        super(client, {
            name: "balance",
            aliases: ["bal"],
            description: "Displays your current balance",
            category: "Economy"
        });
    }

    async invoke(ctx) {
        const flowers = ctx.guild.emojis.cache.find(e => e.id === "789692926216503326");
        let user;
        if (!ctx.args[0])
            user = ctx.user;
        else
            user = ctx.message.mentions.users.first() || ctx.guild.members.cache.get(ctx.args[0]);
        let embed = new MessageEmbed();
        embed.setTitle(`${user.username}'s Balance`);
        let account = await mongoDb.getUserData(user.id);
        embed.setDescription(`Balance: ${account.balance} ${flowers}`);
        embed.setColor(0xa1dbff);

        ctx.sendMessage(embed).then(async msg => {
            await msg.delete({ timeout: 60000 });
        });
    }
};