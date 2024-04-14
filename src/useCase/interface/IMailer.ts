interface IMailer {
  sendEmail(to: string, otp: number): Promise<any>;
}

export default IMailer;
