import { Booking } from "../../domain/booking";

interface IBookingRepo {
    saveBookedPackage(id: string, Data: any): Promise<Boolean>;
    fetchBookingByUserId(id:string):Promise<any>;
    fetchBookingByPackageId(id:string):Promise<any>;
}

export default IBookingRepo;