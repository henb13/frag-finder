import { getFrags } from "../lib/get-frags";
import { createFiles } from "../lib/create-files";
import { promises as fs } from "fs";
import path from "path";

describe("end to end", () => {
  it("should export the file with the right highlights", async () => {
    expect.assertions(1);

    const correctFile = await fs.readFile(path.join(__dirname, "/correct.txt"), {
      encoding: "utf8",
    });

    const highlights = await getFrags({ jsonDir: path.join(__dirname, "/json") });

    await createFiles(highlights, { outDir: path.join(__dirname, "/exports") });

    const highlightFile = await fs.readFile(path.join(__dirname, "/exports/highlights.txt"), {
      encoding: "utf8",
    });

    expect(correctFile.replace(/(\r\n|\n|\r)/gm, "")).toBe(
      highlightFile.replace(/(\r\n|\n|\r)/gm, "")
    );
  });
});
