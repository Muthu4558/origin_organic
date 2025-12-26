import crypto from "crypto";

const algorithm = "aes-128-cbc";

export const encrypt = (plainText, workingKey) => {
  const key = crypto.createHash("md5").update(workingKey).digest();
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");

  return encrypted;
};

export const decrypt = (encryptedText, workingKey) => {
  const key = crypto.createHash("md5").update(workingKey).digest();
  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
