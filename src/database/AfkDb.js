const AirtableBase = require("../base/AirtableBase");

module.exports = class AfkDb extends AirtableBase
{
  constructor(){super();}
  /**
   * @param {string} userId
   * @param {string} reason
   */
  setAfk(userId, reason)
  {
    super.createData("AFK", {fields: {userId: userId, reason: reason}})
  }
  async checkIfUserIsAfk(userId)
  {
    let result = await new Promise(async (resolve) =>
    {
      return resolve(await super.checkData("AFK", `{userId} = '${userId}'`));
    })

    return result;
  }
  
  async getAfk(userId)
  {
    let result = await new Promise(async(resolve) =>
    {
      return resolve(await super.getData("AFK", `{userId} = '${userId}'`, (record) =>
      {
        return {
          recordId: record.getId(),
          reason: record.get("reason"),
          pings: record.get("pings"),
        };
      }));
    }).catch(error => console.error(error));
    return result;
  }

  async afkPing(userId, pinger, content, time)
  {
    let message = `|${pinger}|${content}|${time}\n`;
    console.log(userId);
    let afk = await this.getAfk(userId);
    if(typeof afk.pings === "undefined")
      afk.pings = "";
    afk.pings += message;
    super.saveData("AFK", {id: afk.recordId, fields: {pings: afk.pings}});
  }

  async removeAfk(userId)
  {
    let afk = await this.getAfk(userId);
    super.deleteData("AFK", afk.recordId);
  }
};