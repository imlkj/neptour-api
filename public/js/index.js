/* eslint-disable */
import "core-js/stable";
import "regenerator-runtime/runtime";
import { login, logout } from "./login.js";
import { displayMap } from "./map.js";

const mapElement = document.getElementById("map");

if (mapElement) {
  // Read locations from Pug data attribute
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

const loginForm = document.querySelector(".form--login");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

const logoutBtn = document.querySelector(".nav__el--logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}
