const { routeTool } = require("./intelligence/toolRouter");

const testCases = [
  {
    intent: "PRICE",
    commodity: "tomato",
  },
  {
    intent: "LOWEST_PRICE",
    commodity: "onion",
  },
  {
    intent: "HIGHEST_PRICE",
    commodity: "potato",
  },
  {
    intent: "COMPARE_PRICE",
    commodity: "tomato",
  },
  {
    intent: "GENERAL",
    commodity: null,
  },
];

for (const understanding of testCases) {
  const tool = routeTool(understanding);

  console.log(
    understanding.intent,
    "→",
    tool
  );
}