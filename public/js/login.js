/* eslint-disable */
import { showAlert } from "./alert.js";

export const login = async (email, password) => {
  try {
    const res = await fetch("/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.log("loging err response: ", data);
      throw new Error(data.message || "Invalid email or password");
    }

    showAlert("success", "Logged in successfully!");
    window.setTimeout(() => location.assign("/"), 1500);
  } catch (err) {
    console.error("Login error:", err);
    showAlert("error", err.message || "Something went wrong!");
  }
};

export const logout = async () => {
  try {
    const res = await fetch("/api/v1/users/logout", {
      method: "GET",
      credentials: "include", // ensures cookies/session are sent
    });

    let errorData = {};
    try {
      errorData = await res.json();
    } catch (e) {}

    if (!res.ok) {
      console.error("Logout error:", errorData);
      showAlert("error", errorData.message || "Logout request failed");
      return;
    }

    showAlert("success", "Logged out successfully!");
    setTimeout(() => {
      window.location.assign("/");
    }, 1000);
  } catch (err) {
    console.error("Logout exception:", err);
    showAlert("error", "Error logging out! Try again.");
  }
};
