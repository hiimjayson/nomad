declare namespace Express {
  export interface Request {
    token?: string;
    tokenPayload?: { uid: string };
  }
}
