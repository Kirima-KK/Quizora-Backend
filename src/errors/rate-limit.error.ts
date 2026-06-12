class RateLimitError extends Error {
  public statusCode: number;
  public retryAfter: number;

  constructor(message: string = "Too many requests, please try again later.", retryAfter: number = 60) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = 429;
    this.retryAfter = retryAfter;
  }
}

export default RateLimitError;
