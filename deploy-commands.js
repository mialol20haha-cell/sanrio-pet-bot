const { REST, Routes, SlashCommandBuilder } = require("discord.js");
require("dotenv").config();

const commands = [
  new SlashCommandBuilder().setName("hatch").setDescription("Hatch your Sanrio egg"),
  new SlashCommandBuilder().setName("feed").setDescription("Feed your pet"),
  new SlashCommandBuilder().setName("pet").setDescription("Pet your friend"),
  new SlashCommandBuilder().setName("profile").setDescription("Check your pet stats")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationCommands("YOUR_BOT_ID"),
      { body: commands }
    );

    console.log("Commands registered!");
  } catch (error) {
    console.error(error);
  }
})();
