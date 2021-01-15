const AirtableBase = require("../base/AirtableBase");


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
		let result = await new Promise((resolve, reject) =>
		{
			this.base("Backgrounds").select({maxRecords: 100, sort: [{field: "price", direction: "asc"}]})
			.eachPage((records, _) =>
			{
				let price = [];
				let bg = [];
				let bgName = [];
				let _nitro = [];
				let _dev = [];
				let _staff = [];
				records.forEach(record =>
				{
					bg.push(record.get("url"));
					bgName.push(record.get("Name"));
					price.push(record.get("price"));
					_nitro.push(record.get("Nitro"));
					_dev.push(record.get("Dev"));
					_staff.push(record.get("Staff"));
				});
				return resolve({price: price, bg: bg, bgName: bgName, nitro: _nitro, dev: _dev, staff: _staff});
			});
		});

		return result;
	}
}