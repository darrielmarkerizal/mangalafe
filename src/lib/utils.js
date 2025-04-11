import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const secret =
  process.env.ENCRYPTION_SECRET ||
  "v9TAgQ5nmGj761ev9EuNJ6bKdrFTMQ4AdkvV3D91vVmJuqxkwWdknA6ZnvB9sA0WUjsApoK7bntmpQbQF0";

export function encryptData(data) {
  const ciphertext = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    secret
  ).toString();
  return ciphertext;
}

export function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secret);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}
