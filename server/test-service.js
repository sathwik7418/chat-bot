require("dotenv").config();

const { getMandiPrices } = require("./services/mandiService");

(async () => {
  try {
    const result = await getMandiPrices({
      limit: 100,
    });

    const records = result.records;

    console.log("================================");
    console.log("SERVICE TEST");
    console.log("================================");

    console.log("SOURCE:", result.source);
    console.log("SERVICE RECORD COUNT:", records.length);

    const telanganaRecords = records.filter(
      (record) =>
        String(record.state || "").toLowerCase().trim() ===
        "telangana"
    );

    console.log(
      "TELANGANA COUNT:",
      telanganaRecords.length
    );

    console.log("\nFirst 5 records:");
    console.log(
      JSON.stringify(records.slice(0, 5), null, 2)
    );

  } catch (error) {
    console.error("SERVICE ERROR:", error);
  }
})();