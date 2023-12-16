const loginButton = document.getElementById("loginButton");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const feedbackSection = document.getElementById("feedbackSection");
const feedbackText = document.getElementById("feedbackText");
const feedbackImg = document.getElementById("feedbackImg");

window.onload = function () {
  usernameInput.focus();
};

//***********************************************************************************************//
const useFeedback = (text, state) => {
  feedbackText.textContent = text;
  feedbackImg.classList = [];
  feedbackImg.classList.add("feedbackImg");
  feedbackImg.classList.add(`feedbackImg${state}`);
  feedbackSection.classList = ["feedbackSection feedbackSectionActive"];
};
//***********************************************************************************************//

//***********************************************************************************************//
const hideFeedback = () => {
  feedbackSection.classList = ["feedbackSection"];
};
//***********************************************************************************************//

loginButton.addEventListener("click", () => {
  fetch("/users/login", {
    method: "POST",
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      const message = await response.json();
      if (response.status >= 400) {
        useFeedback(message, "wrong");
        setTimeout(() => {
          hideFeedback();
        }, 2000);
        return;
      } else {
        window.location.href = "/";
      }
    })
    .catch(async (err) => {
      console.log(err);
      const resText = await err.json();
      return useFeedback(resText, "wrong");
    });
});

// enter on password input

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loginButton.click();
  }
});
