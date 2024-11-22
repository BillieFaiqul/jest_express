class ResponseHandler {
    static success(res, message, data, statusCode = 200) {
      const bodyResponse = {
        status: "success",
        message,
        data,
      };
  
      console.log(`[INFO]: endpoint hitted | message: ${message} | data:${data}`);
  
      return res.status(statusCode).json(bodyResponse);
    }
  
    static error(res, message, error, statusCode = 500) {
      const bodyResponse = {
        status: "error",
        message,
        error,
      };
  
      console.log(`[INFO]: endpoint hitted | message: ${message} | error:${error}`);
  
      return res.status(statusCode).json(bodyResponse);
    }
  }
  
  module.exports = ResponseHandler;
  