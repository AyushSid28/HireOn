export const generateOtp = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expireAt = new Date(Date.now() + 5 * 60 * 1000); // expires in 5 min
  return { code, expireAt };
};

export const verifyOtp = (storedCode, enteredCode, expireAt) => {
  return storedCode === enteredCode && new Date() < new Date(expireAt);
};