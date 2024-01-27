const otpGenerator = require("otp-generator");

const generateOTP = () => {
  const OTP = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const timestamp = Date.now();
  return { OTP, timestamp };
  // return OTP;
};

module.exports = generateOTP;