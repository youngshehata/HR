const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const passwordConfirmInput = document.getElementById("passwordConfirmInput");
const secretQuestionInput = document.getElementById("secretQuestionInput");
const secretAnswerInput = document.getElementById("secretAnswerInput");
const registerButton = document.getElementById("registerButton");
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

const validateRequest = () => {
  const pw = passwordInput.value;
  const pwConfirm = passwordConfirmInput.value;

  if (!usernameInput.value) {
    return useFeedback("Username must be provided", "wrong");
  }

  if (pw !== pwConfirm) {
    return useFeedback("Password dosent match the confirmation", "wrong");
  }

  if (pw.toString().length < 4) {
    return useFeedback("Password minimum length is 4 characters", "wrong");
  }

  if (!secretQuestionInput.value || !secretAnswerInput.value) {
    return useFeedback("Secret quest and answer must be provided", "wrong");
  }

  return 200;
};

const sendRegisterRequest = async () => {
  // hide feedback
  hideFeedback();
  // validate pw
  const isValid = validateRequest();
  if (isValid !== 200) {
    return;
  }

  fetch("/users/register", {
    method: "POST",
    body: JSON.stringify({
      username: usernameInput.value,
      password: passwordInput.value,
      passwordConfirm: passwordConfirmInput.value,
      secretQuestion: secretQuestionInput.value,
      secretAnswer: secretAnswerInput.value,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      const message = await response.json();
      if (response.status >= 400) {
        useFeedback(message, "wrong");
        return;
      }
      useFeedback("Account created successfully", "correct");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    })
    .catch(async (err) => {
      const message = await err.json();
      useFeedback(message, "wrong");
      console.log(err);
    });
};

registerButton.addEventListener("click", () => {
  sendRegisterRequest();
});
