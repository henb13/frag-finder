const { getFrags } = require("../lib/get-frags");
const { createFiles } = require("../lib/create-files");
const fs = require("fs").promises;

describe("end to end", () => {
    it("should export the file with the right highlights", async () => {
        const correctFile = await fs.readFile(__dirname + "/correct.txt", {
            encoding: "utf8",
        });
        const highlights = await getFrags({ jsonDir: __dirname + "/json" });
        await createFiles(highlights, { outDir: __dirname + "/exports" });
        const highlightFile = await fs.readFile(__dirname + "/exports/highlights.txt", {
            encoding: "utf8",
        });
        expect(correctFile.replace(/(\r\n|\n|\r)/gm, "")).toEqual(
            highlightFile.replace(/(\r\n|\n|\r)/gm, "")
        );
    });
});
