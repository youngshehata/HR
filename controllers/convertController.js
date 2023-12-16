const path = require("path");
const { Worker } = require("worker_threads");
const fs = require("fs");

// =================================================================================================================
//  SEED TO DATABASE --------------
// =================================================================================================================

const seedMongoDB = async (req, res, next) => {
  try {
    const csvFile = req.files?.file;
    if (csvFile.mimetype !== "text/csv") {
      return res.status(400).json("Invalid file format");
    }
    if (!csvFile) {
      return res.status(400).json("Missing csv file");
    }

    if (csvFile.truncated) {
      return res
        .status(400)
        .json("Oversize file, maximum size of csv file is 50mb");
    }

    const ms = new Date().getTime();

    const csvPath = path.join(
      __dirname,
      "../uploads/",
      `${ms}-${csvFile.name}`
    );
    csvFile.mv(csvPath, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error while saving uploaded file");
      } else {
        const workerForHeavy = new Worker("./workers/seedMongo.js", {
          workerData: { path: csvPath },
        });
        workerForHeavy.on("message", async (msg) => {
          if (msg === "ok") {
            await workerForHeavy.terminate();
            // delete the csv file
            fs.rm(csvPath, (err) => {
              if (err) {
                console.log(err);
                return res.status(500).json(`Internal server error`);
              }
            });
            return res.status(200).json("Seeding complete");
          } else {
            await workerForHeavy.terminate();
            return res.status(400).json(msg);
          }
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

// =================================================================================================================
//  CONVERT TO JSON --------------
// =================================================================================================================

const convertToJSON = async (req, res, next) => {
  try {
    const csvFile = req.files?.file;
    if (csvFile.mimetype !== "text/csv") {
      return res.status(400).json("Invalid file format");
    }
    if (!csvFile) {
      return res.status(400).json("Missing csv file");
    }

    if (csvFile.truncated) {
      return res
        .status(400)
        .json("Oversize file, maximum size of csv file is 50mb");
    }

    const ms = new Date().getTime();

    const csvPath = path.join(
      __dirname,
      "../uploads/",
      `${ms}-${csvFile.name}`
    );
    csvFile.mv(csvPath, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json("Error while moving uploaded file");
      } else {
        const workerForHeavy = new Worker("./workers/convertToJson.js", {
          workerData: { path: csvPath },
        });
        workerForHeavy.on("message", async (msg) => {
          // delete the csv file after short time
          setTimeout(() => {
            fs.rm(msg, (err) => {
              if (err) {
                console.log(err);
                return res.status(500).json(`Internal server error`);
              }
            });
          }, 5000);
          await workerForHeavy.terminate();
          const nameOfTheFile = path.basename(msg);
          return res.status(200).json(nameOfTheFile);
        });
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports.seedMongoDB = seedMongoDB;
module.exports.convertToJSON = convertToJSON;
