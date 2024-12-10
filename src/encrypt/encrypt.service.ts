import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { convertHexToBuffer, getPrivateKeyBuffer } from '../util/tools';
import { ErrorMessage } from '../util/error-message';

@Injectable()
export class EncryptService {
  private readonly logger = new Logger(EncryptService.name);
  constructor() {}
  decryptData(encryptedData: string, iv: string, authTag: string): string {
    try {
      const crypto = require('crypto');
      const privateKey = getPrivateKeyBuffer();

      const decipher = crypto.createDecipheriv(
        'AES-256-GCM',
        privateKey,
        convertHexToBuffer(iv),
      );
      decipher.setAuthTag(convertHexToBuffer(authTag));
      let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (err) {
      this.logger.error(err);
      throw new InternalServerErrorException(ErrorMessage.CONTACT_SERIVCE);
    }
  }
}
