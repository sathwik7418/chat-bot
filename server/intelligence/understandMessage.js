const {
  analyzeMandiQuestion,
} = require("../utils/mandiQueryAnalyzer");

const {
  fuzzyFindCommodityInText,
  fuzzyFindDistrictInText,
} = require("./fuzzyMatcher");


function understandMessage(message) {
  // 1. First use the existing exact analyzer
  const exact = analyzeMandiQuestion(message);

  let commodity = exact.commodity;
  let district = exact.district;

  // 2. If exact commodity was not found, try fuzzy matching
  if (!commodity) {
    const fuzzyCommodity = fuzzyFindCommodityInText(message);

    if (fuzzyCommodity) {
      commodity = fuzzyCommodity.commodity;
    }
  }

  // 3. If exact district was not found, try fuzzy matching
  if (!district) {
    const fuzzyDistrict = fuzzyFindDistrictInText(message);

    if (fuzzyDistrict) {
      district = fuzzyDistrict.district;
    }
  }

  // 4. Return the final understanding
  return {
    intent: exact.intent,
    commodity,
    district,
    date: exact.date,
    dateType: exact.dateType,
  };
}


module.exports = {
  understandMessage,
};