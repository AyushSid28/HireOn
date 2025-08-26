import twilio from "twilio";

export const generateOtp = () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expireAt = new Date(Date.now() + 5 * 60 * 1000); 
  return { code, expireAt };
};

export const verifyOtp = (storedCode, enteredCode, expireAt) => {
  return storedCode === enteredCode && new Date() < new Date(expireAt);
};

export const sendSmsOtp = async (phoneNumber, otp) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: `Your HireON password reset OTP is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    console.log('SMS sent successfully:', message.sid);
    return message;
  } catch (error) {
    console.error('Twilio SMS error:', error);
    throw error;
  }
};