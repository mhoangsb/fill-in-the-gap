import { randomBytes } from "node:crypto";

export default async function generateCryptographicallyStrongRandomToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(32, function (err, buffer) {
      if (err) {
        reject(err);
      }

      const token = buffer.toString("hex");
      resolve(token);
    });
  });
}
