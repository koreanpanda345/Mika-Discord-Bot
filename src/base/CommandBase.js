const Mika = require("../Mika");
const CommandContextBase = require("./CommandContextBase");


module.exports = class CommandBase {
    /**
     * 
     * @param {Mika} client 
     * @param {{name: string, aliases: string[], args: {name: string, type: string, description: string, required: boolean}[], description: string, usage: string[], category: string, enabled: boolean, userPermissions: import("discord.js").PermissionString[], selfPermissions: import("discord.js").PermissionString, preconditions: Function[]}} param1 
     */
    constructor(client, {
        name,
        aliases = new Array(),
        args = new Array(),
        description = "",
        usage = new Array(),
        category = "",
        enabled = true,
        userPermissions = new Array(),
        selfPermissions = new Array(),
        preconditions = [
            (ctx) => {
                return true;
            }
        ]
    }) {
        this.client = client;
        this.props = { name, aliases, args, description, usage, category, enabled };
        this.permissions = { user: userPermissions, self: selfPermissions };
        this.preconditions = preconditions;
    }
    /**
     * 
     * @param {CommandContextBase} ctx 
     */
    invoke(ctx) { }
}