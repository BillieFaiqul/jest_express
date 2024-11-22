const { loginObjects, registerObjects } = require("./auth")


const Joi = require("joi");

class ValidatorTool {
  static buildJoi(optionValidate) {
    return Joi.object(optionValidate).unknown(true);
  }

  static loginValidator() {
    const validator = this.buildJoi(loginObjects);
    return validator;
  }

  static registerValidator(){
    const validator = this.buildJoi(registerObjects);
    return validator;
  }

}

module.exports = {ValidatorTool}