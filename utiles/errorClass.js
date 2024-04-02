
export class ApiError extends Error {
    constructor(message, status, statusCode){
        super(message);
        // this.message = message || "internal server error";
        this.status = status || "error";
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this)
    }
}