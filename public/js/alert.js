/* eslint-disable */

let alertTimeout;

export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.remove();
};

export const showAlert = (type, msg) => {
  hideAlert();
  clearTimeout(alertTimeout);

  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.body.insertAdjacentHTML("afterbegin", markup);

  alertTimeout = window.setTimeout(hideAlert, 5000);
};
