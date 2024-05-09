interface host {
  _id: string;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  emailVerified: boolean;
  isBlocked: boolean;
  identityImage: string;
  image: string;
  wallet: number;
  walletHistory: {
    packageName: string;
    travelerName: string;
    amount: number;
    status: string;
    date: Date;
  }[];
  googleId: string;
}

export default host;
