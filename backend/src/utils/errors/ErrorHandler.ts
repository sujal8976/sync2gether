class ErrorHandler extends Error {
  constructor(
    public message: string, 
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    
    // Ensure proper prototype chain
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }

  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code
    };
  }
}

export default ErrorHandler;