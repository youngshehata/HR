const express = require("express");
const app = express();
const {
  employees,
  addEmployee,
  editEmployee,
  deleteEmployee,
  search,
  modify,
} = require("../controllers/employeesController");

const {
  hospital,
  vacation,
  resign,
} = require("../controllers/lettersController");

app.get("/", employees);
app.get("/modify", modify);
app.get("/search", search);
app.post("/new", addEmployee);
app.put("/edit", editEmployee);
app.delete("/delete", deleteEmployee);
// letters
app.get("/hospital", hospital);
app.get("/vacation", vacation);
app.get("/resign", resign);

module.exports = app;
