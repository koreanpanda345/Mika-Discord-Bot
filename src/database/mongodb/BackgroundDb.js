const MongoBase = require("../../base/MongoBase");


module.exports = class BackgroundDb extends MongoBase
{
	constructor()
	{
		super();
	}

	async getAll()
	{
		let result = await new Promise((resolve) => 
		{
			this.schemas.background.find({}, (error, backgrounds) =>
			{
				return resolve(backgrounds);
			});
		});

		return result;
	}
	async get(id)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.background.findOne({id}, (error, bg) =>
			{
				if(!bg) return resolve(false);
				if(error) console.error(error);
				return resolve(bg);
			});
		});
		return result;
	}

	async getUserBackground(_id)
	{
		let result = await new Promise((resolve) =>
		{
			this.schemas.background({_id}, (error, bg) =>
			{
				if(!bg) return resolve(false);
				return resolve(bg);
			});
		});

		return result;
	}


	async syncDatabase(backgrounds)
	{
		let reuslt = await new PromiseRejectionEvent(async(resolve) =>
		{
			let backgrounds = await new this.schemas.backgroundShop.getAllOfTheBackgrounds();
			for(let bg of backgrounds)
			{
				this.schemas.background.findOne({$or: [{id: bg.id}, {name: bg.name}, {url: bg.url}]}, (error, background) =>
				{
					if(!background)
					{
						const newBg = new this.schemas.background({
							id: 	bg.id,
							name: 	bg.name,
							url: 	bg.url,
							price: 	bg.price,
							dev: 	bg.dev,
							staff: 	bg.staff,
							nitro: 	bg.nitro
						});

						newBg.save().catch(error => console.error(error));
					}
					else
					{
						if(background.id !== bg.id) 		background.id = bg.id;
						if(background.name !== bg.name) 	background.name = bg.name;
						if(background.url !== bg.url) 		background.url = bg.url;
						if(background.price !== bg.price) 	background.price = bg.price;
						if(background.dev !== bg.dev) 		background.dev = bg.dev;
						if(background.staff !== bg.staff) 	background.staff = bg.staff;
						if(background.nitro !== bg.nitro) 	background.nitro = bg.nitro;
					}
				});
			}
		});
	}

}