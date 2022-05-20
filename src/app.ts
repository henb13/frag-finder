export {};
const { getFrags } = require("./lib/get-frags");
const { createFiles } = require("./lib/create-files");
const { LOG } = require("./lib/utils/logger");

(async function () {
  try {
    const highlights = await getFrags();
    await createFiles(highlights);
    LOG("files created!");
  } catch (e) {
    LOG("something went wrong:", e);
  }
})();
