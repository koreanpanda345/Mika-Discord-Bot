const Mika = require("../Mika");


module.exports = class EventBase {
    /**
     * 
     * @param {Mika} client 
     * @param {string} name
     */
    constructor(client, name) {
        this.client = client;
        this.name = name;
    }
    /**
     * 
     * @param  {...any} args 
     */
    invoke(...args) { }
};