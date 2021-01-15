const Airtable = require("airtable");
const Record = require("airtable/lib/record");
const airtable = new Airtable({apiKey: process.env.AIRTABLE_API_KEY});

module.exports = class AirtableBase
{
	constructor()
	{
		this.base = airtable.base(process.env.AIRTABLE_BASE_ID);
	}
	/**
	 * 
	 * @param {string} table 
	 * @param {string} filter 
	 * @param {(records: Record[]) => object} callback 
	 */
	async getData(table, filter, callback)
	{
		let result = await new Promise((resolve, reject) =>
		{
			this.base(table).select({filterByFormula: filter})
			.eachPage((records, _) =>
			{
				records.forEach(record => 
					{
						return resolve(callback(record))
					});
			});
		});
		return result;
	}

	async checkData(table, filter)
	{
		let result = await new Promise((resolve, reject) =>
		{
			this.base(table).select({filterByFormula: filter})
			.eachPage((records, _) =>
			{
				return resolve(records.length !== 0);
			});
		});

		return result;
	}

	/**
	 * 
	 * @param {string} table 
	 * @param {{id: string, fields: {}}} data 
	 */
	async createData(table, data)
	{
		let result = await new Promise(() =>
		{
			this.base(table).create([data]).catch(error => console.error(error));
		});
		return result;
	}

	saveData(table, data)
	{
		this.base(table).update([data]).catch(error => console.error(error));
	}
};