/* eslint-disable */
import { showAlert } from "./alert.js";

export const login = async (email, password) => {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    let data;
    try {
      data = await res.json(); // try parse JSON
    } catch {
      data = { message: await res.text() }; // fallback to plain text
    }

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    showAlert("success", "Logged in successfully!");
    window.setTimeout(() => location.assign("/"), 1500);
  } catch (err) {
    console.log(err);
    showAlert("error", err.message || "Something went wrong!");
  }
};
