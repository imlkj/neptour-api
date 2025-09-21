/* eslint-disable */
import "core-js/stable";
import "regenerator-runtime/runtime";
import { login } from "./login.js";
import { displayMap } from "./map.js";

const mapElement = document.getElementById("map");

if (mapElement) {
  // Read locations from Pug data attribute
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

const loginForm = document.querySelector(".form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}