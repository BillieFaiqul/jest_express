const { ResponseHandler, verifyToken } = require("../../utils");

class AuthenticationMiddleware {
  static auth(req, res, next) {
    const bearerToken = req.headers["authorization"];
    if (!bearerToken) {
      return ResponseHandler.error(res, "credentials mandatory", "", 401);
    }

    const [bearer, token] = bearerToken.split(" ");

    if (bearer !== "Bearer" || !token) {
      return ResponseHandler.error(res, "Invalid token format", "", 401);
    }

    if (!token) {
      return ResponseHandler.error(res, "No token provided", "", 401);
    }

    try {
      const decodedJwt = verifyToken(token, process.env.JWT_SECRET);
      req.userData = decodedJwt.payload;

      next();
    } catch (error) {
      console.log(error);
      return ResponseHandler.error(res, error.message ?? "internal server error", error, 401);
    }
  }
}

module.exports = AuthenticationMiddleware;
