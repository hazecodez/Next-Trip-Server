interface traveler {
  _id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  isBlocked: boolean;
  image: string;
  wallet: number;
  walletHistory: {
    packageName: string;
    amount: number;
    status: string;
    date: Date;
  }[];
  googleId: string;
}

export default traveler;
