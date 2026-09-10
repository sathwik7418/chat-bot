const {
  analyzeMandiQuestion,
} = require("./utils/mandiQueryAnalyzer");

const tests = [
  "what is onion price",
  "what is onion price today",
  "what was onion price yesterday",
  "what was onion price the day before yesterday",
  "what was onion price on 09/09/2026",
  "what was onion price on 9/9/2026",
  "what was onion price on 2026-09-09",
  "what was onion price on September 9 2026",
  "what was onion price on September 9",
  "what was onion price on 9 September 2026",
  "what was onion price in Hyderabad yesterday",
  "which market had the cheapest onion yesterday",
  "highest tomato price in Nalgonda on 09/09/2026",
];

for (const question of tests) {
  console.log(
    "\nQUESTION:",
    question
  );

  console.log(
    analyzeMandiQuestion(
      question
    )
  );
}