export function camelizeIsh(text: string): string {
    text = text.replace(/[-_\s.]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""));
    return text;
}
