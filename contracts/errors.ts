export class UEAError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = "UEAError";
  }

  static notFound(resource: string) {
    return new UEAError(`${resource} not found`, "NOT_FOUND", 404);
  }

  static badRequest(message: string) {
    return new UEAError(message, "BAD_REQUEST", 400);
  }

  static internal(message: string = "Internal server error") {
    return new UEAError(message, "INTERNAL_ERROR", 500);
  }
}
