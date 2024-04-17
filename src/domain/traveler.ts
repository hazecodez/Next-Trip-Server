interface traveler {
  _id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isBlocked: boolean;
  image: string;
  wallet: number;
  walletHistory: Object[];
  googleId: string;
}

export default traveler;
