const Employee = require("../models/EmployeeModel.js");
const Section = require("../models/SectionModel.js");
const jwt = require("jsonwebtoken");

const modify = async (req, res, next) => {
  try {
    let empID = req.query.employee_id;

    const decoded = jwt.decode(req.cookies["token"]);
    if (!decoded) {
      // return res.status(401).json("Unauthorized");
      return res.render("error", {
        errorMessage: "Token expired, please refresh the page and continue",
      });
    }

    let empDoc = {
      rootUser: null,
      _id: null,
      name: null,
      section: null,
      title: null,
      vacationsLimit: null,
      vacationUsage: null,
    };

    if (empID) {
      empDoc = await Employee.findById(empID.toString());
    }

    const sections = await Section.find({});
    res.render("modify", { data: empDoc, sections });
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** GET ****
// *****************************************************************************************************

const employees = async (req, res, next) => {
  try {
    let page = req.query.page || 1;
    if (!parseInt(req.query.page)) {
      page = 1;
    }
    const decoded = jwt.decode(req.cookies["token"]);
    if (!decoded) {
      // return res.status(401).json("Unauthorized");
      return res.render("error", {
        errorMessage: "Token expired, please refresh the page and continue",
      });
    }

    const count = (await Employee.find({ rootUser: decoded._id.toString() }))
      .length;

    if (count === 0) {
      return res.render("employees", {
        employees: [],
        count: 1,
        page: 1,
        lastPage: 1,
      });
    }

    const lastPage = Math.ceil(count / 10);
    if (page > lastPage) {
      page = lastPage;
    }

    const employees = await Employee.find({ rootUser: decoded._id })
      .limit(10)
      .skip(parseInt(page * 10 - 10));

    res.render("employees", { employees, count, page, lastPage });
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** SEARCH ****
// *****************************************************************************************************

const search = async (req, res, next) => {
  try {
    const decoded = jwt.decode(req.cookies["token"]);
    if (!decoded) {
      // return res.status(401).json("Unauthorized");
      return res.render("error", {
        errorMessage: "Token expired, please refresh the page and continue",
      });
    }

    let page = req.query.page || 1;
    if (!parseInt(req.query.page)) {
      page = 1;
    }

    if (!req.query.value) {
      return res.status(400).json(`Invalid provided search value`);
    }

    const value = req.query.value.toString();

    const employees = await Employee.find({
      rootUser: decoded._id.toString(),
      name: { $regex: `${value}`, $options: "i" },
    });

    const count = employees.length;
    let the10Docs = [];

    if (count > 10) {
      let startNumber = page * 10 - 9;
      let endNumber = page * 10;
      for (let i = startNumber; i <= endNumber; i++) {
        if (employees[i - 1]) {
          the10Docs.push(employees[i - 1]);
        }
      }
    } else {
      the10Docs = [...employees];
    }

    let lastPage = 1;
    if (count <= 10) {
      page = 1; // just incase user inserted page on url with value of 2 or somthing
      return res.render("employees", {
        employees: the10Docs,
        count,
        page,
        lastPage,
      });
    } else {
      lastPage = Math.ceil(count / 10);
      return res.render("employees", {
        employees: the10Docs,
        count,
        page,
        lastPage,
      });
    }
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** ADD ****
// *****************************************************************************************************

const addEmployee = async (req, res, next) => {
  try {
    const decoded = jwt.decode(req.cookies["token"]);
    if (!decoded) {
      return res.status(401).json("Unauthorized");
    }

    if (!req.body.name || !req.body.section) {
      return res.status(400).json(`Please provide valid name and section`);
    }

    if (req.body.vacationsLimit && req.body.vacationsLimit > 60) {
      return res.status(400).json(`Vacations maximum limit is 60 days`);
    }

    if (req.body.vacationsUsage && req.body.vacationsUsage > 60) {
      return res.status(400).json(`Vacations maximum limit is 60 days`);
    }

    // make suer name is not duplicated
    const isDuplicated = await Employee.findOne({ name: req.body.name });
    if (isDuplicated) {
      return res
        .status(409)
        .json(
          `Name is already in use, ${isDuplicated.name} - ${isDuplicated.section} section`
        );
    }

    let newEmployee = {
      rootUser: decoded._id,
      name: req.body.name,
      section: req.body.section,
    };

    if (req.body.title) {
      newEmployee.title = req.body.title;
    }
    if (req.body.vacationsLimit) {
      newEmployee.vacationsLimit = req.body.vacationsLimit;
    }
    if (req.body.vacationsUsage) {
      newEmployee.vacationsUsage = req.body.vacationsUsage;
    }

    const doc = await Employee.create(newEmployee);
    res.status(201).json(doc);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// *****************************************************************************************************
// **** EDIT ****
// *****************************************************************************************************

const editEmployee = async (req, res, next) => {
  try {
    if (!req.body.employee_id || !req.body.updates) {
      return res.status(400).json(`Invalid values provided`);
    }

    const employeeDoc = await Employee.findById(
      req.body.employee_id.toString()
    );
    if (!employeeDoc) {
      return res.status(404).json("Couldn't find any users with this id");
    }

    // make sure the logged in user is the root user of that employee
    const decoded = jwt.decode(req.cookies["token"]);
    if (!decoded) {
      return res.status(401).json("Unauthorized, Please try again");
    }

    if (decoded._id.toString() !== employeeDoc.rootUser.toString()) {
      return res.status(403).json(`This user is not one of yours to modify`);
    }

    // make suer name is not duplicated
    const isDuplicated = await Employee.findOne({
      name: req.body.updates.name,
    });
    if (
      isDuplicated &&
      isDuplicated._id.toString() !== employeeDoc._id.toString()
    ) {
      return res
        .status(409)
        .json(
          `Name is already in use, ${isDuplicated.name} - ${isDuplicated.section} section`
        );
    }

    if (
      req.body.updates.vacationsLimit &&
      req.body.updates.vacationsLimit > 60
    ) {
      return res.status(400).json(`Vacations maximum limit is 60 days`);
    }

    if (
      req.body.updates.vacationsUsage &&
      req.body.updates.vacationsUsage > 60
    ) {
      return res.status(400).json(`Vacations maximum limit is 60 days`);
    }

    employeeDoc.name = req.body.updates.name
      ? req.body.updates.name
      : employeeDoc.name;
    (employeeDoc.section = req.body.updates.section
      ? req.body.updates.section
      : employeeDoc.section),
      (employeeDoc.title = req.body.updates.title
        ? req.body.updates.title
        : employeeDoc.title),
      (employeeDoc.vacationsLimit = req.body.updates.vacationsLimit
        ? req.body.updates.vacationsLimit
        : employeeDoc.vacationsLimit),
      (employeeDoc.vacationsUsage = req.body.updates.vacationsUsage
        ? req.body.updates.vacationsUsage
        : employeeDoc.vacationsUsage),
      await employeeDoc.save();

    res.status(200).json(employeeDoc);
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** DELETE ****
// *****************************************************************************************************
const deleteEmployee = async (req, res, next) => {
  try {
    if (!req.query.employee_id) {
      return res.status(400).json(`Invalid values provided`);
    }

    const employeeDoc = await Employee.findById(
      req.query.employee_id.toString()
    );
    if (!employeeDoc) {
      return res.status(404).json("Couldn't find any users with this id");
    }

    // make sure the logged in user is the root user of that employee
    const decoded = jwt.decode(req.cookies["token"]);
    if (!decoded) {
      return res.status(401).json("Unauthorized, Please try again");
    }

    if (decoded._id.toString() !== employeeDoc.rootUser.toString()) {
      return res.status(403).json(`This user is not one of yours to modify`);
    }

    await Employee.deleteOne(employeeDoc);

    res.status(203).json("Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// *****************************************************************************************************

module.exports.modify = modify;
module.exports.employees = employees;
module.exports.search = search;
module.exports.addEmployee = addEmployee;
module.exports.editEmployee = editEmployee;
module.exports.deleteEmployee = deleteEmployee;
