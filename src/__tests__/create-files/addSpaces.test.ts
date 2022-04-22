const { addSpaces } = require("../../lib/create-files");

describe("addSpaces works", () => {
    test("should return four spaces", () => {
        expect(addSpaces(4)).toBe("    ");
    });
});
