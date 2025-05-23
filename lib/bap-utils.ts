import { BAP } from 'bsv-bap';
import { PrivateKey } from '@bsv/sdk';
import { getAuthToken } from 'bitcoin-auth';
import type { BapMasterBackup } from 'bitcoin-backup';

export interface ExtractedIdentity {
  id: string;
  privateKey: string;
  pubkey: string;
  address: string;
  idKey: string;
}

/**
 * Extract identity information from a BAP backup
 */
export function extractIdentityFromBackup(backup: BapMasterBackup): ExtractedIdentity {
  const bap = new BAP(backup.xprv);
  bap.importIds(backup.ids);
  const ids = bap.listIds();
  const id = ids[0] || bap.newId().identityKey;
  const master = bap.getId(id);
  const memberBackup = master?.exportMemberBackup();
  
  if (!memberBackup?.derivedPrivateKey) {
    throw new Error('No private key found in backup');
  }
  
  const pubkey = PrivateKey.fromWif(memberBackup.derivedPrivateKey).toPublicKey();
  const address = pubkey.toAddress();
  
  return { 
    id, 
    privateKey: memberBackup.derivedPrivateKey, 
    pubkey: pubkey.toString(),
    address: address.toString(),
    idKey: id
  };
}

/**
 * Create an auth token from a BAP backup
 */
export function createAuthTokenFromBackup(
  backup: BapMasterBackup, 
  requestPath: string, 
  body: string = ''
): string {
  const { privateKey } = extractIdentityFromBackup(backup);
  
  return getAuthToken({
    privateKeyWif: privateKey,
    requestPath,
    body
  });
}