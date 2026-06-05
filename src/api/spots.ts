import { parkingSpots } from "../data/parkingSpots";

export const getParkingSpots = async () => {
  await new Promise((resolve) => window.setTimeout(resolve, 120));
  return parkingSpots;
};

export const getParkingSpot = async (id: string) => {
  await new Promise((resolve) => window.setTimeout(resolve, 80));
  return parkingSpots.find((spot) => spot.id === id) ?? parkingSpots[0];
};
