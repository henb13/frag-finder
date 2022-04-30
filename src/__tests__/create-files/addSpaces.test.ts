const { addSpaces } = require("../../lib/create-files");

describe("addSpaces works", () => {
    it("should return four spaces", () => {
        expect(addSpaces(4)).toBe("    ");
    });
    it("should return an empty string", () => {
        expect(addSpaces(0)).toBe("");
    });
});
