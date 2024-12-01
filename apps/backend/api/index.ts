import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { name = "익명" } = request.query;
  response.status(200).json({
    message: `안녕하세요 ${name}님!`,
  });
}
