const usernameInput = document.getElementById("usernameInput");
const checkUsernameButton = document.getElementById("checkUsernameButton");
const updatePasswordButton = document.getElementById("updatePasswordButton");
const secretQuestionInput = document.getElementById("secretQuestionInput");
const secretAnswerInput = document.getElementById("secretAnswerInput");
const newPasswordInput = document.getElementById("newPasswordInput");
const newPasswordConfirmInput = document.getElementById(
  "newPasswordConfirmInput"
);

const feedbackSection = document.getElementById("feedbackSection");
const feedbackText = document.getElementById("feedbackText");
const feedbackImg = document.getElementById("feedbackImg");

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

//***********************************************************************************************//
const enableInputs = () => {
  secretQuestionInput.disabled = false;
  secretAnswerInput.disabled = false;
  newPasswordInput.disabled = false;
  newPasswordConfirmInput.disabled = false;
};
//***********************************************************************************************//

//***********************************************************************************************//
const checkForUsername = async () => {
  try {
    hideFeedback();
    const secretQuestion = await fetch("/users/check", {
      method: "POST",
      body: JSON.stringify({ username: usernameInput.value }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    let message = await secretQuestion.json();
    if (secretQuestion.status >= 400) {
      return useFeedback(message, "wrong");
    }
    secretQuestionInput.value = message;
    enableInputs();
  } catch (err) {}
};
//***********************************************************************************************//

//***********************************************************************************************//
checkUsernameButton.addEventListener("click", () => {
  checkForUsername();
});
//***********************************************************************************************//

//***********************************************************************************************//
const resetPasswordRequest = async () => {
  hideFeedback();
  const response = await fetch("/users/reset", {
    method: "POST",
    body: JSON.stringify({
      username: usernameInput.value,
      secretAnswer: secretAnswerInput.value,
      newPassword: newPasswordInput.value,
      newPasswordConfirm: newPasswordConfirmInput.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const message = await response.json();
  if (response.status >= 400) {
    return useFeedback(message, "wrong");
  }

  useFeedback("Password updated successfully", "correct");
  setTimeout(() => {
    window.location.href = "/login";
  }, 1500);
};
//***********************************************************************************************//

//***********************************************************************************************//
updatePasswordButton.addEventListener("click", () => {
  resetPasswordRequest();
});
//***********************************************************************************************//
