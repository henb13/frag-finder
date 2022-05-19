import { getFrags } from "./lib/get-frags";
import { createFiles } from "./lib/create-files";
import { LOG } from "./lib/utils/logger";

(async function () {
  try {
    const highlights = await getFrags();
    await createFiles(highlights);
    LOG("files created!");
  } catch (e) {
    LOG("something went wrong:", e);
  }
})();
