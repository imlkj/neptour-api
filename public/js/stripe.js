/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alert";

// no need to call loadStripe anymore
export const bookTour = async (tourId) => {
  try {
    // 1. Get checkout session from API
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`,
    );
    console.log("Checkout session:", session.data);

    // 2. Redirect manually
    window.location.href = session.data.session.url;
  } catch (err) {
    console.error("Stripe Checkout error:", err);
    showAlert("error", err.response?.data?.message || err.message);
  }
};
