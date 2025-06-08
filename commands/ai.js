// commands/ai.js
const { SlashCommandBuilder, EmbedBuilder, Interaction } = require('discord.js');
const { askAI } = require('../utils/aiService');

// Load the default model from environment variables.
// IMPORTANT: Make sure this model is one that works for you!
const DEFAULT_MODEL = process.env.DEFAULT_AI_MODEL || 'google/gemini-flash-1.5';

module.exports = {
  /**
   * @type {SlashCommandBuilder}
   */
  data: new SlashCommandBuilder()
    .setName('ai')
    .setDescription('Ask a question to an AI model.')
    .addStringOption(option =>
      option.setName('prompt')
        .setDescription('The question you want to ask.')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('model')
        .setDescription('Optional: Choose a specific AI model.')
        .setRequired(false)
        .addChoices(
          // --- CHOICES UPDATED AS REQUESTED ---
          { name: 'Gemini 1.5 Flash (Google)', value: 'google/gemini-flash-1.5' },
          { name: 'Llama 3 70B (Meta)', value: 'meta-llama/llama-3-70b-instruct' }
        )),

  /**
   * @param {Interaction} interaction
   */
  async execute(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString('prompt');
    const model = interaction.options.getString('model') ?? DEFAULT_MODEL;

    try {
      const responseText = await askAI(prompt, model);

      if (!responseText) {
        const noResponseEmbed = new EmbedBuilder()
          .setColor(0xFFA500) // Orange
          .setTitle('No Response')
          .setDescription('The AI processed the request but did not generate a response. This may be due to content filters or an empty reply.');
        await interaction.editReply({ embeds: [noResponseEmbed] });
        return;
      }

      const responseEmbed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setAuthor({ name: 'ZenLinux AI', iconURL: 'https://i.imgur.com/bB58Ak3.png' })
        .setTitle('AI Response')
        .addFields({ name: 'Your Prompt', value: `> ${prompt.substring(0, 1020)}` })
        .setDescription(responseText)
        .setFooter({
          text: `Requested by ${interaction.user.tag} • Model: ${model}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp();

      await interaction.editReply({ embeds: [responseEmbed] });

    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle('API Request Failed')
        .setDescription('I was unable to get a response from the AI service. Please try again later.');

      await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};