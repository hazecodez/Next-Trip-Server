export default interface Blog {
    _id: string;
    userId: string;
    userName:string;
    caption: string;
    experience: string;
    location:string;
    image:string;
    liked_users:string[];
    time: Date;
    isBlocked:boolean;
    comments:{
        senderId:string;
        comment: string;
        time: Date;
    }[];
}