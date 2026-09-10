require("dotenv").config();

const {
  getMandiSummary,
} = require("./services/mandiService");

(async () => {
  try {
    console.log("================================");
    console.log("HISTORICAL FALLBACK TEST");
    console.log("================================");

    const result = await getMandiSummary({
      state: "Telangana",
      commodity: "Onion",
      limit: 100,
    });

    console.log(
      JSON.stringify(result, null, 2)
    );

  } catch (error) {
    console.error(
      "TEST ERROR:",
      error
    );
  }
})();