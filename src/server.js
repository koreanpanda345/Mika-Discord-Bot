const express = require("express");
const server = express();
const url = require("url");
const path = require("path");
const passport = require("passport");
const passportDiscord = require("passport-discord");
const Strategy = passportDiscord.Strategy;

module.exports = {keepAlive};
server.all("/", (req, res) =>
{
  res.send("OK");
})
function keepAlive()
{
  server.listen(3000, () => console.log("Server is ready!"));
}