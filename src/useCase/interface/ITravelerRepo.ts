import traveler from "../../domain/traveler";

interface ITravelerRepo {
  findTravelerByEmail(email: string): Promise<traveler | null>;
  saveTravelerToDB(traveler: traveler): Promise<traveler | void | null>;
}

export default ITravelerRepo;
