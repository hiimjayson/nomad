import dotenv from "dotenv";
dotenv.config();

import jsonwebtoken from "jsonwebtoken";

interface TokenPayload {
  uid: string;
}

export class JwtService {
  private accessSecret: string;
  private refreshSecret: string;

  constructor() {
    if (!process.env.JWT_ACCESS_SECRET)
      throw new Error("JWT_ACCESS_SECRET is required");
    if (!process.env.JWT_REFRESH_SECRET)
      throw new Error("JWT_REFRESH_SECRET is required");

    this.accessSecret = process.env.JWT_ACCESS_SECRET;
    this.refreshSecret = process.env.JWT_REFRESH_SECRET;
  }

  generateAccessToken(payload: TokenPayload, expiresIn: string): string {
    return jsonwebtoken.sign(payload, this.accessSecret, {
      expiresIn,
    });
  }

  generateRefreshToken(payload: TokenPayload, expiresIn: string): string {
    return jsonwebtoken.sign(payload, this.refreshSecret, {
      expiresIn,
    });
  }

  generateTokens(payload: TokenPayload) {
    return {
      accessToken: this.generateAccessToken(payload, "1h"),
      refreshToken: this.generateRefreshToken(payload, "7d"),
    };
  }
}

export const jwt = new JwtService();
