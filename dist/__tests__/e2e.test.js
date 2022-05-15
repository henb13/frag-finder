"use strict";
const { getFrags } = require("../lib/get-frags");
const { createFiles } = require("../lib/create-files");
const fs = require("fs").promises;
const path = require("path");
describe("end to end", () => {
    it("should export the file with the right highlights", async () => {
        const correctFile = await fs.readFile(path.join(__dirname, "/correct.txt"), {
            encoding: "utf8",
        });
        const highlights = await getFrags({ jsonDir: path.join(__dirname, "/json") });
        await createFiles(highlights, { outDir: path.join(__dirname, "/exports") });
        const highlightFile = await fs.readFile(path.join(__dirname, "/exports/highlights.txt"), {
            encoding: "utf8",
        });
        expect(correctFile.replace(/(\r\n|\n|\r)/gm, "")).toEqual(highlightFile.replace(/(\r\n|\n|\r)/gm, ""));
    });
});
