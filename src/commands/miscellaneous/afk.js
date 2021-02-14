const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const AfkDb = require("../../database/mongodb/AfkDb");
const db = new AfkDb();
const {MessageEmbed} = require("discord.js");
module.exports = class AfkCommand extends CommandBase
{
  constructor(client)
  {
    super(client, {
      name: "afk",
      description: "Sets your status to afk, and collects any message that pings you, and displays them to you, when you get back.",
      category: "Miscellaneous",
      enabled: true
    });
  }
  /**
   * @param {CommandContextBase} ctx
   */
  async invoke(ctx)
  {
    let msg = ctx.args.join(" ").slice(0);

    let afkMsg = "";
    if(!msg) afkMsg = "AFK";
    else afkMsg = msg;

    if(await db.get(ctx.userId) === false)
    {
      await db.update(ctx.userId, (user) =>
      {
          user.reason = afkMsg;

          user.save().catch(err => console.error(err));
      });

      let embed = new MessageEmbed();
      embed.setTitle("You are now afk");
      embed.setDescription(`Reason: ${afkMsg}`);
      embed.setColor("RANDOM");


      if(ctx.self.hasPermission("MANAGE_NICKNAMES"))
      {
        let nickname = ctx.member.nickname || ctx.member.user.username;
        nickname = `[🌸] ${nickname}`;
        ctx.member.setNickname(nickname);
        embed.setFooter("I have changed your nickname to let other people know that you are afk.");
      }
      else embed.setFooter("I couldn't edit your nickname.");

      ctx.sendMessage(embed).then(async msg => 
    {
      await msg.delete({timeout: 60000});
    });
    }
    else
    {
      ctx.sendMessage("You are already afk.").then(async msg => 
    {
      await msg.delete({timeout: 60000});
    })
    }
  }
}