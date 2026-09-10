const {
  commodityAliases,
  districtAliases,
} = require("../utils/mandiQueryAnalyzer");


// --------------------------------------------------
// Words that should never be fuzzy-matched
// --------------------------------------------------

const ignoredWords = new Set([
  "what",
  "which",
  "where",
  "when",
  "who",
  "why",
  "how",
  "tell",
  "give",
  "show",
  "price",
  "prices",
  "rate",
  "rates",
  "today",
  "tomorrow",
  "yesterday",
  "about",
  "much",
  "cost",
  "costs",
  "market",
  "mandi",
  "from",
  "with",
  "into",
  "have",
  "does",
  "there",
  "this",
  "that",
  "your",
  "please",
  "bhai",
  "anna",
  "bro",
  "sir",
  "lo",
  "in",
  "on",
  "at",
  "for",
  "the",
  "is",
  "are",
  "was",
  "were",
]);


// --------------------------------------------------
// Damerau-Levenshtein similarity
//
// Handles:
// - insertion
// - deletion
// - replacement
// - adjacent character transposition
//
// Example:
// oninos → onions
//          ↑ ↑
//       swapped
// --------------------------------------------------

function similarity(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();

  const rows = a.length + 1;
  const cols = b.length + 1;

  const matrix = Array.from(
    { length: rows },
    () => Array(cols).fill(0)
  );

  // Base cases
  for (let i = 0; i < rows; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j < cols; j++) {
    matrix[0][j] = j;
  }

  // Calculate distance
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      // Normal operations
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // replacement
      );

      // Transposition
      if (
        i > 1 &&
        j > 1 &&
        a[i - 1] === b[j - 2] &&
        a[i - 2] === b[j - 1]
      ) {
        matrix[i][j] = Math.min(
          matrix[i][j],
          matrix[i - 2][j - 2] + 1
        );
      }
    }
  }

  const distance = matrix[a.length][b.length];
  const maxLength = Math.max(a.length, b.length);

  if (maxLength === 0) {
    return 1;
  }

  return 1 - distance / maxLength;
}


// --------------------------------------------------
// Find closest known value
// --------------------------------------------------

function findBestMatch(input, aliasGroups, threshold = 0.75) {
  let bestMatch = null;
  let bestScore = 0;

  for (const [canonicalName, aliases] of Object.entries(aliasGroups)) {
    for (const alias of aliases) {
      const score = similarity(input, alias);

      if (score > bestScore) {
        bestScore = score;
        bestMatch = canonicalName;
      }
    }
  }

  if (bestScore >= threshold) {
    return {
      value: bestMatch,
      score: bestScore,
    };
  }

  return null;
}


// --------------------------------------------------
// Fuzzy commodity matching
// --------------------------------------------------

function fuzzyCommodityMatch(word) {
  if (!word || word.length < 4) {
    return null;
  }

  const normalizedWord = word.toLowerCase().trim();

  // Don't match normal conversational words
  if (ignoredWords.has(normalizedWord)) {
    return null;
  }

  let threshold;

  if (normalizedWord.length <= 4) {
    threshold = 0.9;
  } else if (normalizedWord.length === 5) {
    threshold = 0.82;
  } else {
    threshold = 0.75;
  }

  return findBestMatch(
    normalizedWord,
    commodityAliases,
    threshold
  );
}


// --------------------------------------------------
// Fuzzy district matching
// --------------------------------------------------

function fuzzyDistrictMatch(word) {
  if (!word || word.length < 4) {
    return null;
  }

  const normalizedWord = word.toLowerCase().trim();

  if (ignoredWords.has(normalizedWord)) {
    return null;
  }

  let threshold;

  if (normalizedWord.length <= 5) {
    threshold = 0.85;
  } else {
    threshold = 0.75;
  }

  return findBestMatch(
    normalizedWord,
    districtAliases,
    threshold
  );
}


// --------------------------------------------------
// Find commodity inside a sentence
// --------------------------------------------------

function fuzzyFindCommodityInText(text) {
  const words = text
    .toLowerCase()
    .replace(/[?!.,;:()[\]{}]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  let bestMatch = null;

  for (const word of words) {
    if (word.length < 4) {
      continue;
    }

    if (ignoredWords.has(word)) {
      continue;
    }

    const result = fuzzyCommodityMatch(word);

    if (!result) {
      continue;
    }

    if (!bestMatch || result.score > bestMatch.score) {
      bestMatch = {
        commodity: result.value,
        score: result.score,
        matchedWord: word,
      };
    }
  }

  return bestMatch;
}


// --------------------------------------------------
// Find district inside a sentence
// --------------------------------------------------

function fuzzyFindDistrictInText(text) {
  const words = text
    .toLowerCase()
    .replace(/[?!.,;:()[\]{}]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  let bestMatch = null;

  for (const word of words) {
    if (word.length < 4) {
      continue;
    }

    if (ignoredWords.has(word)) {
      continue;
    }

    const result = fuzzyDistrictMatch(word);

    if (!result) {
      continue;
    }

    if (!bestMatch || result.score > bestMatch.score) {
      bestMatch = {
        district: result.value,
        score: result.score,
        matchedWord: word,
      };
    }
  }

  return bestMatch;
}


// --------------------------------------------------
// Exports
// --------------------------------------------------

module.exports = {
  similarity,
  findBestMatch,
  fuzzyCommodityMatch,
  fuzzyDistrictMatch,
  fuzzyFindCommodityInText,
  fuzzyFindDistrictInText,
};