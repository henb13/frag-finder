"use strict";
const { getFrags } = require("../lib/get-frags");
const { createFiles } = require("../lib/create-files");
const fs = require("fs").promises;
describe("end to end", () => {
    it("should export the file with the right highlights", async () => {
        const correctFile = await fs.readFile(__dirname + "/correct.txt");
        const highlights = await getFrags();
        await createFiles(highlights, { outDir: "exports" });
        const highlightFile = await fs.readFile("/exports/highlights.txt");
        expect(correctFile).toEqual(highlightFile);
    });
});
