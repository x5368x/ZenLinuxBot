// utils/aiService.js
const axios = require('axios');

// Securely load the API key from environment variables.
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

/**
 * Communicates with the OpenRouter API to get a response from a specified AI model.
 *
 * @param {string} prompt The user-provided prompt to send to the AI.
 * @param {string} model The identifier for the AI model to be used (e.g., 'openai/gpt-4o').
 * @throws {Error} Throws an error if the API call fails, which can be caught by the command handler.
 * @returns {Promise<string|null>} A promise that resolves to the AI's text response, or null if no response is generated.
 */
async function askAI(prompt, model) {
  if (!OPENROUTER_API_KEY) {
    console.error("CRITICAL: OPENROUTER_API_KEY is not defined in the .env file.");
    throw new Error('Server configuration error: Missing API Key.');
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          // Optional headers to help OpenRouter identify your application, which is good practice.
          'HTTP-Referer': process.env.PROJECT_URL || '', // e.g., your bot's website or GitHub repo
          'X-Title': process.env.PROJECT_NAME || 'Discord AI Bot', // e.g., your bot's name
        },
      }
    );

    // Safely access the response content.
    return response.data?.choices?.[0]?.message?.content || null;
  } catch (error) {
    // Log the detailed error for debugging purposes.
    console.error(`API Error with model ${model}:`, error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    // Re-throw the error so the command's catch block can handle it and inform the user.
    throw error;
  }
}

module.exports = { askAI };