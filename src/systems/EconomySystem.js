const UserDb = require("../database/mongodb/UserDb");
const db = new UserDb();
module.exports = class EconomySystem
{
  constructor(userId)
  {
    this.userId = userId;
  }

  async getBalance()
  {
	  return (await db.get(userId)).balance;
  }
  /**
   * @param {number} add
   */
  async addToBalance(add)
  {
		await db.update(userId, (user) =>
	  	{
			user.balance += add;
			user.save().catch(error => console.error(error));
	  	});
  }

  async substractFromBalance(sub)
  {
		await db.update(userId, (user) =>
		{
			user.balance -= sub;
			user.save().catch(error => console.error(error));
		});
  }

};