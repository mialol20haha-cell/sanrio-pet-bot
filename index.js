const { REST, Routes, SlashCommandBuilder } = require("discord.js");
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
require("dotenv").config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// 🐾 Simple in-memory storage (später upgraden wir auf DB)
const users = {};

// 🥚 Sanrio Pets
const pets = [
  "Hello Kitty",
  "Kuromi",
  "My Melody",
  "Cinnamoroll",
  "Pompompurin",
  "Keroppi",
  "Pochacco"
];

// ✨ Random function
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 🟢 Bot ready
client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const commands = [
    {
      name: "hatch",
      description: "Hatch a Sanrio egg"
    },
    {
      name: "feed",
      description: "Feed your pet"
    },
    {
      name: "pet",
      description: "Pet your Sanrio friend"
    },
    {
      name: "profile",
      description: "Check your pet stats"
    }
  ];

  const { REST, Routes } = require("discord.js");
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands }
    );

    console.log("Slash commands registered!");
  } catch (error) {
    console.error(error);
  }
});

// 🥚 Slash Commands
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const userId = interaction.user.id;

  if (!users[userId]) {
    users[userId] = {
      pet: null,
      hunger: 100,
      happiness: 100,
      stage: "Egg"
    };
  }

  const user = users[userId];

  // 🥚 HATCH
  if (interaction.commandName === "hatch") {
    if (user.pet) {
      return interaction.reply("❌ You already have a pet!");
    }

    user.pet = random(pets);
    user.stage = "Baby";

    return interaction.reply(`🥚 Your egg hatched! You got **${user.pet}**!`);
  }

  // 🍖 FEED
  if (interaction.commandName === "feed") {
    if (!user.pet) return interaction.reply("❌ You have no pet!");

    user.hunger = Math.min(100, user.hunger + 20);

    return interaction.reply(`🍖 You fed **${user.pet}**! Hunger is now ${user.hunger}%`);
  }

  // 🧸 PET
  if (interaction.commandName === "pet") {
    if (!user.pet) return interaction.reply("❌ You have no pet!");

    user.happiness = Math.min(100, user.happiness + 15);

    return interaction.reply(`💖 You petted **${user.pet}**! Happiness is now ${user.happiness}%`);
  }

  // 📊 PROFILE
  if (interaction.commandName === "profile") {
    if (!user.pet) return interaction.reply("❌ You have no pet!");

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.username}'s Pet`)
      .setDescription(`🐾 **${user.pet}**`)
      .addFields(
        { name: "Stage", value: user.stage, inline: true },
        { name: "Hunger", value: `${user.hunger}%`, inline: true },
        { name: "Happiness", value: `${user.happiness}%`, inline: true }
      )
      .setColor("Pink");

    return interaction.reply({ embeds: [embed] });
  }
});

// 🔑 Login
client.login(process.env.TOKEN);
