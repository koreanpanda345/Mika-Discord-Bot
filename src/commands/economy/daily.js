const CommandBase = require("../../base/CommandBase");
const { MessageEmbed } = require("discord.js");
const CooldownDb = require("../../database/mongodb/CooldownDb");
const EconomySystem = require("../../systems/EconomySystem");
const cooldownDb = new CooldownDb();
module.exports = class DailyCommand extends CommandBase {
    constructor(client) {
        super(client, {
            name: "daily",
            description: "Get Flowers everyday",
            category: "Economy",
            enabled: true
        });
    }

    async invoke(ctx) {
        if(await cooldownDb.get(ctx.userId) !== false)
        {
            if((await cooldownDb.get(ctx.userId)).daily > Date.now())
            {
            const timeLeft = (await cooldownDb.get(ctx.userId)).daily - Date.now();
            const timeLeftSeconds = (Math.floor((timeLeft / 1000) % 60));
            const timeLeftMinutes = (Math.floor((timeLeft / 1000 * 60) % 60));
            const timeLeftHours = (Math.floor((timeLeft / 1000 * 60 * 60) % 24));

            return ctx.sendMessage(
                `Please wait ${(timeLeftHours >= 1 ? `${timeLeftHours} Hours ` : "")}${(timeLeftMinutes >= 1 ? `${timeLeftMinutes} Minutes ` : "")}${timeLeftSeconds} Second(s) before using this command again.`
            );
            }
        }

        let add = 1500;


        let embed = new MessageEmbed();
        const flower = ctx.guild.emojis.cache.find(e => e.id === "789692926216503326");
        embed.setTitle("You claim your daily reward!");
        embed.setDescription(`You recieved ${add} ${flower}`);
        embed.setFooter(`You can claim ${add} ${flower} everyday`);
        embed.setColor(0xa1dbff);
		
		await new EconomySystem(ctx.userId).addToBalance(add);

        await cooldownDb.update(ctx.userId, (cooldown) =>
        {
            cooldown.daily = (Date.now() + 86400000);

            cooldown.save().catch(err => console.error(err));
        });

        ctx.sendMessage(embed).then(async msg => {
            await msg.delete({ timeout: 30000 });
        });

    }
};