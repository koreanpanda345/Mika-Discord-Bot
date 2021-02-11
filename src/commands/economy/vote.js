const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const UserProfile = require("../../database/UserProfile");
const EconomySystem = require("../../systems/EconomySystem");
const Cooldowns = require("../../database/Cooldowns");
const MongoBase = require("../../base/MongoBase");
const mongoDb = new MongoBase();
const {MessageEmbed} = require("discord.js");
module.exports = class VoteCommand extends CommandBase
{
  constructor(client)
  {
    super(client, {
      name: "vote",
      args: [{name: "the user", type: "User", description: "the user you want to vote for", required: true}],
      description: "Vote for a user every 12 hours, and get some flowers for it.",
      category: "Economy",
      enabled: true,
    });
  }
    /**
     * @param {CommandContextBase} ctx
     */
    async invoke(ctx)
    {
        if(!ctx.args[0])
            return ctx.sendMessage("Who do you want to vote for?");
        let member = ctx.message.mentions.members.first() || ctx.guild.members.cache.get(ctx.args[0]);
        if(member.user.bot) return ctx.sendMessage("This user is a bot. you can't vote for a bot.");
        let cooldowns = await mongoDb.getCooldowns(ctx.userId);
        if(cooldowns !== false)
        {
            if(cooldowns.vote > Date.now())
            {
                const timeLeft = cooldowns.vote - Date.now();
                const timeLeftSeconds = (Math.floor((timeLeft/1000)%60));
                const timeLeftMinutes = (Math.floor((timeLeft/1000*60)%60));
                const timeLeftHours = (Math.floor((timeLeft/1000*60*60)%60));

                return ctx.sendMessage(
                    `Please wait ${(timeLeftHours >= 1 ? `${timeLeftHours} Hours `: "")}${(timeLeftMinutes >= 1 ? `${timeLeftMinutes} Minutes ` : "")}${timeLeftSeconds} Second(s) before using this command again.`
              );
            }
        }

        let money = 150;
        const flower = ctx.guild.emojis.cache.find(e => e.id === "789692926216503326");
        const hug = ctx.guild.emojis.cache.find(e => e.id === "678791799749476363");
        if(member.id === ctx.userId) return ctx.sendMessage(`Find someone to vote for you ;-;. you can't vote for yourself, but heres a hug ${hug}`);
        await mongoDb.updateProfile(member.id, (profile) =>
        {
            profile.vote++;
            profile.save().catch(err => console.error(err));
        });

        await mongoDb.updateUserData(ctx.userId, (user) =>
        {
            user.balance += money;
            user.save().catch(err => console.error(err));
        });

        await mongoDb.updateCooldowns(ctx.userId, (cd) =>
        {
            cd.vote = Date.now() + (43200 * 1000);
            cd.save().catch(err => console.error(err));
        });

            let embed = new MessageEmbed();
            embed.setTitle(`${member.user.username} was voted by ${ctx.user.username}`)
            embed.setDescription(`${member.user.username} recieved a vote, and ${ctx.user.username} recieved ${money} ${flower}`);
            embed.setColor(0xa1dbff);
            ctx.sendMessage(embed).then(async msg => await msg.delete({timeout: 60000}));
    }
}