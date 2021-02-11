const MongoBase = require("../../base/MongoBase");
const mongoDb = new MongoBase();

module.exports = class
{
    constructor(client)
    {
        this.client = client;
    }

    async invoke(member)
    {
        const result = await mongoDb.isUserBlacklisted(member.id);

        if(!result)return;
        else await member.ban({reason: "You were blacklisted."});
        await mongoDb.bannedUser(member.id);
    }
}