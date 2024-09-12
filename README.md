# Next Trip Plan Vacations - Backend

This repository contains the backend code for the Next Trip Plan Vacations travel package planning and booking platform. The backend is built using Node.js and TypeScript, following a Clean Architecture approach for scalability and maintainability. It provides functionality for user authentication, real-time communication, payment processing, and more.

## Features:

### For Travelers:

- View & Book Travel Packages: Travelers can browse through available travel packages and make bookings securely.
- Moments Sharing: Travelers can share experiences through the "Moments" feature by uploading images, which can be liked and commented on by other travelers.
- Profile Management: Travelers have personalized profiles where they can view their transaction history, wallet balance, and track active bookings.
- Real-Time Communication: Travelers can chat with travel hosts in real-time using Socket.IO, and make video calls via ZegoCloud.
- Payment Integration: Secure payments are processed through Stripe, and refunds for cancellations are credited to the traveler's wallet.

### For Travel Hosts:

- Package Creation: Travel hosts can create new travel packages. Packages are reviewed and verified by an admin before being made public.
- Booking Management: Hosts can track bookings, manage their packages, and view travelers who have booked their trips.

### For Admins:

- Admin Dashboard: Admins have full control over managing travelers, travel hosts, packages, and moments.
- Verification Process: Admins verify travel packages before publishing them.
- Moderation: Admins can monitor and remove inappropriate moments or content shared by travelers.
- Scheduled Tasks: Various automated tasks (e.g., clearing expired bookings) are handled using Node Cron.

## Technology Stack

- Backend Framework: Node.js, TypeScript
- Database: MongoDB
- Architecture: Clean Architecture
- Real-Time Communication: Socket.IO
- Authentication: JWT (JSON Web Token) for secure user authentication
- Payment Integration: Stripe
- Image Management: Cloudinary
- Email Service: Nodemailer for sending confirmation emails and notifications to users
- Scheduled Jobs: Node Cron for scheduling automated tasks
- CORS: Enabled for handling cross-origin requests

## Key Libraries & Integrations

- Node.js & TypeScript: The backend is built using Node.js with TypeScript for static type checking and code scalability.
- Clean Architecture: The project follows Clean Architecture principles, ensuring separation of concerns and a maintainable codebase.
- MongoDB & Mongoose: MongoDB is used as the database, and Mongoose is used for object data modeling (ODM).
- JWT Authentication: JWT tokens are used for securing routes and handling user authentication.
- Socket.IO: Real-time communication (chat feature) between travelers and hosts is handled using Socket.IO.
- Stripe: Integrated for processing secure payments for package bookings.
- Nodemailer: Used for sending confirmation and notification emails to users upon registration, bookings, and cancellations.
- Cloudinary: For storing and managing images uploaded by users in the "Moments" feature.
- Node Cron: Automated tasks such as clearing expired bookings or sending reminder emails are managed using Node Cron.
- CORS: Configured for handling cross-origin resource sharing, ensuring secure communication between the frontend and backend.

## How to Set Up

Clone the project

```bash
  git clone https://github.com/hazecodez/Next-Trip-Server.git
```

Go to the project directory

```bash
  cd Next-Trip-Server
```

Install dependencies

```bash
  npm install
```

Create a .env file in the root directory and configure the following variables:

```bash
    FRONTEND_URL = your_frontend_url
    MONGO_URL = mongodb_atlas_url
    GMAIL_ID = email_id
    APP_PASS = gamil_app_pass
    JWT_SECRET = your_jwt_secret
    CLOUDINARY_NAME = your_cloudinary_name
    CLOUDINARY_API_KEY = your_cloudinary_api_key
    CLOUDINARY_API_SECRET = your_cloudinary_api_secret
    STRIPE_SECRET_KEY = your_stripe_secret_key


```

Start the development server:

```bash
  npm run dev
```

- Open your browser and go to http://localhost:5050.
