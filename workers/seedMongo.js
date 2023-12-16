const { parentPort, workerData } = require("worker_threads");
const bufferingObjectStream = require("buffering-object-stream");
const Seed = require("../models/SeedModel");
const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const connectToDatabase = require("../config/dbConfig");

const readStream = fs.createReadStream(workerData.path);
//--------------------------------------------------------------------------------------------------------------
const restructureObject = (obj) => {
  let clone = { ...obj };
  Object.keys(obj).map((o) => {
    let value = obj[o];
    if (
      value.match(/^-\d*\.?\d+$/) != null // checking if number, positive or negative
    ) {
      clone[o] = parseInt(value);
    } else if (value.match(/^[0-9,.]*$/) != null) {
      // checking if float
      clone[o] = parseFloat(value);
    }
    if (!value) {
      clone[o] = false; // otherwise gonna become empty string in the mongodb document
    }
  });
  return clone;
};
//--------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------
const restructureTransform = new Transform({
  objectMode: true,
  transform: (chunk, enc, callback) => {
    let refactoredObject = restructureObject(JSON.parse(chunk));
    callback(null, refactoredObject);
  },
});
//--------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------
const transformArrays = new Transform({
  objectMode: true,
  transform: async (chunk, enc, callback) => {
    await Seed.bulkWrite(
      chunk.map((obj) => ({
        insertOne: {
          document: obj,
        },
      }))
    );
    callback(null);
  },
});
//--------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------
const excute = async () => {
  try {
    await connectToDatabase();

    console.time("seeding");
    await pipeline(
      readStream,
      csv(),
      restructureTransform,
      bufferingObjectStream(500),
      transformArrays
    );
    console.timeEnd("seeding");
    parentPort.postMessage("ok");
  } catch (error) {
    console.log(error);
    parentPort.postMessage(
      "Internal error, please make sure the first line of the .csv file contains the keys (field names)"
    );
  }
};
//--------------------------------------------------------------------------------------------------------------

excute();
