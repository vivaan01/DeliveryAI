const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getIntent = async (text) => {
  if (!text || text.trim() === '') {
    return 'UNSURE';
  }

  const systemPrompt = `You are an intent classification expert for a delivery service. Your task is to classify the user's response into one of the following categories: AVAILABLE, NOT_AVAILABLE, OUT_OF_LOCATION, UNSURE. The user was asked if they are available to receive a delivery. Respond with only one of the category names and nothing else.
  
  Examples:
  - "Yes, I am here." -> AVAILABLE
  - "Yeah, I'm available." -> AVAILABLE
  - "I am not at home right now." -> NOT_AVAILABLE
  - "Can you come back in 15 minutes?" -> NOT_AVAILABLE
  - "I'm at the office." -> OUT_OF_LOCATION
  - "I am not there." -> OUT_OF_LOCATION
  - "What is this about?" -> UNSURE
  - "banana" -> UNSURE
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      temperature: 0,
      max_tokens: 10,
    });

    const intent = response.choices[0].message.content.trim().toUpperCase();
    
    // Validate the intent
    const validIntents = ['AVAILABLE', 'NOT_AVAILABLE', 'OUT_OF_LOCATION', 'UNSURE'];
    if (validIntents.includes(intent)) {
        return intent;
    }

    return 'UNSURE'; // Default if the response is not one of the valid intents

  } catch (error) {
    console.error('Error getting intent from OpenAI:', error);
    return 'UNSURE'; // Return a default intent in case of an error
  }
};

module.exports = {
  getIntent,
}; 