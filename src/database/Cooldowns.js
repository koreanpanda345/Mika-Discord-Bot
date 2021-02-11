const AirtableBase = require("../base/AirtableBase");

module.exports = class Cooldowns extends AirtableBase
{
  constructor(){super();}

  async getCooldowns(userId)
  {
    let result = await new Promise(async (resolve) =>
    {
      return resolve(await super.getData("Cooldowns", `{userId} = '${userId}'`, (record) =>
      {
        return {
          recordId: record.getId(),
          daily: record.get("Daily"),
          vote: record.get("Vote")
        } 
      }));
    }).catch(error => console.error(error));

    return result;
  }

  createCooldowns(userId)
  {
    super.createData("Cooldowns", {
      fields: {
        userId: userId,
        Daily: 0,
        Vote: 0
      }
    });
  }

  async checkIfUserHasCooldowns(userId)
  {
    let result = await new Promise(async (resolve) =>
    {
      return resolve(await super.checkData("Cooldowns", `{userId} = '${userId}'`));
    }).catch(error => console.error(error));

    return result;
  }

  async updateCooldowns(data)
  {
    super.saveData("Cooldowns", data);
  }
}