"use strict";

const { Client, Events, GatewayIntentBits } = require("discord.js");
const utils = require("./utils.js");
require("dotenv").config();

// Initialize Discord client

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const prefix = process.env.prefix ?? "!";

client.on(Events.ClientReady, () => {
    console.log(`${client.user?.tag} is now online`);
});

class CountablesMessage {
    constructor(userId, count, message) {
        this.userId = userId;
        this.count = count;
        this.message = message;
    }

    increment() {
        this.count++;
    }
}

let countables = [];
let briCounter = [];

client.on(Events.MessageCreate, async (message) => {
    if (message.author.id === client.user.id) return;
    if (message.content.startsWith(prefix)) {
        console.log("I got the following message: " + message.content);

        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const authorId = message.author.id;

        // @ts-ignore
        const command = args.shift().toLowerCase();

        console.log("Got command: " + command);
        console.log("Got args: " + args);

        const mentionedUserId =
            args.length > 0 ? utils.trimIds(args[0]) : undefined;

        console.log(mentionedUserId);

        if (command === "ping") {
            await message.channel.send("pong!");
        }

        if (mentionedUserId) {
            const user = mentionedUserId
                ? await client.users.fetch(mentionedUserId).catch(() => null)
                : null;
            const commando = args[1] ?? undefined;
            if (command === "count" && user !== null && commando !== undefined) {
                let countableUser = countables.find(
                    (countable) => countable.userId === user.id && countable.message === commando
                );
                if (!countableUser) {
                    countables.push(new CountablesMessage(user.id, 1, commando));
                    countableUser = countables.find(
                        (countable) => countable.userId === user.id && countable.message === commando
                    );
                } else {
                    countableUser.increment();
                }
                await message.channel.send(
                    user.tag +
                    " has said " +
                    commando +
                    " " +
                    countableUser.count +
                    " times."
                );
            } else if (command === "briCounter" && user !== null) {
                let countableUser = countables.find(
                    (countable) =>
                        countable.userId === user.id && countable.message === "bri"
                );
                if (!countableUser) {
                    countables.push(new CountablesMessage(user.id, 1, commando));
                    countableUser = countables.find(
                        (countable) =>
                            countable.userId === user.id && countable.message === "bri"
                    );
                } else {
                    countableUser.increment();
                }
                await message.channel.send(
                    user.tag + " has said bri " + countableUser.count + " times."
                );
            }
        }
    }

    if (message.content.toLowerCase().includes("bri") && !message.content.toLowerCase().includes("!briCounter")) {
        let briCounterUser = briCounter.find(
            (user) => user.userId == message.author.id && user.message === "bri"
        );
        if (!briCounterUser) {
            briCounter.push(new CountablesMessage(message.author.id, 1, "bri"));
            briCounterUser = briCounter.find(
                (user) => user.userId == message.author.id && user.message === "bri"
            );
        } else {
            briCounterUser.increment();
        }
        console.log();
        await message.channel.send(
            message.author.tag + " has said bri " + briCounterUser.count + " times."
        );
    }
});

client.login(process.env.CLIENT_TOKEN);
