const { parentPort, workerData } = require("worker_threads");
const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const path = require("path");

const jsonFileName = path.join(
  __dirname,
  `../public/${new Date().getTime()}.json`
);

const readStream = fs.createReadStream(workerData.path);
const writeStream = fs.createWriteStream(jsonFileName, {
  encoding: "utf8",
});
let jsonArray = [];

//--------------------------------------------------------------------------------------------------------------
const restructureObject = (obj) => {
  try {
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
    jsonArray.push(clone);
    return clone;
  } catch (error) {
    console.log(error);
  }
};
//--------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------
const restructureTransform = new Transform({
  objectMode: true,
  transform: (chunk, enc, callback) => {
    restructureObject(JSON.parse(chunk));
    callback(null);
  },
});
//--------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------
const excute = async () => {
  try {
    console.time("converting");
    await pipeline(readStream, csv(), restructureTransform);
    console.timeEnd("converting");
    writeStream.write(JSON.stringify(jsonArray));
    parentPort.postMessage(jsonFileName);
  } catch (error) {
    console.log(error);
    parentPort.postMessage(
      "Internal error, please make sure the first line of the .csv file contains the keys (field names)"
    );
  }
};
//--------------------------------------------------------------------------------------------------------------

excute();
