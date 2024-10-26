require('dotenv').config();
const cohere = require('cohere-ai');

cohere.init(process.env.COHERE_API_KEY);

(async () => {
  try {
    const response = await cohere.generate({
      model: 'command-xlarge-2023',
      prompt: 'Write a short motivational message.',
      max_tokens: 50,
    });

    console.log('Generated Text:', response.body.generations[0].text);
  } catch (error) {
    console.error('Error:', error.message);
  }
})();

