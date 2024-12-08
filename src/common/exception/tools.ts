import { JwtPayload } from "src/authorization/types";

export function decodeJwtHeaders(token: string): JwtPayload | undefined {
  // Check if token is valid
  if (token) {
    // Split token to get payload
    const tokenSplit = token.split('.');
    // Check payload is valid if not valid return undefined
    if (tokenSplit.length !== 3) {
      console.error(`The token is invalid type - ${token}`);
      return undefined;
    }
    // Decode payload to get user information
    const payloadBuffer = Buffer.from(tokenSplit[1], 'base64');
    const jwtDocoded: JwtPayload = JSON.parse(
      payloadBuffer.toString(),
    ) as JwtPayload;
    return jwtDocoded;
  }
  return undefined;
}
