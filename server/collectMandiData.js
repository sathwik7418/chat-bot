require("dotenv").config();

const {
  collectDailyMandiSnapshot,
} = require("./services/mandiService");

async function collectMandiData() {
  console.log("=================================");
  console.log("MANDI DAILY DATA COLLECTION");
  console.log("=================================");

  try {
    const result =
      await collectDailyMandiSnapshot(100);

    console.log(
      `Source: ${result.source}`
    );

    console.log(
      `Date: ${result.date}`
    );

    console.log(
      `Records collected: ${result.recordsCount}`
    );

    console.log(
      "Daily mandi collection completed successfully."
    );
  } catch (error) {
    console.error(
      "Mandi collection failed:",
      error.message
    );

    process.exit(1);
  }
}

collectMandiData();