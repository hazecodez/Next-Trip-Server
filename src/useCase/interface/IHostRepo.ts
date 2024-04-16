import host from "../../domain/host";

interface IHostRepo {
  findHostByEmail(email: string): Promise<host | null | undefined>;
  saveHostToDB(host: host): Promise<host | void | null>;
  verifyHost(email: string): Promise<any>;
  fetchHostData(email: string): Promise<void | host | null>;
}

export default IHostRepo;
