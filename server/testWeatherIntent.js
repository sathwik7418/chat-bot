const {
  analyzeMandiQuestion,
} = require("./utils/mandiQueryAnalyzer");

const tests = [
  "what is the weather in Hyderabad?",
  "will it rain tomorrow?",
  "temperature in Hyderabad",
  "hyd lo weather ela undi",
  "what is tomato price?",
  "tomato rate in Hyderabad",
];

for (const message of tests) {
  console.log("\nUser:", message);
  console.log(
    analyzeMandiQuestion(message)
  );
}