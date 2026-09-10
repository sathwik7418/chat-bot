require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testGroq() {
  try {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "user",
          content: "Say hello and introduce yourself in one sentence.",
        },
      ],
    });

    console.log("AI RESPONSE:");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("ERROR:");
    console.error(error.message);
  }
}

testGroq();