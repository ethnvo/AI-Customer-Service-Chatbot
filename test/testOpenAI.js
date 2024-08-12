const OpenAI = require('openai');
require('dotenv').config({ path: '../.env.local' }); // Adjust the path according to your file's location

// Log the API key to verify it's being loaded
const apiKey = process.env.OPENAI_API_KEY;
console.log('API Key:', apiKey);

if (!apiKey) {
  console.error('API key is undefined. Please check your .env file.');
  process.exit(1); // Exit the script if the API key is not found
}

// Initialize the OpenAI client with the API key
const openai = new OpenAI({ apiKey });

async function testOpenAI() {
  try {
    console.log('--- Testing Simple Completion ---');
    const simpleCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'Tell me a joke.' }],
    });
    console.log('Simple Completion Response:', simpleCompletion.choices[0].message.content);

    console.log('--- Testing Completion with Streaming ---');
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: 'What is the capital of France?' }],
      stream: true,
    });

    // Handle the streaming response
    for await (const part of completion) {
      const content = part.choices[0].delta.content;
      if (content) {
        process.stdout.write(content); // Print the response as it's streamed
      }
    }

    console.log('\n--- Testing Completion with Longer Prompt ---');
    const longPromptCompletion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Can you explain how AI works?' },
      ],
    });
    console.log('Long Prompt Completion Response:', longPromptCompletion.choices[0].message.content);

  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the test
testOpenAI();
