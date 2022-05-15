export function camelizeIsh(text) {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
    return text;
}
