"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_frags_1 = require("./lib/get-frags");
const create_files_1 = require("./lib/create-files");
(async function () {
    try {
        const highlights = await (0, get_frags_1.getFrags)();
        await (0, create_files_1.createFiles)(highlights);
        console.log("files created!");
    }
    catch (e) {
        console.log("something went wrong:", e);
    }
})();
