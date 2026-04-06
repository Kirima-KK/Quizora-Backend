class MongoDBConnectionFailedError extends Error {
  public statusCode: Number;

  constructor(message: string, statusCode: Number = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

export default MongoDBConnectionFailedError;