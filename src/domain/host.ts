interface host {
    _id: string;
    name: string;
    email: string;
    password: string;
    isVerified: boolean;
    emailVerified:boolean;
    isBlocked: boolean;
    identityImage: string;
    image: string;
    wallet: number;
    walletHistory: Object[];
    googleId: string;
}

export default host;