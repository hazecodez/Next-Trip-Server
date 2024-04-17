import traveler from "../../domain/traveler";

interface ITravelerRepo {
  findTravelerByEmail(email: string): Promise<traveler | null>;
  saveTravelerToDB(traveler: traveler): Promise<traveler | void | null>;
  verifyTraveler(email: string): Promise<any>;
  fetchTravelerData(email: string): Promise<void | traveler | null>;
  saveGoogleUser(credential: any): Promise<traveler | undefined>;
}

export default ITravelerRepo;
