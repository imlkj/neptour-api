import "../envConfig.js";
import Stripe from "stripe";
import Tour from "../models/tourModel.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Booking from "../models/bookingModel.js";
import * as factory from "./factoryHandler.js";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = asyncHandler(async (req, res, next) => {
  //1. Get the currently booked tour
  const tour = await Tour.findById(req.params.tourID);

  // console.log(tour);

  if (!tour) {
    return res.status(404).json({ status: "fail", message: "Tour not found" });
  }

  //2. Create checkout session

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/?tour=${req.params.tourID}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
  });

  //3. Create session as response
  res.status(200).json({
    status: "success",
    session,
  });
});

export const createBookingCheckout = asyncHandler(async (req, res, next) => {
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

export const createBooking = factory.createOne(Booking);
export const getBooking = factory.getOne(Booking);
export const getAllBookings = factory.getAll(Booking);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);
