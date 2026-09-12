const axios = require("axios");

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

async function getCurrentWeather(location) {
  if (!WEATHER_API_KEY) {
    throw new Error("WEATHER_API_KEY is not configured");
  }

  if (!location) {
    throw new Error("Weather location is required");
  }

  const response = await axios.get(
    "https://api.weatherapi.com/v1/current.json",
    {
      params: {
        key: WEATHER_API_KEY,
        q: location,
        aqi: "yes",
      },
      timeout: 10000,
    }
  );

  const data = response.data;

  return {
    location: data.location.name,
    region: data.location.region,
    country: data.location.country,

    temperatureC: data.current.temp_c,
    feelsLikeC: data.current.feelslike_c,
    condition: data.current.condition.text,

    humidity: data.current.humidity,
    windKph: data.current.wind_kph,
    windDirection: data.current.wind_dir,

    precipitationMm: data.current.precip_mm,
    cloud: data.current.cloud,

    lastUpdated: data.current.last_updated,
  };
}

module.exports = {
  getCurrentWeather,
};