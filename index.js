const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,            // Slash commands
    GatewayIntentBits.GuildMessages,     // Mensajes en canales
    GatewayIntentBits.MessageContent     // Contenido de los mensajes
  ]
});

client.commands = new Collection();

// 📦 Cargar comandos desde /commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(`[ADVERTENCIA] El comando en ${file} no tiene data o execute.`);
  }
}

// 🔁 Cargar eventos desde /events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

// 🛡️ Este bloque ya no es necesario si interactionCreate se maneja en /events
// Puedes eliminarlo si tienes events/interactionCreate.js:
///*
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(`❌ Error ejecutando /${interaction.commandName}:`, error);
    await interaction.reply({
      content: '⚠️ Hubo un error al ejecutar este comando.',
      ephemeral: true,
    });
  }
});
//*/

// 🚀 Iniciar sesión
console.log("Token desde .env:", process.env.DISCORD_TOKEN); // <--- DEBUG
client.login(process.env.DISCORD_TOKEN);
