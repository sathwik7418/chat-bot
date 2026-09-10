require("dotenv").config();

const https = require("https");

const RESOURCE_ID =
  "9ef84268-d588-465a-a308-a864a43d0070";

const API_KEY = process.env.DATA_GOV_API_KEY;

const BASE_URL =
  `https://api.data.gov.in/resource/${RESOURCE_ID}`;

function test(limit) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      "api-key": API_KEY,
      format: "json",
      limit: String(limit),
    });

    const url = `${BASE_URL}?${params.toString()}`;

    console.log("\n================================");
    console.log("Testing limit:", limit);
    console.log("================================");
    console.log(
      url.replace(API_KEY, "***")
    );

    https.get(url, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const result = JSON.parse(data);

          console.log("HTTP status:", response.statusCode);
          console.log("API total:", result.total);
          console.log("API count:", result.count);
          console.log(
            "Records received:",
            result.records?.length || 0
          );

          if (result.records) {
            const telangana = result.records.filter(
              (r) =>
                String(r.state).toLowerCase() ===
                "telangana"
            );

            console.log(
              "Telangana records:",
              telangana.length
            );

            console.log(
              "\nFirst records:"
            );

            console.log(
              JSON.stringify(
                result.records,
                null,
                2
              )
            );
          }

          resolve();
        } catch (error) {
          reject(error);
        }
      });
    }).on("error", reject);
  });
}

async function main() {
  await test(10);
  await test(100);
}

main().catch(console.error);