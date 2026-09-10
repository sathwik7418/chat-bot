const {
  analyzeMandiQuestion,
} = require("../utils/mandiQueryAnalyzer");

const {
  fuzzyFindCommodityInText,
  fuzzyFindDistrictInText,
} = require("./fuzzyMatcher");


function extractUnderstandingFromMessage(content) {
  if (!content || typeof content !== "string") {
    return null;
  }

  const exact = analyzeMandiQuestion(content);

  let commodity = exact.commodity;
  let district = exact.district;

  if (!commodity) {
    const fuzzyCommodity =
      fuzzyFindCommodityInText(content);

    if (fuzzyCommodity) {
      commodity = fuzzyCommodity.commodity;
    }
  }

  if (!district) {
    const fuzzyDistrict =
      fuzzyFindDistrictInText(content);

    if (fuzzyDistrict) {
      district = fuzzyDistrict.district;
    }
  }

  return {
    intent: exact.intent,
    commodity,
    district,
    date: exact.date,
    dateType: exact.dateType,
  };
}


function resolveContext(
  currentUnderstanding,
  history = []
) {
  const resolved = {
    ...currentUnderstanding,
  };

  /*
   * Search previous USER messages from newest
   * to oldest.
   *
   * We intentionally use user messages rather than
   * Milo's answers because Milo's answer may mention
   * multiple commodities or districts.
   */

  const previousMessages = Array.isArray(history)
    ? [...history]
        .reverse()
        .filter(
          (item) =>
            item &&
            item.role === "user" &&
            typeof item.content === "string"
        )
    : [];


  for (const item of previousMessages) {
    const previous =
      extractUnderstandingFromMessage(
        item.content
      );
      console.log(
  "Previous context:",
  item.content,
  "→",
  previous
);

    if (!previous) {
      continue;
    }


    /*
     * Only inherit missing information.
     *
     * Current user input always has priority.
     */

    if (
      !resolved.commodity &&
      previous.commodity
    ) {
      resolved.commodity =
        previous.commodity;
    }


    if (
      !resolved.district &&
      previous.district
    ) {
      resolved.district =
        previous.district;
    }


    if (
      !resolved.date &&
      previous.date
    ) {
      resolved.date =
        previous.date;

      resolved.dateType =
        previous.dateType;
    }


    if (
      resolved.intent === "GENERAL" &&
      previous.intent !== "GENERAL"
    ) {
      resolved.intent =
        previous.intent;
    }


    /*
     * Stop once we have enough context.
     */

    if (
      resolved.commodity &&
      resolved.district &&
      resolved.date
    ) {
      break;
    }
  }


  return resolved;
}


module.exports = {
  resolveContext,
};