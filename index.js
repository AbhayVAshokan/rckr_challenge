const axios = require("axios");

// Update current population limit here
const POPULATION_LIMIT = 61954;
const RADIUS = 6371;

// Function to calculate distance between two Points on Earth
const distance = (lat1, lat2, lon1, lon2) => {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // calculate the result
  return c * RADIUS;
};

// GET request to requested URL.
axios
  .get(
    "https://cdn.jsdelivr.net/gh/apilayer/restcountries@3dc0fb110cd97bce9ddf27b3e8e1f7fbe115dc3c/src/main/resources/countriesV2.json"
  )
  .then((res) => {
    // First 20 countries with a population greater than or equal to the population limit
    const countries = res.data
      .filter((country) => country.population >= POPULATION_LIMIT)
      .slice(0, 20);

    latlngs = [];
    countries.forEach((country) => {
      // If co-ordinates are missing for any country use 0.000 N 0.000 E
      latlngs.push(country.latlng == null ? [0, 0] : country.latlng);
    });

    let result = 0;
    // Sum of lengths of all lines.
    for (let i = 0; i < latlngs.length; ++i) {
      for (let j = i + 1; j < latlngs.length; ++j) {
        result += distance(
          latlngs[i][0],
          latlngs[j][0],
          latlngs[i][1],
          latlngs[j][1]
        );
      }
    }

    console.log(`Solution: ${result.toFixed(2)}`);
  })
  .catch((err) => console.error(err));
