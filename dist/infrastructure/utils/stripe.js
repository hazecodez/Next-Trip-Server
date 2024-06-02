"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const stripe_1 = __importDefault(require("stripe"));
require("dotenv").config();
const checkout = (Data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        const stripeInstance = new stripe_1.default(secretKey);
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
        const session = yield stripeInstance.checkout.sessions.create({
            line_items: line_items,
            mode: "payment",
            payment_method_types: ["card"],
            success_url: `${process.env.FRONTEND_URL}/success_page/${Data.packageId}`,
            cancel_url: `${process.env.FRONTEND_URL}/package_details/${Data.packageId}`,
        });
        return { sessionId: session.id };
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkout = checkout;
