import host from "../../domain/host";
export interface MonthlyBookingReport {
  year: number;
  month: number;
  totalBookings: number;
}
interface IHostRepo {
  findHostByEmail(email: string): Promise<host | null | undefined>;
  findHostById(id: string): Promise<host | null | undefined>;
  saveHostToDB(host: host): Promise<host | void | null>;
  verifyHostEmail(email: string): Promise<any>;
  fetchHostData(email: string): Promise<void | host | null>;
  saveGoogleUser(credential: any): Promise<host | undefined>;
  updateHostPassword(id:string,password:string):Promise<Boolean | undefined>;
  creditedToWallet(Data:any,traveler:any):Promise<Boolean>;
  updateProfile(Data:any,id:string):Promise<Boolean>;
  profilePicUpdate(id:string,image:string):Promise<Boolean>;
  debitedFromWallet(Data:any,travelerName:string,hostId:string):Promise<Boolean>;
  booking_report(hostId:string):Promise<MonthlyBookingReport[]>;
}

export default IHostRepo;
