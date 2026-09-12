require("dotenv").config();

const {
  getCurrentWeather,
} = require("./services/weatherService");

async function test() {
  try {
    const weather = await getCurrentWeather("Hyderabad");

    console.log("Weather test successful:");
    console.log(weather);
  } catch (error) {
    console.error("Weather test failed:");
    console.error(
      error.response?.data || error.message
    );
  }
}

test();