require("dotenv").config();
const Mika = require("./Mika");
const client = new Mika();
const {keepAlive} = require("./server");
const MongoBase = require("./base/MongoBase");
const mongoDb = new MongoBase();
const init = async () =>
{
    //await mongoDb.syncBackgroundDatabase();
    keepAlive();
	client.loadFiles();
	client.login(process.env.BOT_TOKEN);
};

process.on("unhandledRejection", (err) =>
{
  console.error(err);
});

init();