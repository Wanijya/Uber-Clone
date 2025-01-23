const rideModel = require("../models/ride.model"); // Import the ride model
const mapService = require("./maps.service"); // Import the map service
const bcrypt = require("bcrypt"); // Import bcrypt for hashing
const crypto = require("crypto"); // Import crypto for generating OTP

async function getFare(pickup, destination) {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required"); // Throw an error if pickup or destination is missing
  }

  const distanceTime = await mapService.getDistanceTime(pickup, destination); // Get distance and time between pickup and destination

  const baseFare = {
    auto: 30, // Base fare for auto
    car: 50, // Base fare for car
    moto: 20, // Base fare for moto
  };

  const perKmRate = {
    auto: 10, // Rate per km for auto
    car: 15, // Rate per km for car
    moto: 8, // Rate per km for moto
  };

  const perMinuteRate = {
    auto: 2, // Rate per minute for auto
    car: 3, // Rate per minute for car
    moto: 1.5, // Rate per minute for moto
  };

  const fare = {
    auto: Math.round(
      baseFare.auto +
        (distanceTime.distance.value / 1000) * perKmRate.auto +
        (distanceTime.duration.value / 60) * perMinuteRate.auto
    ), // Calculate fare for auto
    car: Math.round(
      baseFare.car +
        (distanceTime.distance.value / 1000) * perKmRate.car +
        (distanceTime.duration.value / 60) * perMinuteRate.car
    ), // Calculate fare for car
    moto: Math.round(
      baseFare.moto +
        (distanceTime.distance.value / 1000) * perKmRate.moto +
        (distanceTime.duration.value / 60) * perMinuteRate.moto
    ), // Calculate fare for moto
  };

  return fare; // Return the calculated fare
}

module.exports.getFare = getFare; // Export the getFare function

function getOtp(num) {
  function generateOtp(num) {
    const otp = crypto
      .randomInt(Math.pow(10, num - 1), Math.pow(10, num))
      .toString(); // Generate a random OTP of specified length
    return otp;
  }
  return generateOtp(num); // Return the generated OTP
}

module.exports.createRide = async ({
  user,
  pickup,
  destination,
  vehicleType,
}) => {
  if (!user || !pickup || !destination || !vehicleType) {
    throw new Error("All fields are required");
  }

  const fare = await getFare(pickup, destination);

  const ride = rideModel.create({
    user,
    pickup,
    destination,
    otp: getOtp(6),
    fare: fare[vehicleType],
  });

  return ride;
};
