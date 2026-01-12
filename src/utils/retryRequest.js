export const retryRequest = async (
  fn,
  retries = 2,
  delay = 1200
) => {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise((res) => setTimeout(res, delay));
    return retryRequest(fn, retries - 1, delay);
  }
};
