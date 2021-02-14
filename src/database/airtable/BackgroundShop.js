const AirtableBase = require("../../base/AirtableBase");


module.exports = class BackgroundShop extends AirtableBase
{
	constructor()
	{
		super();
	}
	/**
	 * @returns {{price: number[], bg: string[], bgName: string[], nitro: boolean[], dev: boolean[], staff: boolean[]}}
	 */
	async getAllOfTheBackgrounds()
	{
		let result = await new Promise(async (resolve, reject) =>
		{
			await this.base("Backgrounds").select({maxRecords: 100})
			.eachPage((records, _) =>
			{
                let data = [];
				records.forEach(record =>
				{
                    data.push(
                        {
                            id: record.get("ID"),
                            name: record.get("Name"),
                            url: record.get("url"),
                            price: record.get("price"),
                            dev: record.get("Dev"),
                            staff: record.get("Staff"),
                            nitro: record.get("Nitro"),
                        }
                    );
				});
                console.debug(data);
				return resolve(data);
			});
		});

		return result;
	}
};