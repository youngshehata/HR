const fs = require("fs");

// creating uploads folder , letters folder and its subfolders to avoid errors

const foldersArray = [
  { name: "uploads" },
  { name: "letters", subfolders: ["hospital", "resign", "vacation"] },
];

const createFolders = () => {
  try {
    foldersArray.forEach((folder) => {
      if (!fs.existsSync(`./${folder.name}`)) {
        fs.mkdir(`./${folder.name}`, (err) => {
          if (err) {
            console.log(`error while creating folders`);
            console.log(err);
          }
        });
      }
      // check for subfolders
      if (folder.subfolders) {
        folder.subfolders.forEach((subFolder) => {
          if (!fs.existsSync(`./${folder.name}/${subFolder}`)) {
            fs.mkdir(`./${folder.name}/${subFolder}`, (err) => {
              if (err) {
                console.log(`error while creating subfolders`);
                console.log(err);
              }
            });
          }
        });
      }
    });
  } catch (error) {
    console.log(`error while creating folders`);
    console.log(error);
  }
};

module.exports = createFolders;
