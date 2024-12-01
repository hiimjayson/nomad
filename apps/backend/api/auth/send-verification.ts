import { VercelRequest, VercelResponse } from "@vercel/node";
import { authService } from "../../features/auth/auth.service";
import { SendVerificationRequest } from "../../features/auth/auth.dto";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { phoneNumber } = request.body as SendVerificationRequest;

    if (!phoneNumber) {
      return response.status(400).json({ message: "Phone number is required" });
    }

    await authService.sendVerification(phoneNumber);

    return response.status(200).json({ message: "Verification code sent" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    return response.status(500).json({ message: "Internal server error" });
  }
}
