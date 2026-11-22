export interface Place {
  id: string;
  name: string;
}

export interface Tour {
  id: string;
  origin: Place;
  destination: Place;
  startDate: string;
  endDate: string;
  title: string;
  fleetVehicle: string;
  price: number;
  availableSeats: number;
  capacity: number;
  insurance: boolean;
  options: string[];
  image: string;
}

export interface Payment {
  shaba_code: string;
  debitCard_code: string;
  accountIdentifier: string;
}

export type Gender = 'male' | 'female';

export interface UserProfile {
  id: string;
  mobile: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  birthDate?: string;
  nationalCode?: string | number;
  payment?: Payment;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: { id: string; firstName: string; lastName: string; mobile: string };
}
