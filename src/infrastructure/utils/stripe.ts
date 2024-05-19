import Stripe from "stripe";
require("dotenv").config();

export const checkout = async (Data: any) => {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY as string;

    const stripeInstance = new Stripe(secretKey);
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: Data.name,
          },
          unit_amount: Data.totalPrice * 100,
        },
        quantity: 1,
      },
    ];
    const session = await stripeInstance.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      payment_method_types: ["card"],

      success_url: `${process.env.FRONTEND_URL}/success_page/${Data.packageId}`,
      cancel_url: `${process.env.FRONTEND_URL}/package_details/${Data.packageId}`,
    });
    return { sessionId: session.id };
  } catch (error) {
    console.log(error);
  }
};
