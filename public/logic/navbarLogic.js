const thirdAnchor = document.getElementById("thirdAnchor");
const fourthAnchor = document.getElementById("fourthAnchor");

const loggedUser = () => {
  thirdAnchor.textContent = "Employees";
  thirdAnchor.href = "/employees";
  fourthAnchor.textContent = "Logout";
  fourthAnchor.href = "/users/logout";
};

const guestUser = () => {
  thirdAnchor.textContent = "Regitser";
  thirdAnchor.href = "/register";
  fourthAnchor.textContent = "Login";
  fourthAnchor.href = "/login";
};

fetch("/isLogged", {
  method: "GET",
})
  .then(async (response) => {
    if (response.status >= 400) {
      return guestUser();
    }
    loggedUser();
  })
  .catch((err) => {
    console.log(err);
    guestUser();
  });
