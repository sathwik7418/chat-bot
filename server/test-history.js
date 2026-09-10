require("dotenv").config();

const https = require("https");

const apiKey = process.env.DATA_GOV_API_KEY;

const url =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070" +
  `?api-key=${apiKey}` +
  "&format=json" +
  "&limit=100" +
  "&filters[arrival_date]=09/09/2026";

console.log(
  "Testing historical API:"
);

console.log(
  url.replace(apiKey, "***")
);

https
  .get(url, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      console.log(
        "\nHTTP status:",
        response.statusCode
      );

      try {
        const result = JSON.parse(data);

        console.log(
          "API total:",
          result.total
        );

        console.log(
          "API count:",
          result.count
        );

        console.log(
          "Records received:",
          result.records?.length || 0
        );

        const telangana = (
          result.records || []
        ).filter(
          (record) =>
            String(record.state || "")
              .toLowerCase()
              .trim() === "telangana"
        );

        console.log(
          "Telangana records:",
          telangana.length
        );

        console.log(
          "\nFirst 5 Telangana records:"
        );

        console.log(
          JSON.stringify(
            telangana.slice(0, 5),
            null,
            2
          )
        );
      } catch (error) {
        console.log(
          "Could not parse response:"
        );

        console.log(data);
      }
    });
  })
  .on("error", (error) => {
    console.error(
      "Request failed:",
      error.message
    );
  });