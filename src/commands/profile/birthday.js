const CommandBase = require("../../base/CommandBase");
const CommandContextBase = require("../../base/CommandContextBase");
const MongoBase = require("../../base/MongoBase");
const mongoDb = new MongoBase();


module.exports = class BirthdayCommand extends CommandBase
{
	constructor(client)
	{
		super(client, {
			name: "birthday",
			aliases: ["bday"],
			description: "Allows you to set your birthday for your profile.",
			category: "Profile",
            usage: ["+birthday <month> <day>"],
			enabled: true
		});
	}

    async invoke(ctx)
    {
        if(ctx.args[0])
        {
            const month = ctx.args[0];
            const day = ctx.args[1];

            const date = new Date(`${month} ${day}, 2021`);
            console.log(date.toString());
            if(date.toString() === "Invalid Date") return ctx.sendMessage("Sorry but that is a invalid date.");
            let utcDate = date.toDateString().split(" ");
            await mongoDb.updateProfile(ctx.userId, (profile) =>
            {
               
                profile.birthday = `${utcDate[1]} ${utcDate[2]}`;
                profile.save().catch(err => console.error(err));
            });

            ctx.sendMessage(`Your birthday is now ${utcDate[1]} ${utcDate[2]}!`).then(async msg => await msg.delete({timeout: 60000}));
        }
    }
}