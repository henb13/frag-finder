"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_frags_1 = require("../lib/get-frags");
const create_files_1 = require("../lib/create-files");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
describe("end to end", () => {
    it("should export the file with the right highlights", async () => {
        const correctFile = await fs_1.promises.readFile(path_1.default.join(__dirname, "/correct.txt"), {
            encoding: "utf8",
        });
        const highlights = await (0, get_frags_1.getFrags)({ jsonDir: path_1.default.join(__dirname, "/json") });
        await (0, create_files_1.createFiles)(highlights, { outDir: path_1.default.join(__dirname, "/exports") });
        const highlightFile = await fs_1.promises.readFile(path_1.default.join(__dirname, "/exports/highlights.txt"), {
            encoding: "utf8",
        });
        expect(correctFile.replace(/(\r\n|\n|\r)/gm, "")).toEqual(highlightFile.replace(/(\r\n|\n|\r)/gm, ""));
    });
});
