import { JwtPayload } from "src/authorization/types";

export function decodeJwtHeaders(token: string): JwtPayload | undefined {
  if (token) {
    const tokenSplit = token.split('.');
    if (tokenSplit.length !== 3) {
      console.error(`The token is invalid type - ${token}`);
      return undefined;
    }

    const payloadBuffer = Buffer.from(tokenSplit[1], 'base64');
    const jwtDocoded: JwtPayload = JSON.parse(
      payloadBuffer.toString(),
    ) as JwtPayload;
    return jwtDocoded;
  }
  return undefined;
}
