export interface DeviceLinkToken {
  bapId: string;
  address: string;
  idKey: string;
  createdAt: string;
}

export interface DeviceLinkResponse {
  url: string;
  token: string;
  expiresIn: number;
}

export interface DeviceLinkValidateResponse {
  bapId: string;
  address: string;
  idKey: string;
  encryptedBackup: string;
}