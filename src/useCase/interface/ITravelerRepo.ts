import traveler from "../../domain/traveler";

interface ITravelerRepo {
  findTravelerByEmail(email: string): Promise<traveler | null>;
  findTravelerById(id: string): Promise<traveler | null | undefined>;
  saveTravelerToDB(traveler: traveler): Promise<traveler | void | null>;
  verifyTraveler(email: string): Promise<any>;
  fetchTravelerData(email: string): Promise<void | traveler | null>;
  saveGoogleUser(credential: any): Promise<traveler | undefined>;
  updateTravelerPassword(id:string,password:string):Promise<Boolean | undefined>;
  updateProfile(Data:any,id:string):Promise<Boolean>;
}

export default ITravelerRepo;
