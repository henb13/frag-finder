"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelizeIsh = void 0;
function camelizeIsh(text) {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
    return text;
}
exports.camelizeIsh = camelizeIsh;
