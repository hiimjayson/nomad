import { VercelRequest, VercelResponse } from "@vercel/node";
import { authService } from "../../features/auth/auth.service";
import { VerifyCodeRequest } from "../../features/auth/auth.dto";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== "POST") {
    return response.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { phoneNumber, code } = request.body as VerifyCodeRequest;

    if (!phoneNumber || !code) {
      return response
        .status(400)
        .json({ message: "Phone number and code are required" });
    }

    await authService.verifyCode(phoneNumber, code);

    return response.status(200).json({ message: "Verification successful" });
  } catch (error) {
    console.error("Error verifying code:", error);

    if (error instanceof Error) {
      return response.status(400).json({ message: error.message });
    }

    return response.status(500).json({ message: "Internal server error" });
  }
}
