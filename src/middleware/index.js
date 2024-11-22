const AuthenticationMiddleware = require("./authentication");
const ValidatorMiddleware = require("./validator");

class MiddlewareManager {
  constructor() {
    // register middleware
    this.middleware = {
      auth: AuthenticationMiddleware.auth,
      validator: {
        login: ValidatorMiddleware.validateLogin,
        register: ValidatorMiddleware.validateRegister,
      }
    };
  }

  use(name) {
    let middlewareUsed = null;
    if (name.includes(".")) {
      const parts = name.split(".");
      middlewareUsed = this.middleware[parts[0]][parts[1]];
    } else {
      middlewareUsed = this.middleware[name];
    }

    if (middlewareUsed === null || middlewareUsed === undefined) {
      throw new Error("middleware not found");
    }

    return middlewareUsed;
  }

}

module.exports = new MiddlewareManager();
