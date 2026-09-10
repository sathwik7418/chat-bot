const { understandMessage } = require("./intelligence/understandMessage");

const testMessages = [
  "what is tomato price?",
  "what is tomatto price?",
  "what is oninos price?",
  "bhai hyd lo tomatto rate entha",
  "what is potato price in hyderbad?",
  "tell me onion rate today",
];

for (const message of testMessages) {
  const result = understandMessage(message);

  console.log("\nMessage:", message);
  console.log("Understanding:", result);
}