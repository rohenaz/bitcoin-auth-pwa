import { BAP } from 'bsv-bap';
import type { BapMasterBackup } from 'bitcoin-backup';

/**
 * Verify that a user owns a specific BAP ID by checking their backup
 */
export function verifyProfileOwnership(backup: BapMasterBackup, bapId: string): boolean {
  try {
    const bap = new BAP(backup.xprv);
    bap.importIds(backup.ids);
    const ids = bap.listIds();
    return ids.includes(bapId);
  } catch (error) {
    console.error('Error verifying profile ownership:', error);
    return false;
  }
}

/**
 * Get all BAP IDs from a backup
 */
export function getBapIdsFromBackup(backup: BapMasterBackup): string[] {
  try {
    const bap = new BAP(backup.xprv);
    bap.importIds(backup.ids);
    return bap.listIds();
  } catch (error) {
    console.error('Error getting BAP IDs from backup:', error);
    return [];
  }
}