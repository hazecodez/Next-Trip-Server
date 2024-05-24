import cron from "node-cron";
import nodemailer from "nodemailer";
require("dotenv").config();

class CronJob {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ID,
        pass: process.env.APP_PASS,
      },
    });
  }

  async schedule(email: string, dateString: string, place: string) {
    const targetDate = new Date(dateString);
    const now = new Date();

    if (isNaN(targetDate.getTime())) {
      console.error("Invalid date format.");
      return;
    }

    const diffInMillis = targetDate.getTime() - now.getTime();

    if (diffInMillis < 0) {
      console.error("The target date is in the past.");
      return;
    }

    if (diffInMillis <= 24 * 60 * 60 * 1000) {
      // If the target date is within the next 24 hours, run the task immediately
      console.log(
        "The target date is within the next 24 hours. Running the task immediately."
      );
      this.scheduledTask(email, place);
    } else {
      // Calculate the day before the target date
      const dayBefore = new Date(targetDate);
      dayBefore.setDate(targetDate.getDate() - 1);

      // Extract the time to schedule the cron job on the day before the target date
      const hours = targetDate.getHours();
      const minutes = targetDate.getMinutes();
      const day = dayBefore.getDate();
      const month = dayBefore.getMonth() + 1; // Months are zero-based in JavaScript
      const cronTime = `${minutes} ${hours} ${day} ${month} *`;

      if (cron.validate(cronTime)) {
        cron.schedule(cronTime, () => {
          this.scheduledTask(email, place);
        });
        console.log(
          `Cron job scheduled for ${email} on ${dayBefore.toLocaleDateString()} at ${hours}:${minutes}`
        );
      } else {
        console.error("Invalid cron time format.");
      }
    }
  }

  async scheduledTask(to: string, place: string): Promise<any> {
    const mailOptions = {
      from: process.env.GMAIL_ID,
      to: to,
      subject: `Your ${place} Journey Begins Tomorrow!`,
      html: `
        <div style="background-color: #f0f8ff; padding: 20px; text-align: center;">
          <h1 style="color: #333;">Your ${place} Journey Begins Tomorrow!</h1>
          <p style="color: #666; font-size: 16px;">
            Wishing you safe travels and looking forward to creating wonderful memories together!
          </p>
          <img src="https://img.freepik.com/premium-vector/cartoon-young-old-tourists-group-excursion-with-tour-guide-girl-with-flag-cityscape-background_208581-136.jpg" alt="Travel Image" style="width: 100%; max-width: 600px; height: auto;" />
        </div>
      `,
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error Occured", error);
      } else {
        console.log("Wishing Email sent : ", info.response);
      }
    });
  }
}

export default CronJob;
