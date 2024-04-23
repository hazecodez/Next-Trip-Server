import host from "../../domain/host";

interface IHostRepo {
  findHostByEmail(email: string): Promise<host | null | undefined>;
  findHostById(id: string): Promise<host | null | undefined>;
  saveHostToDB(host: host): Promise<host | void | null>;
  verifyHost(email: string): Promise<any>;
  fetchHostData(email: string): Promise<void | host | null>;
  saveGoogleUser(credential: any): Promise<host | undefined>;
  updateHostPassword(id:string,password:string):Promise<Boolean | undefined>;
}

export default IHostRepo;
