const feedbackSection = document.getElementById("feedbackSection");
const feedbackText = document.getElementById("feedbackText");
const feedbackImg = document.getElementById("feedbackImg");
const searchInput = document.getElementById("searchInput");
const searchImg = document.getElementById("searchImg");
const addNewContainer = document.getElementById("addNewContainer");

addNewContainer.addEventListener("click", () => {
  window.location.replace("/employees/modify");
});

searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchFunction();
  }
});

searchImg.addEventListener("click", () => {
  searchFunction();
});

const searchFunction = () => {
  if (searchInput.value == "" || !searchInput.value) {
    window.location.replace(`/employees/`);
  } else {
    window.location.replace(
      `/employees/search?value=${searchInput.value}&page=1`
    );
  }
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

let pdfListContainer = document.querySelectorAll(".pdfListContainer");
pdfListContainer.forEach((element) => {
  // adding toggle effect
  element.children[0].addEventListener("click", () => {
    element.children[1].classList.toggle("pdfUlHidden");
  });

  // add onclick event to children
  let childs = [...element.children[1].children];
  childs.forEach((e) => {
    e.addEventListener("click", async (e) => {
      // collaps list
      e.target.parentElement.classList.toggle("pdfUlHidden");
      // loading effect
      loadingButton(e.target.parentElement.parentElement);
      // request
      const request = await sendGenerateRequest(
        e.target.innerHTML.toLowerCase(),
        e.target.parentElement.parentElement.parentElement.parentElement.id
      );
      if (request == "OK") {
        availableButton(e.target.parentElement.parentElement);
      }
    });
  });
});

// actions containers
let actionsContainers = document.querySelectorAll(".actionsContainer");
actionsContainers.forEach((container) => {
  container.children[0].addEventListener("click", (e) => {
    window.location.replace(
      `/employees/modify?employee_id=${e.target.parentElement.parentElement.parentElement.id}`
    );
  });
  container.children[1].addEventListener("click", (e) => {
    sendDeleteRequest(e.target.parentElement.parentElement.parentElement.id);
  });
});

// generate request
const sendGenerateRequest = async (type, employee_id) => {
  try {
    hideFeedback();
    const response = await fetch(
      `/employees/${type}?employee_id=${employee_id}`
    );

    if (response.status >= 400) {
      const pElement = document.getElementById(employee_id);
      const message = await response.json();
      useFeedback(message, "wrong");
      availableButton(pElement.children[6].children[0]);
      return;
    }

    let fileName = response.headers.get("fileName");
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    return "OK";
  } catch (error) {
    console.log(error);
    return useFeedback("Internal server error", "wrong");
  }
};

// edit request
// direction to anotehr page

// delete page
const sendDeleteRequest = async (employee_id) => {
  if (
    confirm("This user will be deleted, are you sure you want to continue?")
  ) {
    const response = await fetch(
      `/employees/delete?employee_id=${employee_id}`,
      {
        method: "DELETE",
      }
    );
    const message = await response.json();
    if (response.status >= 400) {
      return useFeedback(message, "wrong");
    } else {
      useFeedback(message, "correct");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }
};

// loading effect
function loadingButton(element) {
  element.children[0].style.visibility = "hidden";
  element.children[1].style.visibility = "hidden";
  const loadingImgContainer = document.createElement("div");
  loadingImgContainer.classList.add("generateloadingImgContainer");
  const loadingImg = document.createElement("img");
  loadingImg.src = "/loading.svg";
  loadingImg.classList.add("generateLoadingImg");
  loadingImgContainer.appendChild(loadingImg);
  element.appendChild(loadingImgContainer);
}

// stop the loading effect
function availableButton(element) {
  element.children[0].style.visibility = "visible";
  element.children[1].style.visibility = "visible";
  element.children[2].remove();
}

const urlParams = new URLSearchParams(window.location.search);
let currentPage = urlParams.get("page");

if (!currentPage) {
  currentPage = 1;
}

const previousButton = document.getElementById("previousPageImg");
const nextButton = document.getElementById("nextPageImg");
const pagesCount = parseInt(nextButton.classList[1]);

const generatePageURL = (direction) => {
  const indexOfPageNumber = window.location.href.indexOf("page=");
  if (indexOfPageNumber < 0) {
    // not found, means 1
    let currentHref = window.location.href;
    let newHref = currentHref + "?page=2";
    window.location.replace(newHref);
    return;
  }

  // now we got the index of the page number
  let newURL = window.location.href.substring(0, indexOfPageNumber + 5); // +5 for page=
  if (direction == "next") {
    let newPage = parseInt(currentPage) + 1;
    window.location.replace(`${newURL}${newPage}`);
  } else {
    let newPage = parseInt(currentPage) - 1;
    window.location.replace(`${newURL}${newPage}`);
  }
};

// go to next page
const nextPage = () => {
  if (currentPage >= pagesCount) {
    return useFeedback("This is the last page", "wrong");
  }
  generatePageURL("next");
};
// go to last page
const previousPage = () => {
  if (parseInt(currentPage) <= 1) {
    return useFeedback("This is the first page", "wrong");
  }
  generatePageURL("previous");
};

previousButton.addEventListener("click", () => {
  previousPage();
});
nextButton.addEventListener("click", () => {
  nextPage();
});
