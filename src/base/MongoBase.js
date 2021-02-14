const mongoose = require("mongoose");
const UserSchema = require("./schema/UserSchema");
const AfkSchema = require("./schema/AfkSchema");
const BackgroundSchema = require("./schema/BackgroundSchema");
const ProfileSchema = require("./schema/ProfileSchema");
const CooldownSchema = require("./schema/CooldownSchema");
const BackgroundShop = require("../database/airtable/BackgroundShop");
const BlacklistSchema = require("./schema/BlacklistSchema");
const RpgSchema = require("./schema/RpgSchema");
mongoose.connect(process.env.MONGO_CONNECTION_STRING + "Data", { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = class MongoBase
{
	constructor()
	{
		this.mongoose = mongoose;
		this.schemas = {
			afk: AfkSchema,
			background: BackgroundSchema,
			profile: ProfileSchema,
			cooldown: CooldownSchema,
			backgroundShop: BackgroundShop,
			blacklist: BlacklistSchema,
			user: UserSchema,
			rpg: RpgSchema
		};
	}
};

// module.exports = class MongoBase
// {
//     constructor()
//     {

//     }

//     async isUserBlacklisted(userId)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             BlacklistSchema.findOne({userId: userId}, (err, user) =>
//             {
//                 if(!user) return resolve(false);
//                 return resole(user);
//             })
//         })

//         return result;
//     }

//     async getBlackList()
//     {
//         let result = await new Promise((resolve) =>
//         {
//             BlacklistSchema.find({}, (err, list) =>
//             {
//                 return resolve(list);
//             });
//         });
//         return result;
//     }

//     async removeUserFromBlacklist(userId)
//     {
//         BlacklistSchema.deleteOne({userId: userId}, (err) =>
//         {
//             if(err) console.error();
//             console.log("Success");
//         })
//     }

//     async addUserToBlacklist(userId)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             BlacklistSchema.findOne({userId: userId}, (err, user) =>
//             {
//                 if(!user)
//                 {
//                     const newUser = new BlacklistSchema({
//                         userId: userId,
//                         banned: false
//                     });

//                     newUser.save().catch(err => console.error(err));
//                     return resolve(true);
//                 }

//                 return resolve(true);
//             })
//         })
//         return result;
//     }

//     async bannedUser(userId)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             BlacklistSchema.findOne({userId: userId}, (err, user) =>
//             {
//                 if(!user) return resolve(false);
//                 user.banned = true;
//                 user.save().catch(err => console.error(err));
//                 return resolve(true);
//             });
//         });

//         return result;
//     }

//     /**
//      * @param {string} userId
//      */
//     async getUserData(userId)
//     {
//         let result = await new Promise((resolve, reject) =>
//         {
//         UserSchema.findOne({userId: userId}, (err, user) =>
//         {
//             if(!user)
//             {
//                 const newUser = new UserSchema({
//                     userId: userId,
//                     xp: 0,
//                     lvl: 1,
//                     balance: 200,
//                     username: ""
//                 });


//                 newUser.save().catch(err => console.error(err));
//                 return resolve(newUser);
//             }
//             return resolve(user);
//         })
//         })

//         return result;
//     }

//     async updateUserData(userId, callback)
//     {
//         let result = await new Promise((resolve, reject) =>
//         {
//         UserSchema.findOne({userId: userId}, (err, user) =>
//         {
//             if(!user)
//             {
//                 const newUser = new UserSchema({
//                     userId: userId,
//                     xp: 0,
//                     lvl: 1,
//                     balance: 200,
//                     username: ""
//                 });
//                 return resolve(callback(newUser));
//             }
//             else return resolve(callback(user));
//         });
//         })
//         return result;
//     }
//     async getAfk(userId)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             AfkSchema.findOne({userId: userId}, (err, user) =>
//             {
//                 if(!user) return resolve(false);
//                 return resolve(user);
//             });
//         });

//         return result;
//     }

//     async updateAfk(userId, callback)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             AfkSchema.findOne({userId: userId}, (err, user) =>
//             {
//                 if(!user)
//                 {
//                     const newAfk = new AfkSchema({
//                         userId: userId,
//                         reason: "AFK",
//                         pings: []
//                     });
//                     return resolve(callback(newAfk));
//                 }
//                 else return resolve(callback(user));
//             });
//         });

//         return result;
//     }

//     deleteAfk(userId)
//     {
//         AfkSchema.deleteOne({userId: userId}, (err) =>
//         {
//             if(err) console.error(err);
//             console.log("Success");
//         })
//     }

//     async getAllBackgrounds()
//     {
//         let result = await new Promise((resolve) =>
//         {
//             BackgroundSchema.find({}, (err, backgrounds) =>
//             {
//                 return resolve(backgrounds);
//             });
//         });
//         return result;
//     }

//     async getBackgrounds(id)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             BackgroundSchema.findOne({id: id}, (err, bg) =>
//             {
//                 if(!bg) return resolve(false);
//                 if(err) console.error(err);
//                 return resolve(bg);
//             });
//         });

//         return result;
//     }
//     async getUserBackgrounds(_id)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             BackgroundSchema.findOne({_id: _id}, (err, bg) =>
//             {
//                 if(!bg) return resolve(false);
//                 return resolve(bg);
//             })
//         })
//         return result;
//     }

//     async getProfileAccount(_id)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             UserSchema.findOne({_id: _id}, (err, account) =>
//             {
//                 if(!account) return resolve(false);
//                 return resolve(account);
//             })
//         })

//         return result;
//     }

//     async getProfile(userId)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             ProfileSchema.findOne({userId: userId}, async (err, profile) =>
//             {
//                 if(!profile)
//                 {
//                     const newProfile = new ProfileSchema({
//                         userId: userId,
//                         account: await this.getUserData(userId),
//                         background: (await this.getBackgrounds(1)).url,
//                         own_bg: [await this.getBackgrounds(1)],
//                         votes: 0,
//                         married: "No one",
//                         description: "No Description",
//                         birthday: "Jan, 1st"
//                     });

//                     newProfile.save().catch(err => console.error(err));
//                     return resolve(newProfile);
//                 }

//                 else
//                 {
//                     if(!profile.description) profile.description = "No Description";
//                     if(!profile.birthday) profile.birthday = "Jan, 1st";
//                     profile.save().catch(err => console.error(err));
//                     return resolve(profile);
//                 } 
                
//             });
//         });

//         return result;
//     }

//     async updateProfile(userId, callback)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             ProfileSchema.findOne({userId: userId}, async (err, profile) =>
//             {
//                 if(!profile)
//                 {
//                     const newProfile = new ProfileSchema({
//                         userId: userId,
//                         account: await this.getUserData(userId),
//                         background: (await this.getBackgrounds(1)).url,
//                         own_bg: [await this.getBackgrounds(1)],
//                         votes: 0,
//                         married: "No one"
//                     });

//                     return resolve(callback(newProfile));
//                 }
//                 else return resolve(callback(profile));
//             });
//         });

//         return result;
//     }

//     async getCooldowns(userId)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             CooldownSchema.findOne({userId: userId}, (err, cooldown) =>
//             {
//                 if(!cooldown) return resolve(false);
//                 return resolve(cooldown);
//             });
//         });
//         return result;
//     }

//     async updateCooldowns(userId, callback)
//     {
//         let result = await new Promise((resolve) =>
//         {
//             CooldownSchema.findOne({userId: userId}, (err, cooldown) =>
//             {
//                 if(!cooldown)
//                 {
//                     const newCooldown = new CooldownSchema({
//                         userId: userId,
//                         daily: 0,
//                         vote: 0
//                     });

//                     return resolve(callback(newCooldown));
//                 }
//                 else return resolve(callback(cooldown));
//             })
//         })

//         return result;
//     }



//     async syncBackgroundDatabase(backgrounds)
//     {
//         let result = await new Promise(async (resolve) =>
//         {
//             let backgrounds = await new BackgroundShop().getAllOfTheBackgrounds();
        
//             for(let bg of backgrounds)
//             {
//                 BackgroundSchema.findOne({$or: [{id: bg.id}, {name: bg.name}, {url: bg.url}]}, (err, background) =>
//                 {
//                     if(!background)
//                     {
//                         console.debug(bg);
//                         const newBg = new BackgroundSchema({
//                             id: bg.id,
//                             name: bg.name,
//                             url: bg.url,
//                             price: bg.price,
//                             dev: bg.dev,
//                             staff: bg.staff,
//                             nitro: bg.nitro
//                         });
//                         newBg.save().catch(err => console.error(err));
//                         console.log(`Created Doc for Background Id: ${bg.id}-Name: ${bg.name}`);
//                     }
//                     else
//                     {
//                         if(background.id !== bg.id) background.id = bg.id;
//                         if(background.name !== bg.name) background.name = bg.name;
//                         if(background.url !== bg.url) background.url = bg.url;
//                         if(background.price !== bg.price) background.price = bg.price;
//                         if(background.dev !== bg.dev) background.dev = bg.dev;
//                         if(background.staff !== bg.staff) background.staff = bg.staff;
//                         if(background.nitro !== bg.nitro) background.nitro = bg.nitro;
                        
//                         background.save().catch(err => console.error(err));
//                         console.log("Loaded Background")
//                     }
//                 })
//             }
//         });
//         return result;
//     }
// };
