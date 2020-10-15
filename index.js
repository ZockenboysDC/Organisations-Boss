const {
    Client, MessageEmbed
} = require("discord.js");
const { token, prefix } = require("./config.json");
const updatePresence = require("./updatePresence");
const db = require("quick.db");
const AsciiTable = require("ascii-table");

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

    const channelData = db.get(`${msg.guild.id}.${msg.channel.id}`);

    if (!channelData) db.set(`${msg.guild.id}.${msg.channel.id}`, []);

    switch (cmdName) {
        // Shows all commands
        case "h":
        case "help":
            msg.reply("test");
            break;

        // Shows all Tasks which are finished
        case "d":
        case "done":
            let tasksd = db.get(`${msg.guild.id}.${msg.channel.id}`);
            if (tasksd == []) {
                return msg.reply("There are no finished tasks.");
            } else {
                let text = "";
                for (let i = 0; i < tasksd.length; i++) {
                    if (tasksd[i] == null || tasksd[i].done == false) continue;
                    text += "- " + tasksd[i].name + "\n";
                }
                if (text === "") return msg.reply("There are no finished tasks.");
                msg.channel.send(new MessageEmbed().setDescription(text).setTitle("Tasks which are already done."));
            }
            break;

        // Shows all Tasks that are not finished
        case "u":
        case "undone":
            let tasksu = db.get(`${msg.guild.id}.${msg.channel.id}`);
            if (tasksu == []) {
                return msg.reply("There are no unfinished tasks.");
            } else {
                let text = "";
                for (let i = 0; i < tasksu.length; i++) {
                    if (tasksu[i] == null || tasksu[i].done == true) continue;
                    text += "- " + tasksu[i].name + "\n";
                }
                if (text === "") return msg.reply("There are no unfinished tasks.");
                msg.channel.send(new MessageEmbed().setDescription(text).setTitle("Tasks which need to be done."));
            }
            break;

        // Adds a new Task
        // Format: add <Name>
        case "a":
        case "add":
            if (!args[0]) {
                return msg.reply("You need to specify a name for the task");
            }
            let oldData = db.get(`${msg.guild.id}.${msg.channel.id}`);
            for (let x = 0; x < oldData.length; x++) {
                if (oldData[x] == null) continue;
                if (oldData[x].name === args.join(' ')) {
                    msg.reply("Already added");
                    return;
                }
            }
            db.push(`${msg.guild.id}.${msg.channel.id}`, { "name": args.join(' '), "authorID": msg.author.id, "done": false });
            msg.channel.send(new MessageEmbed().setDescription("Added the Task: " + args.join(' ')));
            break;

        // Removes a Task
        // Foramt: remove <Name>
        // Permission: Should only be done by the one Person who added the command or Administrators
        case "r":
        case "remove":
            if (!args[0]) {
                return msg.reply("You need to specify the name of the task you want to delete.");
            }
            let data = db.get(`${msg.guild.id}.${msg.channel.id}`);
            for (let x = 0; x < data.length; x++) {
                if (data[x] == null) continue;
                if (data[x].name === args.join(' ')) {
                    db.delete(`${msg.guild.id}.${msg.channel.id}.${x}`);
                    msg.reply(data[x].name + " was removed")
                    return;
                }
            }
            msg.reply("Couldn't be found");
            break;

        // Marks a Task as finsihed or unfinished
        case "t":
        case "toggle":
            break;

        // Shows all commands disregarding of finished or not
        case "":
            let tasks = db.get(`${msg.guild.id}.${msg.channel.id}`);
            if (tasks == []) {
                return msg.reply("There are no tasks created for this channel yet.");
            } else {
                let table = new AsciiTable(`Tasks in ${msg.channel.name}`);
                table.setHeading('Name', 'done');
                for (let i = 0; i < tasks.length; i++) {
                    if (tasks[i] == null) continue;
                    table.addRow(tasks[i].name, tasks[i].done ? "x" : "");
                }
                msg.channel.send(new MessageEmbed().setDescription("```" + table + "```"));
            }
            break;
        default:
            msg.reply("This is not a valid command. Pls see: `" + prefix + " help` for all commands");
            break;
    }
});

client.login(token);