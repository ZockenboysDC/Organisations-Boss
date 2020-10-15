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
        // Shows all commands
        case "h":
        case "help":
            msg.reply("test");
            break;

        // Shows all Tasks which are finished
        case "d":
        case "done":
            break;

        // Shows all Tasks that are not finished
        case "u":
        case "undone":
            break;

        // Adds a new Task
        // Format: add <Name> |description|
        case "a":
        case "add":
            break;

        // Removes a Task
        // Foramt: remove <Name>
        // Permission: Should only be done by the one Person who added the command or Administrators
        case "r":
        case "remove":
            break;

        // Marks a Task as finsihed or unfinished
        case "t":
        case "toggle":
            break;

        // Shows all commands disregarding of finished or not
        case "":
            break;
        default:
            msg.reply("This is not a valid command. Pls see: `" + prefix + " help` for all commands");
            break;
    }
});

client.login(token);