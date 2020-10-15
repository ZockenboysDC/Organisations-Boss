const {
    Client
} = require("discord.js");
const { token, prefix } = require("./config.json")
const {
    readdirSync
} = require("fs");
const updatePresence = require("./updatePresence");
const {
    join
} = require("path");

const client = new Client({
    disableMentions: "everyone"
});

client.on("ready", () => {
    console.log("----Bot ready----");
    setInterval(() => {
        updatePresence(client);
    }, 1080000);
});

client.on("message", (msg) => {
    if (msg.author == client.user.username || msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    if (!msg.guild) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();

    switch (cmdName) {
        case "h":
        case "help":
            msg.reply("test");
            break;
    }
});

client.login(token);