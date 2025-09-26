/* eslint-disable */
import "core-js/stable";
import "regenerator-runtime/runtime";
import { login, logout } from "./login.js";
import { displayMap } from "./map.js";
import { updateData } from "./updateSettings.js";

const mapElement = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");

if (mapElement) {
  // Read locations from Pug data attribute
  const locations = JSON.parse(mapElement.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (userDataForm) {
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    updateData(name, email);
  });
}
