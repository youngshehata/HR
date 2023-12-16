const Employee = require("../models/EmployeeModel");
const Section = require("../models/SectionModel");
const { Worker } = require("worker_threads");
const path = require("path");

// *****************************************************************************************************
// **** HOSPITAL ****
// *****************************************************************************************************

const hospital = async (req, res, next) => {
  try {
    if (!req.query.employee_id) {
      return res.status(404).json("No employee id was provided");
    }

    const empDoc = await Employee.findById(req.query.employee_id.toString());
    if (!empDoc) {
      return res.status(404).json("Invalid employee id");
    }

    const section = await Section.findOne({ sectionName: empDoc.section });
    if (!section) {
      return res.status(500).json("Internal server error");
    }

    const ceoDoc = await Section.findOne({ sectionName: "CEO" });
    if (!ceoDoc) {
      return res.status(500).json("Internal server error");
    }

    const letterData = {
      name: empDoc.name,
      date: new Date().toLocaleDateString(),
      section: section.sectionName,
      administrator: section.administrator,
      ceo: ceoDoc.administrator,
    };

    const pdfWroker = new Worker("./workers/hospitalWorker.js", {
      workerData: letterData,
    });

    pdfWroker.on("messageerror", async (msg) => {
      res.status(500).json(msg);
      await pdfWroker.terminate();
      return;
    });

    pdfWroker.on("message", async (msg) => {
      await pdfWroker.terminate();
      const fileName = path.basename(msg);
      res.setHeader("fileName", fileName);
      return res.download(msg, (err) => {
        if (err) {
          console.log(`err on download`);
          console.log(err);
          return res.status(400).json(err.message);
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** VACATION ****
// *****************************************************************************************************

const vacation = async (req, res, next) => {
  try {
    if (!req.query.employee_id) {
      return res.status(404).json("No employee id was provided");
    }

    const empDoc = await Employee.findById(req.query.employee_id.toString());
    if (!empDoc) {
      return res.status(404).json("Invalid employee id");
    }

    const section = await Section.findOne({ sectionName: empDoc.section });
    if (!section) {
      return res.status(500).json("Internal server error");
    }

    const ceoDoc = await Section.findOne({ sectionName: "CEO" });
    if (!ceoDoc) {
      return res.status(500).json("Internal server error");
    }

    // check if employee still has any days left
    const remainingDays =
      parseInt(empDoc.vacationsLimit) - parseInt(empDoc.vacationsUsage);
    if (remainingDays <= 0) {
      return res
        .status(400)
        .json(`This employee used all of his leave balance already`);
    }

    const letterData = {
      name: empDoc.name,
      date: new Date().toLocaleDateString(),
      section: section.sectionName,
      administrator: section.administrator,
      ceo: ceoDoc.administrator,
      remaining: remainingDays,
    };

    const pdfWroker = new Worker("./workers/vacationWorker.js", {
      workerData: letterData,
    });

    pdfWroker.on("messageerror", async (msg) => {
      res.status(500).json(msg);
      await pdfWroker.terminate();
      return;
    });

    pdfWroker.on("message", async (msg) => {
      await pdfWroker.terminate();
      const fileName = path.basename(msg);
      res.setHeader("fileName", fileName);
      return res.download(msg, (err) => {
        if (err) {
          console.log(`err on download`);
          console.log(err);
          return res.status(400).json(err.message);
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

// *****************************************************************************************************
// **** RESIGN ****
// *****************************************************************************************************

const resign = async (req, res, next) => {
  try {
    if (!req.query.employee_id) {
      return res.status(404).json("No employee id was provided");
    }

    const empDoc = await Employee.findById(req.query.employee_id.toString());
    if (!empDoc) {
      return res.status(404).json("Invalid employee id");
    }

    const section = await Section.findOne({ sectionName: empDoc.section });
    if (!section) {
      return res.status(500).json("Internal server error");
    }

    const ceoDoc = await Section.findOne({ sectionName: "CEO" });
    if (!ceoDoc) {
      return res.status(500).json("Internal server error");
    }

    const letterData = {
      name: empDoc.name,
      section: section.sectionName,
      administrator: section.administrator,
      ceo: ceoDoc.administrator,
      title: empDoc.title,
    };

    const pdfWroker = new Worker("./workers/resignWorker.js", {
      workerData: letterData,
    });

    pdfWroker.on("messageerror", async (msg) => {
      res.status(500).json(msg);
      await pdfWroker.terminate();
      return;
    });

    pdfWroker.on("message", async (msg) => {
      await pdfWroker.terminate();
      const fileName = path.basename(msg);
      res.setHeader("fileName", fileName);
      return res.download(msg, (err) => {
        if (err) {
          console.log(`err on download`);
          console.log(err);
          return res.status(400).json(err.message);
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

module.exports.hospital = hospital;
module.exports.vacation = vacation;
module.exports.resign = resign;
