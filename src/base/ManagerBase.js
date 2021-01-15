const Mika = require("../Mika");


module.exports = class ManagerBase
{
	/**
	 * 
	 * @param {Mika} client 
	 */
	constructor(client)
	{
		this.client = client;
	}
	/**
	 * 
	 * @param {string} dir 
	 */
	load(dir){}
};