import { randomBytes } from "node:crypto";

/**
 * Generate a cryptographically strong random token
 *
 * @throws If crypto.randomBytes() throw error
 */
export default async function generateCryptographicallyStrongRandomToken(): Promise<string> {
  return new Promise((resolve, reject) => {
    randomBytes(32, function (err, buffer) {
      if (err) {
        reject(err);
        return;
      }

      const token = buffer.toString("hex");
      resolve(token);
    });
  });
}
