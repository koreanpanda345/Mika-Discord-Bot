const UserProfile = require("../database/UserProfile");

module.exports = class EconomySystem
{
  constructor(userId)
  {
    this.userId = userId;
  }

  async getBalance()
  {
    let user = await new UserProfile().getUserData(this.userId);
    return Number(user.balance);
  }
  /**
   * @param {number} add
   */
  async addToBalance(add)
  {
    let user = await new UserProfile().getUserData(this.userId);
    user.balance += add;
    let data = {id: user.recordId, fields: {balance: user.balance}};

    new UserProfile().saveUserData(data);
  }

  async substractFromBalance(sub)
  {
    let user = await new UserProfile().getUserData(this.userId);
    Number(user.balance) -= sub;
    let data = {id: user.recordId, fields: {balance: user.balance}};
    new UserProfile().saveUserData(data);
  }

};