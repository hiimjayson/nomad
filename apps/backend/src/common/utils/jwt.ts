import jwt from "jsonwebtoken";

if (!process.env.JWT_ACCESS_SECRET)
  throw new Error("JWT_ACCESS_SECRET is required");
if (!process.env.JWT_REFRESH_SECRET)
  throw new Error("JWT_REFRESH_SECRET is required");

interface TokenPayload {
  uid: string;
  type: "access" | "refresh";
}

export function generateAccessToken(uid: string): string {
  return jwt.sign(
    { uid, type: "access" } as TokenPayload,
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );
}

export function generateRefreshToken(uid: string): string {
  return jwt.sign(
    { uid, type: "refresh" } as TokenPayload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
}

export function generateTokens(uid: string) {
  return {
    accessToken: generateAccessToken(uid),
    refreshToken: generateRefreshToken(uid),
  };
}
