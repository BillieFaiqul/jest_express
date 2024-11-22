const { ResponseHandler, ValidatorTool } = require("../../utils");

class ValidatorMiddleware {
  static validateLogin(req, res, next) {
    const { error } = ValidatorTool.loginValidator().validate(req.bodyRequest, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMessages, {}, 400);
    }
    next();
  }

  static validateRegister(req, res, next) {
    const { error } = ValidatorTool.registerValidator().validate(req.bodyRequest, {
      abortEarly : false,
    });
    if (error){
      const errorMassage = error.details.map((detail) => detail.message);
      return ResponseHandler.error(res, errorMassage, {}, 400)
    }
    next();
  }
}

module.exports = ValidatorMiddleware;
