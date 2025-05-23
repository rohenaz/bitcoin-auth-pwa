import { redis, backupKey } from "./redis";
import {
  encryptBackup,
  decryptBackup,
  type DecryptedBackup,
  type EncryptedBackup,
} from 'bitcoin-backup';

export async function saveBackup(
  bapid: string,
  payload: DecryptedBackup,
  passphrase: string,
  iterations?: number,
): Promise<void> {
  const encryptedString = await encryptBackup(payload, passphrase, iterations);
  await redis.set(backupKey(bapid), encryptedString);
}

export async function loadBackup(
  bapid: string,
  passphrase: string,
): Promise<DecryptedBackup | null> {
  const encryptedString = await redis.get<EncryptedBackup>(backupKey(bapid));
  if (!encryptedString) return null;
  try {
    return await decryptBackup(encryptedString, passphrase);
  } catch (error) {
    console.error("Failed to decrypt backup:", error);
    // Depending on requirements, you might want to throw, or return null/specific error type
    return null;
  }
} 