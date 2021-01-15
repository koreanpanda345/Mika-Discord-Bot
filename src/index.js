require("dotenv").config();
const Mika = require("./Mika");
const client = new Mika();

const init = () =>
{
	client.loadFiles();
	client.login(process.env.BOT_TOKEN);
};

init();