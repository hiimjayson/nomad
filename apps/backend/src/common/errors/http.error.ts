export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, data?: unknown) {
    super(400, message, data);
    this.name = "BadRequestError";
  }
}
