interface Travelers {
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
}
export enum Status {
  Booked = "booked",
  Cancelled = "cancelled",
  Pending = "pending",
}

export interface Booking {
  _id: string;
  travelerId: string;
  packageId: string;
  travelers: Travelers[];
  totalPrice: number;
  status: Status;
}