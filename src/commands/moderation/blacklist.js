const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const MongoBase = require("../../base/MongoBase");
const mongoDb = new MongoBase();

module.exports = class BlacklistCommand extends CommandBase
{
    constructor(client)
    {
        super(client, {
            name: "blacklist",
            description: "Blacklists a user from the server.",
            category: "Moderation",
            userPermissions: ["BAN_MEMBERS"],
            selfPermissions: ["BAN_MEMBERS"]
        });
    }

    async invoke(ctx)
    {
        if(!ctx.member.hasPermission("BAN_MEMBERS")) return;
        if(!ctx.guild.me.hasPermission("BAN_MEMBERS")) return;

        if(!ctx.args.length)
        {
            const list = await mongoDb.getBlacklist();
            const msg = "";
            for(var user of list)
                msg += `${user.userId}\n`;
            ctx.sendMessage(msg);
        }
        
        else if(ctx.args[0].toLowerCase() === "add")
        {
            const user = ctx.message.mentions.users.first();
            if(!user) return ctx.sendMessage("Couldn't find user.");
            if(await mongoDb.isUserBlacklisted(user.id)) return ctx.sendMessage("User is already blacklisted");
            const result = await mongoDb.addUserToBlacklist(user.id);
            if(!result) ctx.sendMessage("Something happened");
            else ctx.sendMessage("User added.");
        }

        else if(ctx.args[0].toLowerCase() === "remove")
        {
            const user = ctx.message.mentions.users.first();
            if(!user) return ctx.sendMessage("Couldn't find user.");
            if(!await mongoDb.isUserBlacklisted(user.id)) return ctx.sendMessage("User is not blacklisted.");
            const result = await mongoDb.removeUserFromBlacklist(user.id);
            if(!result) ctx.sendMessage("Something happened");
            else ctx.sendMessage("Removed user from blacklist.");
        }
    }
}