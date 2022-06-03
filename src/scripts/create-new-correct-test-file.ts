import { getFrags } from "../lib/get-frags";
import { createFiles } from "../lib/create-files";
import path from "path";
import { LOG } from "../lib/utils/logger";

(async function () {
  try {
    const highlights = await getFrags({
      jsonDir: path.join(__dirname, "..", "__tests__", "json"),
    });
    await createFiles(highlights, {
      outDir: path.join(__dirname, "..", "__tests__"),
      fileName: "correct.txt",
    });
    LOG("files created!");
  } catch (e) {
    LOG("something went wrong:", e);
  }
})();
