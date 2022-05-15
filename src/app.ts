import { getFrags } from "./lib/get-frags";
import { createFiles } from "./lib/create-files";

(async function () {
    try {
        const highlights = await getFrags();
        await createFiles(highlights);
        console.log("files created!");
    } catch (e) {
        console.log("something went wrong:", e);
    }
})();
