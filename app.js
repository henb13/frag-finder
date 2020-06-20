const getFrags = require("./lib/get-frags.js");
const createFiles = require("./lib/create-files.js");

getFrags("./json")
  .then(highlights => {
    createFiles(highlights).then(() => {
      console.log("files created!");
    });
  })
  .catch(err => console.log(err.message));
