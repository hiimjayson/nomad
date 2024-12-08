import dotenv from "dotenv";
dotenv.config();

import { SmsClient } from "@pickk/sens";

if (!process.env.NCP_ACCESS_KEY) throw new Error("NCP_ACCESS_KEY is required");
if (!process.env.NCP_SECRET_KEY) throw new Error("NCP_SECRET_KEY is required");
if (!process.env.NCP_SMS_SECRET_KEY)
  throw new Error("NCP_SMS_SECRET_KEY is required");
if (!process.env.NCP_SMS_SERVICE_ID)
  throw new Error("NCP_SMS_SERVICE_ID is required");
if (!process.env.NCP_CALLING_NUMBER)
  throw new Error("NCP_CALLING_NUMBER is required");

export const smsClient = new SmsClient({
  accessKey: process.env.NCP_ACCESS_KEY,
  secretKey: process.env.NCP_SECRET_KEY,
  smsSecretKey: process.env.NCP_SMS_SECRET_KEY,
  smsServiceId: process.env.NCP_SMS_SERVICE_ID,
  callingNumber: process.env.NCP_CALLING_NUMBER,
});
