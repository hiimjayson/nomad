import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { name = "Anonymous" } = request.query;
  response.status(200).json({
    message: `Hello ${name}!`,
  });
}
