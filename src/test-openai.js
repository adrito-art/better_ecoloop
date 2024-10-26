require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

(async () => {
  try {
    const response = await openai.listModels();
    console.log("OpenAI API is working. Available models:", response.data);
  } catch (error) {
    console.error("Error testing OpenAI API:", error);
  }
})();

