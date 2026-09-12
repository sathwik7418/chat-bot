/*
 * ================================================================
 * MANDI QUERY ANALYZER
 * ================================================================
 *
 * Purpose:
 * Understand simple user questions related to:
 *
 * - Mandi / commodity prices
 * - Weather
 *
 * The analyzer does NOT fetch data.
 * It only understands the user's question.
 *
 * ================================================================
 */

/*
 * ------------------------------------------------
 * 1. Commodity aliases
 * ------------------------------------------------
 */

const commodityAliases = {
  tomato: [
    "tomato",
    "tomatoes",
  ],

  potato: [
    "potato",
    "potatoes",
  ],

  onion: [
    "onion",
    "onions",
  ],

  "green chilli": [
    "green chilli",
    "green chillies",
    "green chili",
    "green chilis",
    "chilli",
    "chillies",
    "chili",
    "chilis",
  ],

  "bitter gourd": [
    "bitter gourd",
    "bitter gourds",
    "karela",
  ],

  brinjal: [
    "brinjal",
    "brinjals",
    "eggplant",
    "eggplants",
  ],

  ridgeguard: [
    "ridgeguard",
    "ridge guard",
    "ridge gourd",
    "ridge gourds",
    "turai",
  ],

  pumpkin: [
    "pumpkin",
    "pumpkins",
  ],

  banana: [
    "banana",
    "bananas",
  ],

  drumstick: [
    "drumstick",
    "drumsticks",
    "moringa",
  ],

  carrot: [
    "carrot",
    "carrots",
  ],

  turmeric: [
    "turmeric",
  ],

  paddy: [
    "paddy",
    "paddy rice",
  ],

  rice: [
    "rice",
  ],

  "green gram": [
    "green gram",
    "green grams",
    "moong",
    "moong dal",
    "mung",
    "mung bean",
    "mung beans",
  ],

  "red gram": [
    "red gram",
    "red grams",
    "toor",
    "toor dal",
    "arhar",
    "arhar dal",
  ],

  "cluster beans": [
    "cluster beans",
    "cluster bean",
    "guar",
    "guar beans",
  ],
};

/*
 * ------------------------------------------------
 * 2. District aliases
 * ------------------------------------------------
 */

const districtAliases = {
  hyderabad: [
    "hyderabad",
    "hyd",
  ],

  "ranga reddy": [
    "ranga reddy",
    "rangareddy",
    "ranga reddy district",
  ],

  nalgonda: [
    "nalgonda",
  ],

  mahbubnagar: [
    "mahbubnagar",
    "mahabubnagar",
  ],

  khammam: [
    "khammam",
  ],

  warangal: [
    "warangal",
  ],

  siddipet: [
    "siddipet",
  ],

  adilabad: [
    "adilabad",
  ],

  nagarkurnool: [
    "nagarkurnool",
    "nagarkurnool district",
  ],

  sircilla: [
    "sircilla",
    "siricilla",
    "rajanna sircilla",
    "rajanna siricilla",
  ],

  karimnagar: [
    "karimnagar",
  ],

  nizamabad: [
    "nizamabad",
  ],

  medak: [
    "medak",
  ],

  nirmal: [
    "nirmal",
  ],

  mancherial: [
    "mancherial",
  ],

  sangareddy: [
    "sangareddy",
    "sangareddy district",
  ],

  yadadri_bhuvanagiri: [
    "yadadri",
    "yadadri bhuvanagiri",
    "bhuvanagiri",
  ],

  suryapet: [
    "suryapet",
  ],

  bhadradri_kothagudem: [
    "bhadradri kothagudem",
    "kothagudem",
  ],

  jangaon: [
    "jangaon",
  ],

  jayashankar_bhoopalpally: [
    "jayashankar bhoopalpally",
    "bhupalpally",
  ],

  jogulamba_gadwal: [
    "jogulamba gadwal",
    "gadwal",
  ],

  kumaram_bheem_asifabad: [
    "kumaram bheem asifabad",
    "asifabad",
  ],

  mahabubabad: [
    "mahabubabad",
  ],

  mulugu: [
    "mulugu",
  ],

  narayanpet: [
    "narayanpet",
  ],

  peddapalli: [
    "peddapalli",
  ],

  rajannasircilla: [
    "rajanna sircilla",
    "sircilla",
  ],
};

/*
 * ------------------------------------------------
 * 3. Weather keywords
 * ------------------------------------------------
 */

const weatherKeywords = [
  "weather",
  "rain",
  "raining",
  "rains",
  "rainfall",
  "temperature",
  "temp",
  "forecast",
  "climate",
  "humidity",
  "humid",
  "wind",
  "winds",
  "windy",
  "cloud",
  "cloudy",
  "sunny",
  "sun",
  "hot",
  "cold",
  "heat",
  "storm",
  "storms",
  "thunderstorm",
  "thunder",
  "drizzle",
  "showers",
];

/*
 * ------------------------------------------------
 * 4. Normalize text
 * ------------------------------------------------
 */

function normalizeText(message) {
  return String(message || "")
    .toLowerCase()
    .trim()
    .replace(/[?!.,]/g, " ")
    .replace(/\s+/g, " ");
}

/*
 * ------------------------------------------------
 * 5. Date helpers
 * ------------------------------------------------
 */

function formatDate(date) {
  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getTodayDate() {
  return formatDate(new Date());
}

function getRelativeDate(offset) {
  const date = new Date();

  date.setDate(
    date.getDate() + offset
  );

  return formatDate(date);
}

/*
 * ------------------------------------------------
 * 6. Month names
 * ------------------------------------------------
 */

const monthNames = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

/*
 * ------------------------------------------------
 * 7. Detect date
 * ------------------------------------------------
 */

function detectDate(message) {
  const text = normalizeText(message);

  /*
   * TODAY
   */
  if (
    text.includes("today") ||
    text.includes("todays")
  ) {
    return {
      date: getTodayDate(),
      dateType: "relative",
    };
  }

  /*
   * DAY BEFORE YESTERDAY
   */
  if (
    text.includes("day before yesterday") ||
    text.includes("day before yesterdays")
  ) {
    return {
      date: getRelativeDate(-2),
      dateType: "relative",
    };
  }

  /*
   * YESTERDAY
   */
  if (
    text.includes("yesterday") ||
    text.includes("yesterdays")
  ) {
    return {
      date: getRelativeDate(-1),
      dateType: "relative",
    };
  }

  /*
   * TOMORROW
   */
  if (
    text.includes("tomorrow") ||
    text.includes("tomorrows")
  ) {
    return {
      date: getRelativeDate(1),
      dateType: "relative",
    };
  }

  /*
   * ------------------------------------------------
   * NUMERIC DATE
   *
   * 09/09/2026
   * 9/9/2026
   * 09-09-2026
   * 9-9-2026
   * ------------------------------------------------
   */

  const numericDateMatch = text.match(
    /\b(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})\b/
  );

  if (numericDateMatch) {
    const day = Number(
      numericDateMatch[1]
    );

    const month = Number(
      numericDateMatch[2]
    );

    const year = Number(
      numericDateMatch[3]
    );

    if (
      month >= 1 &&
      month <= 12 &&
      day >= 1 &&
      day <= 31
    ) {
      return {
        date: `${year}-${String(month).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`,

        dateType: "specific",
      };
    }
  }

  /*
   * ------------------------------------------------
   * ISO DATE
   *
   * 2026-09-09
   * ------------------------------------------------
   */

  const isoDateMatch = text.match(
    /\b(\d{4})-(\d{2})-(\d{2})\b/
  );

  if (isoDateMatch) {
    return {
      date: isoDateMatch[0],
      dateType: "specific",
    };
  }

  /*
   * ------------------------------------------------
   * MONTH NAME + DAY + YEAR
   *
   * September 9 2026
   * September 9, 2026
   * ------------------------------------------------
   */

  const monthDateMatch = text.match(
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})(?:\s+(\d{4}))?\b/
  );

  if (monthDateMatch) {
    const monthName =
      monthDateMatch[1];

    const day = Number(
      monthDateMatch[2]
    );

    const year = monthDateMatch[3]
      ? Number(monthDateMatch[3])
      : new Date().getFullYear();

    const month =
      monthNames[monthName];

    if (
      month &&
      day >= 1 &&
      day <= 31
    ) {
      return {
        date: `${year}-${String(month).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`,

        dateType: "specific",
      };
    }
  }

  /*
   * ------------------------------------------------
   * DAY + MONTH NAME
   *
   * 9 September 2026
   * 9 September
   * ------------------------------------------------
   */

  const dayMonthMatch = text.match(
    /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december)(?:\s+(\d{4}))?\b/
  );

  if (dayMonthMatch) {
    const day = Number(
      dayMonthMatch[1]
    );

    const monthName =
      dayMonthMatch[2];

    const year = dayMonthMatch[3]
      ? Number(dayMonthMatch[3])
      : new Date().getFullYear();

    const month =
      monthNames[monthName];

    if (
      month &&
      day >= 1 &&
      day <= 31
    ) {
      return {
        date: `${year}-${String(month).padStart(
          2,
          "0"
        )}-${String(day).padStart(2, "0")}`,

        dateType: "specific",
      };
    }
  }

  /*
   * No date found.
   */

  return {
    date: null,
    dateType: null,
  };
}

/*
 * ------------------------------------------------
 * 8. Detect commodity
 * ------------------------------------------------
 */

function detectCommodity(message) {
  const text = normalizeText(message);

  const entries = Object.entries(
    commodityAliases
  )
    .flatMap(
      ([canonical, aliases]) =>
        aliases.map((alias) => ({
          canonical,
          alias: normalizeText(alias),
        }))
    )
    .sort(
      (a, b) =>
        b.alias.length - a.alias.length
    );

  for (const entry of entries) {
    const escapedAlias =
      entry.alias.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const pattern = new RegExp(
      `\\b${escapedAlias}\\b`,
      "i"
    );

    if (pattern.test(text)) {
      return entry.canonical;
    }
  }

  return null;
}

/*
 * ------------------------------------------------
 * 9. Detect district
 * ------------------------------------------------
 */

function detectDistrict(message) {
  const text = normalizeText(message);

  const entries = Object.entries(
    districtAliases
  )
    .flatMap(
      ([canonical, aliases]) =>
        aliases.map((alias) => ({
          canonical,
          alias: normalizeText(alias),
        }))
    )
    .sort(
      (a, b) =>
        b.alias.length - a.alias.length
    );

  for (const entry of entries) {
    const escapedAlias =
      entry.alias.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const pattern = new RegExp(
      `\\b${escapedAlias}\\b`,
      "i"
    );

    if (pattern.test(text)) {
      return entry.canonical;
    }
  }

  return null;
}

/*
 * ------------------------------------------------
 * 10. Detect weather intent
 * ------------------------------------------------
 */

function detectWeatherIntent(message) {
  const text = normalizeText(message);

  return weatherKeywords.some(
    (keyword) =>
      text.includes(keyword)
  );
}

/*
 * ------------------------------------------------
 * 11. Detect price intent
 * ------------------------------------------------
 */

function detectPriceIntent(message) {
  const text = normalizeText(message);

  /*
   * LOWEST PRICE
   */

  if (
    text.includes("cheapest") ||
    text.includes("lowest") ||
    text.includes("minimum price") ||
    text.includes("minimum rate") ||
    text.includes("least price") ||
    text.includes("least rate") ||
    text.includes("lowest price") ||
    text.includes("lowest rate")
  ) {
    return "LOWEST_PRICE";
  }

  /*
   * HIGHEST PRICE
   */

  if (
    text.includes("highest") ||
    text.includes("maximum") ||
    text.includes("most expensive") ||
    text.includes("highest price") ||
    text.includes("highest rate") ||
    text.includes("maximum price") ||
    text.includes("maximum rate")
  ) {
    return "HIGHEST_PRICE";
  }

  /*
   * COMPARE PRICES
   */

  if (
    text.includes("compare") ||
    text.includes("comparison") ||
    text.includes("difference between") ||
    text.includes("price difference")
  ) {
    return "COMPARE_PRICE";
  }

  /*
   * GENERAL PRICE QUESTION
   */

  if (
    text.includes("price") ||
    text.includes("prices") ||
    text.includes("rate") ||
    text.includes("rates") ||
    text.includes("mandi") ||
    text.includes("market price") ||
    text.includes("market rate") ||
    text.includes("cost")
  ) {
    return "PRICE";
  }

  /*
   * Known commodity without explicit price word.
   */

  const commodity =
    detectCommodity(message);

  if (commodity) {
    return "PRICE";
  }

  return "GENERAL";
}

/*
 * ------------------------------------------------
 * 12. Main intent detector
 * ------------------------------------------------
 */

function detectIntent(message) {
  /*
   * IMPORTANT:
   *
   * Weather is checked FIRST.
   *
   * This prevents a weather question from
   * accidentally falling into the commodity
   * price logic.
   */

  if (detectWeatherIntent(message)) {
    return "WEATHER";
  }

  return detectPriceIntent(message);
}

/*
 * ------------------------------------------------
 * 13. Main analyzer
 * ------------------------------------------------
 */

function analyzeMandiQuestion(message) {
  const dateInfo =
    detectDate(message);

  return {
    intent:
      detectIntent(message),

    commodity:
      detectCommodity(message),

    district:
      detectDistrict(message),

    date:
      dateInfo.date,

    dateType:
      dateInfo.dateType,
  };
}

/*
 * ------------------------------------------------
 * 14. Export
 * ------------------------------------------------
 */

module.exports = {
  analyzeMandiQuestion,

  detectCommodity,

  detectDistrict,

  detectDate,

  detectIntent,

  detectWeatherIntent,

  detectPriceIntent,

  normalizeText,

  commodityAliases,

  districtAliases,
};
