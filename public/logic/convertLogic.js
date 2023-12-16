const fileInput = document.getElementById("fileInput");
const fileFeedback = document.getElementById("fileFeedback");
const labelAsInput = document.getElementById("labelAsInput");
const jsonButton = document.getElementById("jsonButton");
const mongoButton = document.getElementById("mongoButton");
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
const disabledButtons = () => {
  mongoButton.classList.add("disabledButton");
  jsonButton.classList.add("disabledButton");
};
//***********************************************************************************************//

//***********************************************************************************************//
const enableButtons = () => {
  mongoButton.classList.remove("disabledButton");
  jsonButton.classList.remove("disabledButton");
};
//***********************************************************************************************//

//***********************************************************************************************//
fileInput.addEventListener("change", (e) => {
  if (e.target.files[0]) {
    fileFeedback.textContent = e.target.files[0].name;
    labelAsInput.textContent = "Select Another";
    labelAsInput.blur();
    enableButtons();
    hideFeedback();
  }
});
//***********************************************************************************************//

//***********************************************************************************************//
mongoButton.addEventListener("click", (e) => {
  sendSeedRequest();
});
//***********************************************************************************************//

//***********************************************************************************************//
jsonButton.addEventListener("click", (e) => {
  sendJsonRequest();
});
//***********************************************************************************************//

//=================================================//
//=================================================//

const sendSeedRequest = () => {
  disabledButtons();
  useFeedback("Processing", "loading");
  const dataForm = new FormData();
  const file = fileInput.files[0];
  if (!file) {
    hideFeedback();
    return alert("Missing file");
  }
  dataForm.append("file", file);

  fetch(`/convert/seed`, {
    method: "POST",
    body: dataForm,
    // using express-fileupload on server deals with it with default headers
  })
    .then(async (response) => {
      enableButtons();
      const resText = await response.json();
      if (response.status >= 400) {
        return useFeedback(resText, "wrong");
      } else {
        useFeedback(resText, "correct");
      }
    })
    .catch(async (err) => {
      enableButtons();
      const resText = await err.json();
      useFeedback(resText, "wrong");
    });
};

//=================================================//
//=================================================//

const sendJsonRequest = () => {
  disabledButtons();
  useFeedback("Processing", "loading");
  const dataForm = new FormData();
  const file = fileInput.files[0];
  if (!file) {
    hideFeedback();
    return alert("Missing file");
  }
  dataForm.append("file", file);

  fetch(`/convert/json`, {
    method: "POST",
    body: dataForm,
  })
    .then(async (response) => {
      let fileURL = await response.text();
      const downloadAnchor = document.createElement("a");
      downloadAnchor.href = `/${JSON.parse(fileURL)}`;
      downloadAnchor.download = `converted_${new Date().toLocaleDateString()}.json`;
      downloadAnchor.click();
      enableButtons();
      useFeedback("Converted successfully!", "correct");
    })
    .catch(async (err) => {
      enableButtons();
      console.log(err);
      const resText = await err.json();
      useFeedback(resText, "wrong");
    });
};
