export {};
const { getFrags } = require("./lib/get-frags.ts");
const { createFiles } = require("./lib/create-files.ts");

(async function () {
    try {
        const highlights = await getFrags();
        await createFiles(highlights);
        console.log("files created!");
    } catch (e) {
        console.log("something went wrong:", e);
    }
})();
