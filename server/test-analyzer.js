const {
  analyzeMandiQuestion,
} = require("./utils/mandiQueryAnalyzer");

const questions = [
  "what is tomato price",

  "which market has the cheapest tomato?",

  "where can I get the highest tomato price?",

  "what is tomato price in Hyderabad?",

  "what is onion price in Sircilla?",

  "what is potato rate in hyd?",

  "cheapest brinjal in Nalgonda",

  "highest onion price in Karimnagar",

  "compare tomato prices in Hyderabad",

  "what is the price of green chillies in Warangal",
];


for (const question of questions) {
  console.log("\nQuestion:", question);

  console.log(
    analyzeMandiQuestion(question)
  );
}