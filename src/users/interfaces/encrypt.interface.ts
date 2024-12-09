export interface IEncrypt {
  encryptedData: string;
  iv: string,
  authTag: string;
}