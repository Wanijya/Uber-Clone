const axios = require("axios"); // Import axios for making HTTP requests

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API; // Get Google Maps API key from environment variables
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`; // Construct the URL for the Google Maps Geocoding API

  try {
    const response = await axios.get(url); // Make a GET request to the API
    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location; // Extract the location data from the response
      return {
        ltd: location.lat, // Return the latitude
        lng: location.lng, // Return the longitude
      };
    } else {
      throw new Error("Unable to fetch coordinates"); // Throw an error if the API response status is not OK
    }
  } catch (error) {
    console.error(error); // Log the error
    throw error; // Rethrow the error
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required"); // Throw an error if origin or destination is missing
  }

  const apiKey = process.env.GOOGLE_MAPS_API; // Get Google Maps API key from environment variables

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
    origin
  )}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`; // Construct the URL for the Google Maps Distance Matrix API

  try {
    const response = await axios.get(url); // Make a GET request to the API
    if (response.data.status === "OK") {
      if (response.data.rows[0].elements[0].status === "ZERO_RESULTS") {
        throw new Error("No routes found"); // Throw an error if no routes are found
      }

      return response.data.rows[0].elements[0]; // Return the distance and duration data
    } else {
      throw new Error("Unable to fetch distance and time"); // Throw an error if the API response status is not OK
    }
  } catch (err) {
    console.error(err); // Log the error
    throw err; // Rethrow the error
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error("query is required"); // Throw an error if input is missing
  }

  const apiKey = process.env.GOOGLE_MAPS_API; // Get Google Maps API key from environment variables
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    input
  )}&key=${apiKey}`; // Construct the URL for the Google Maps Places Autocomplete API

  try {
    const response = await axios.get(url); // Make a GET request to the API
    if (response.data.status === "OK") {
      return response.data.predictions
        .map((prediction) => prediction.description) // Extract and return the descriptions of the predictions
        .filter((value) => value); // Filter out any empty values
    } else {
      throw new Error("Unable to fetch suggestions"); // Throw an error if the API response status is not OK
    }
  } catch (err) {
    console.error(err); // Log the error
    throw err; // Rethrow the error
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  // radius in km

  const captains = await captainModel.find({
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371], // Find captains within the specified radius
      },
    },
  });

  return captains; // Return the list of captains
};
