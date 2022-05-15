export function LOG(...args: any) {
    if (process.env.NODE_ENV !== "test") {
        console.log(...args);
    }
}
