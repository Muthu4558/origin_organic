import CryptoJS from "crypto-js";

const workingKey = process.env.CCAVENUE_WORKING_KEY; // 32 char key
const accessCode = process.env.CCAVENUE_ACCESS_CODE;

export const encrypt = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, workingKey).toString();
};

export const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, workingKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export { accessCode };
