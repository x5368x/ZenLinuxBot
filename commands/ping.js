const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Mide la latencia del bot y la API de Discord.'),
  
  async execute(interaction) {
    // Tiempo en que se recibe la interacción
    const sentTimestamp = Date.now();

    // Enviar mensaje provisional
    const reply = await interaction.reply({ content: '🏓 Pinging...', fetchReply: true });

    // Calcular latencia bot = diferencia de tiempo entre mensaje enviado y recibido
    const botLatency = reply.createdTimestamp - sentTimestamp;

    // Latencia API websocket
    const apiLatency = interaction.client.ws.ping;

    // Construir embed bonito
    const embed = new EmbedBuilder()
      .setColor('#3464eb')
      .setTitle('🏓 Pong!')
      .addFields(
        { name: 'Latencia del bot', value: `${botLatency} ms`, inline: true },
        { name: 'Latencia API Discord', value: `${apiLatency} ms`, inline: true }
      )
      .setFooter({ text: 'ZenLinuxBot | Medición de latencia' })
      .setTimestamp();

    // Editar respuesta con embed
    await interaction.editReply({ content: null, embeds: [embed] });
  },
};
