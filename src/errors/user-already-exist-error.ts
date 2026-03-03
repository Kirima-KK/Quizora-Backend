class UserAlreadyExistError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message); // Calls the parent Error constructor
    this.name = this.constructor.name; // Set the error name to the class name
    this.statusCode = statusCode; // Add the custom status code property
  }
}

export default UserAlreadyExistError;