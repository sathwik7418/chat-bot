const https = require("https");
const fs = require("fs");
const path = require("path");

const RESOURCE_ID =
  "9ef84268-d588-465a-a308-a864a43d0070";

const API_KEY = process.env.DATA_GOV_API_KEY;

const BASE_URL =
  `https://api.data.gov.in/resource/${RESOURCE_ID}`;

const CACHE_DIR =
  path.join(__dirname, "..", "cache");

/*
 * ================================================================
 * TEXT NORMALIZATION
 * ================================================================
 */

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[?!.,]/g, "")
    .replace(/\s+/g, " ");
}

/*
 * ================================================================
 * DATE HELPERS
 * ================================================================
 */

function getTodayDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    now.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * Convert:
 *
 * 09/09/2026
 *
 * into:
 *
 * 2026-09-09
 */

function normalizeDate(value) {
  if (!value) {
    return null;
  }

  const text = String(value).trim();

  const match = text.match(
    /^(\d{2})\/(\d{2})\/(\d{4})$/
  );

  if (match) {
    const [, day, month, year] = match;

    return `${year}-${month}-${day}`;
  }

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(text)
  ) {
    return text;
  }

  return text;
}

/*
 * ================================================================
 * CACHE DIRECTORY
 * ================================================================
 */

function ensureCacheDirectory() {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, {
      recursive: true,
    });
  }
}

/*
 * ================================================================
 * FETCH DATA FROM DATA.GOV.IN
 * ================================================================
 */

function fetchFromDataGov(limit = 100, offset = 0) {
  return new Promise((resolve, reject) => {
    if (!API_KEY) {
      return reject(
        new Error(
          "DATA_GOV_API_KEY is not configured."
        )
      );
    }

    const params = new URLSearchParams({
      "api-key": API_KEY,
      format: "json",
      limit: String(limit),
      offset: String(offset),
    });

    const url =
      `${BASE_URL}?${params.toString()}`;

    console.log(
      "Data.gov URL:",
      url.replace(API_KEY, "***")
    );

    https
      .get(url, (response) => {
        let data = "";

        response.on("data", (chunk) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const result = JSON.parse(data);

            console.log("Data.gov response:", result);

            if (response.statusCode !== 200) {
              return reject(
                new Error(
                  `data.gov.in returned HTTP ${response.statusCode}`
                )
              );
            }

            resolve(result);
          } catch (error) {
            reject(
              new Error(
                "Invalid response received from data.gov.in."
              )
            );
          }
        });
      })
      .on("error", (error) => {
        reject(
          new Error(
            `Failed to connect to data.gov.in: ${error.message}`
          )
        );
      });
  });
}

/*
 * ================================================================
 * SAVE DAILY SNAPSHOT
 * ================================================================
 */

function saveDailyCache(records) {
  try {
    ensureCacheDirectory();

    const date = getTodayDate();

    const filePath =
      path.join(
        CACHE_DIR,
        `${date}.json`
      );

    const cacheData = {
      source: "data.gov.in",
      type: "daily_snapshot",
      cachedAt:
        new Date().toISOString(),
      date,
      records,
    };

    fs.writeFileSync(
      filePath,
      JSON.stringify(
        cacheData,
        null,
        2
      ),
      "utf8"
    );

    console.log(
      `Saved ${records.length} records to ${date}.json`
    );

    return true;
  } catch (error) {
    console.error(
      "Could not save daily mandi cache:",
      error.message
    );

    return false;
  }
}

/*
 * ================================================================
 * GET REAL HISTORICAL CACHE FILES
 * ================================================================
 */

function getCacheFiles() {
  try {
    ensureCacheDirectory();

    return fs
      .readdirSync(CACHE_DIR)
      .filter(
        (file) =>
          /^\d{4}-\d{2}-\d{2}\.json$/.test(
            file
          )
      )
      .sort()
      .reverse();
  } catch (error) {
    console.error(
      "Could not list mandi cache files:",
      error.message
    );

    return [];
  }
}

/*
 * ================================================================
 * LOAD CACHE FILE
 * ================================================================
 */

function loadCacheFile(fileName) {
  try {
    const filePath =
      path.join(
        CACHE_DIR,
        fileName
      );

    const data =
      fs.readFileSync(
        filePath,
        "utf8"
      );

    return JSON.parse(data);
  } catch (error) {
    console.error(
      `Could not read cache file ${fileName}:`,
      error.message
    );

    return null;
  }
}

/*
 * ================================================================
 * CLEAN RECORDS
 * ================================================================
 */

function cleanMandiRecords(records) {
  return records
    .map((record) => ({
      state:
        String(
          record.state || ""
        ).trim(),

      district:
        String(
          record.district || ""
        ).trim(),

      market:
        String(
          record.market || ""
        ).trim(),

      commodity:
        String(
          record.commodity || ""
        ).trim(),

      variety:
        String(
          record.variety || ""
        ).trim(),

      grade:
        String(
          record.grade || ""
        ).trim(),

      arrivalDate:
        String(
          record.arrival_date || ""
        ).trim(),

      minPrice:
        Number(record.min_price),

      maxPrice:
        Number(record.max_price),

      modalPrice:
        Number(record.modal_price),
    }))
    .filter(
      (record) =>
        record.state &&
        record.commodity &&
        Number.isFinite(
          record.modalPrice
        )
    );
}

/*
 * ================================================================
 * FILTER RECORDS
 * ================================================================
 */

function filterRecords(
  records,
  {
    state = "",
    district = "",
    commodity = "",
    market = "",
  } = {}
) {
  let filtered =
    cleanMandiRecords(records);

  if (state) {
    const targetState =
      normalizeText(state);

    filtered =
      filtered.filter(
        (record) =>
          normalizeText(
            record.state
          ) === targetState
      );
  }

  if (district) {
    const targetDistrict =
      normalizeText(district);

    filtered =
      filtered.filter(
        (record) =>
          normalizeText(
            record.district
          ) === targetDistrict
      );
  }

  if (commodity) {
    const targetCommodity =
      normalizeText(
        commodity
      );

    filtered =
      filtered.filter(
        (record) =>
          normalizeText(
            record.commodity
          ) === targetCommodity
      );
  }

  if (market) {
    const targetMarket =
      normalizeText(market);

    filtered =
      filtered.filter(
        (record) =>
          normalizeText(
            record.market
          ) === targetMarket
      );
  }

  return filtered;
}

/*
 * ================================================================
 * FETCH CURRENT DATA
 * ================================================================
 */

async function getRawMandiData(
  limit = 100
) {
  try {
    const result =
      await fetchFromDataGov(
        limit
      );

    const records =
      Array.isArray(
        result.records
      )
        ? result.records
        : [];

    console.log(
      `Fetched ${records.length} raw mandi records`
    );

    saveDailyCache(records);

    return {
  source: "live",
  dataSource: "data.gov.in",
  records,
  cachedAt: new Date().toISOString(),
  date: getTodayDate(),
};
  } catch (error) {
    console.error(
      "Live mandi API failed:",
      error.message
    );

    return {
  source: "none",
  dataSource: null,
  records: [],
  cachedAt: null,
  date: null,
};
  }
}

/*
 * ================================================================
 * SEARCH HISTORICAL CACHE
 * ================================================================
 */

function findHistoricalRecords({
  state = "",
  district = "",
  commodity = "",
  market = "",
  date = "",
} = {}) {
  const files = getCacheFiles();

  /*
   * If a specific date was requested,
   * search ONLY that day's file.
   */
  let filesToSearch = files;

  if (date) {
    const targetFile = `${normalizeDate(date)}.json`;

    filesToSearch = files.filter(
      (file) => file === targetFile
    );
  }

  for (const fileName of filesToSearch) {
    const cache = loadCacheFile(fileName);

    if (
      !cache ||
      !Array.isArray(cache.records) ||
      cache.records.length === 0
    ) {
      continue;
    }

    const records = filterRecords(
      cache.records,
      {
        state,
        district,
        commodity,
        market,
      }
    );

    if (records.length > 0) {
      console.log(
        `Historical cache match found in ${fileName}`
      );

      /*
       * source = how our application retrieved the data
       *
       * dataSource = where the data originally came from
       */
      const isTestFixture =
        cache.source === "historical_test_fixture";

      return {
        records,

        source: isTestFixture
          ? "historical_test_fixture"
          : "cache",

        dataSource:
          cache.source || "unknown",

        cachedAt:
          cache.cachedAt || null,

        date:
          cache.date ||
          fileName.replace(".json", ""),
      };
    }
  }

  /*
   * No matching historical data found.
   */
  return {
    records: [],
    source: "none",
    dataSource: null,
    cachedAt: null,
    date: date
      ? normalizeDate(date)
      : null,
  };
}

/*
 * ================================================================
 * GET MANDI PRICES
 * ================================================================
 */

async function getMandiPrices({
  state = "",
  district = "",
  commodity = "",
  market = "",
  date = "",
  limit = 100,
} = {}) {

  /*
   * ------------------------------------------------
   * CURRENT DATA REQUEST
   * ------------------------------------------------
   *
   * If no specific date was requested,
   * first try the live API.
   *
   * ------------------------------------------------
   */

  if (!date) {
    const live =
      await getRawMandiData(
        limit
      );

    const liveRecords =
      filterRecords(
        live.records,
        {
          state,
          district,
          commodity,
          market,
        }
      );

    console.log(
      `Live matching records: ${liveRecords.length}`
    );

    if (
      liveRecords.length > 0
    ) {
      return {
  source: "live",
  dataSource: live.dataSource || "data.gov.in",
  cachedAt: live.cachedAt,
  date: live.date,
  records: liveRecords,
};
    }

    /*
     * No matching live data.
     *
     * Search previous daily snapshots.
     */

    console.log(
      "No matching live records. Searching historical cache..."
    );

    return findHistoricalRecords({
      state,
      district,
      commodity,
      market,
    });
  }

  /*
   * ------------------------------------------------
   * SPECIFIC DATE REQUEST
   * ------------------------------------------------
   */

  console.log(
    `Searching mandi cache for date: ${date}`
  );

  return findHistoricalRecords({
    state,
    district,
    commodity,
    market,
    date,
  });
}

/*
 * ================================================================
 * ANALYZE RECORDS
 * ================================================================
 */

function analyzeMandiRecords(
  records
) {
  if (!records.length) {
    return null;
  }

  const sorted =
    [...records].sort(
      (a, b) =>
        a.modalPrice -
        b.modalPrice
    );

  const lowest =
    sorted[0];

  const highest =
    sorted[
      sorted.length - 1
    ];

  const average =
    records.reduce(
      (sum, record) =>
        sum +
        record.modalPrice,
      0
    ) / records.length;

  return {
    recordsFound:
      records.length,

    lowest:
      lowest.modalPrice,

    highest:
      highest.modalPrice,

    average:
      Number(
        average.toFixed(2)
      ),

    lowestMarket:
      lowest.market,

    highestMarket:
      highest.market,

    lowestRecord:
      lowest,

    highestRecord:
      highest,

    date:
      normalizeDate(
        lowest.arrivalDate
      ),
  };
}

/*
 * ================================================================
 * GET MANDI SUMMARY
 * ================================================================
 */

async function getMandiSummary({
  state = "",
  district = "",
  commodity = "",
  market = "",
  date = "",
  limit = 100,
} = {}) {
  const result = await getMandiPrices({
    state,
    district,
    commodity,
    market,
    date,
    limit,
  });

  const analysis = analyzeMandiRecords(
    result.records
  );

  if (!analysis) {
    return {
      source: result.source,
      dataSource: result.dataSource || null,
      cachedAt: result.cachedAt,
      date: result.date,
      recordsFound: 0,
      dataAvailable: false,
      state,
      district,
      commodity,
      market,
    };
  }

  return {
    source: result.source,
    dataSource:
      result.dataSource || result.source || "unknown",

    cachedAt: result.cachedAt,

    date:
      analysis.date ||
      result.date,

    dataAvailable: true,

    state,
    district,
    commodity,
    market,

    ...analysis,
  };
}

/*
 * ================================================================
 * COLLECT TODAY'S LIVE MANDI SNAPSHOT
 * ================================================================
 */

async function collectDailyMandiSnapshot(limit = 10000) {
  const result = await fetchFromDataGov(limit);

  const records = Array.isArray(result.records)
    ? result.records
    : [];

  if (records.length === 0) {
    throw new Error(
      "data.gov.in returned no mandi records."
    );
  }

  const saved = saveDailyCache(records);

  if (!saved) {
    throw new Error(
      "Mandi data was fetched but could not be saved to cache."
    );
  }

  return {
    source: "data.gov.in",
    date: getTodayDate(),
    recordsCount: records.length,
  };
}

/*
 * ================================================================
 * EXPORTS
 * ================================================================
 */

module.exports = {
  getMandiPrices,
  getMandiSummary,
  collectDailyMandiSnapshot,
};