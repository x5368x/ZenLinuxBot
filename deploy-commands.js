require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [];

// Lee todos los comandos desde la carpeta commands/
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[ADVERTENCIA] El comando en ${filePath} no tiene una propiedad 'data' o 'execute'.`);
  }
}

const rest = new REST().setToken(token);

// Registro de comandos solo en un servidor (GUILD)
(async () => {
  try {
    console.log(`🔁 Actualizando ${commands.length} comandos de aplicación (GUILD)...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log(`✅ Comandos actualizados correctamente.`);
  } catch (error) {
    console.error('❌ Error al registrar los comandos:', error);
  }
})();

