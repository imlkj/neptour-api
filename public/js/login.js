/* eslint-disable */

const login = async (email, password) => {
  try {
    const res = await fetch("http://127.0.0.1:3000/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // Check if HTTP status is OK (2xx)
    if (!res.ok) {
      // parse error response
      const errorData = await res.json();
      throw errorData; // throw to catch block
    } else {
      alert("Logged in sucessfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }

    const data = await res.json();
    // console.log(data);
  } catch (err) {
    alert(err.message);
  }
};

const loginForm = document.querySelector(".form");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login(email, password);
  });
}
