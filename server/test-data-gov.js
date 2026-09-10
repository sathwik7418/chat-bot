require("dotenv").config();

const https = require("https");

const apiKey = process.env.DATA_GOV_API_KEY;

const url =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070" +
  `?api-key=${apiKey}` +
  "&format=json" +
  "&limit=10";

https.get(url, (response) => {
  let data = "";

  response.on("data", (chunk) => {
    data += chunk;
  });

  response.on("end", () => {
    console.log("Status:", response.statusCode);

    try {
      const result = JSON.parse(data);

      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.log("Could not parse response:");
      console.log(data);
    }
  });
}).on("error", (error) => {
  console.error("Request failed:", error.message);
});