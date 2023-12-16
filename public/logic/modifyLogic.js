const feedbackSection = document.getElementById("feedbackSection");
const feedbackText = document.getElementById("feedbackText");
const feedbackImg = document.getElementById("feedbackImg");
const modifyButton = document.getElementById("modifyButton");
// Inputs values
const empInfo_id = document.getElementById("empInfo_id");
const empInfoRootUser = document.getElementById("empInfoRootUser");
const empInfoName = document.getElementById("empInfoName");
const empInfoSection = document.getElementById("empInfoSection");
const empInfoTitle = document.getElementById("empInfoTitle");
const empInfoVacationsLimit = document.getElementById("empInfoVacationsLimit");
const empInfoVacationsUsage = document.getElementById("empInfoVacationsUsage");

window.onload = function () {
  empInfoName.focus();
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

let method = modifyButton.classList[1];

modifyButton.addEventListener("click", async () => {
  if (method == "update") {
    await updateEmployee();
  } else {
    await createEmployee();
  }
});

// **************************************************************//
const updateEmployee = async () => {
  const response = await fetch(`/employees/edit`, {
    method: "PUT",
    body: JSON.stringify({
      employee_id: empInfo_id.value,
      updates: {
        name: empInfoName.value,
        section: empInfoSection.value,
        title: empInfoTitle.value,
        vacationsLimit: parseInt(empInfoVacationsLimit.value),
        vacationsUsage: parseInt(empInfoVacationsUsage.value),
      },
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (response.status >= 400) {
    const message = await response.json();
    return useFeedback(message, "wrong");
  } else {
    window.location.replace("/employees");
  }
};
// **************************************************************//
const createEmployee = async () => {
  try {
    const response = await fetch("/employees/new", {
      method: "POST",
      body: JSON.stringify({
        name: empInfoName.value,
        section: empInfoSection.value,
        title: empInfoTitle.value || false,
        vacationsLimit: parseInt(empInfoVacationsLimit.value) || false,
        vacationsUsage: parseInt(empInfoVacationsUsage.value) || false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const message = await response.json();
    if (response.status >= 400) {
      return useFeedback(message, "wrong");
    } else {
      window.location.replace("/employees");
    }
  } catch (error) {
    console.log(error);
    const message = await error.json();
    return useFeedback(message, "wrong");
  }
};
