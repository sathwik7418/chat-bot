function routeTool(understanding) {
  const { intent } = understanding;

  switch (intent) {
    case "PRICE":
    case "LOWEST_PRICE":
    case "HIGHEST_PRICE":
    case "COMPARE_PRICE":
      return "MANDI";

    case "WEATHER":
      return "WEATHER";

    case "CROP":
      return "CROP";

    case "GENERAL":
    default:
      return "GENERAL";
  }
}


module.exports = {
  routeTool,
};