// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function LOG(...args: any) {
  if (process.env.NODE_ENV !== "test") {
    console.log(...args);
  }
}

module.exports = {
  LOG,
};
