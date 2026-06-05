export type ParkingSpot = {
  id: string;
  name: string;
  zone: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  total: number;
  rating: number;
  reviews: number;
  spaces?: number;
  tags: string[];
  availableToday: boolean;
  availability?: {
    startTime: string; // "09:00"
    endTime: string;   // "18:00"
    days: number[];    // [1, 2, 3, 4, 5] (1 = Lunes, 7 = Domingo)
  };
};

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  plate: string;
  size: "moto" | "coche" | "furgoneta";
};

export type Booking = {
  id: string;
  spot: ParkingSpot;
  date: string;
  timeSlot: string;
  price: number;
  commission: number;
  total: number;
  qrCode: string;
  status: "active" | "expired" | "cancelled";
  durationHours: number;
  expiresAt: string;
  vehiclePlate?: string; // Asociamos la matrícula del vehículo a la reserva
};

export type MapFilters = {
  types: string[];
  maxPrice: number;
  size: "moto" | "coche" | "furgoneta";
};

export type UserProfile = {
  id?: string;
  name: string;
  role: string;
  avatar: string;
  token: string | null;
  vehicles?: Vehicle[];
  selectedVehicleId?: string | null;
};
