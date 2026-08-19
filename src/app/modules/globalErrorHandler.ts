class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;

    this.status = statusCode >= 400 && statusCode < 500
      ? "fail"
      : "error";

    this.isOperational = true;

    Object.setPrototypeOf(this, AppError.prototype);

    Error.captureStackTrace(
      this,
      this.constructor
    );
  }
}

export default AppError;