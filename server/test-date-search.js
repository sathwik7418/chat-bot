require("dotenv").config();

const {
  getMandiSummary,
} = require("./services/mandiService");

(async () => {
  try {
    console.log(
      "================================"
    );

    console.log(
      "DATE SEARCH TEST"
    );

    console.log(
      "================================"
    );

    const result =
      await getMandiSummary({
        state: "Telangana",
        commodity: "Onion",
        date: "2026-09-09",
        limit: 100,
      });

    console.log(
      JSON.stringify(
        result,
        null,
        2
      )
    );

  } catch (error) {
    console.error(
      "TEST ERROR:",
      error
    );
  }
})();