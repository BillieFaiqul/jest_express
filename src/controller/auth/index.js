const { UserModel } = require("../../model");
const { ResponseHandler, generateToken } = require("../../utils");
const bcrypt = require('bcrypt')

const User = new UserModel();

class AuthController {
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const existedEmail = await User.findByEmail(email);
            if (!existedEmail) {
                const error = new Error("Email not found");
                console.log(error);
                return ResponseHandler.error(res, "Email not found", error, 400);
            }
            const isPasswordValid = await bcrypt.compare(password, existedEmail.password);
            if (!isPasswordValid) {
                const error = new Error("Invalid password");
                console.log(error);
                return ResponseHandler.error(res, "Invalid password", error, 400);
            }

            const payloadJwt = { id: existedEmail.id, email: existedEmail.email };
            const newTokenJwt = generateToken({ payload: payloadJwt });
            const payloadBody = {
                token: newTokenJwt,
                id: existedEmail.id,
                full_name: existedEmail.full_name,
                email: existedEmail.email
            };
            ResponseHandler.success(res, "login successful", payloadBody, 200);
        } catch (error) {
            console.log(error);
            ResponseHandler.error(res, "internal server error", error, 500);
        }
    }

    async register(req, res) {
        try {
            const bodyRequest = req.body;

            const existedId = await User.findById(bodyRequest.id);
            if (existedId) {
                const error = new Error("existed id")
                return ResponseHandler.error(res, "failed insert, id is existed", error, 400);
            }
            const existedEmail = await User.findByEmail(bodyRequest.email);
            if (existedEmail) {
                const error = new Error("existed email");
                return ResponseHandler.error(res, "failed insert, email is existed", error, 400);
            }
            const saltRounds = 10;
            const stringPassword = bodyRequest.password;
            const hashedPassword = await bcrypt.hash(stringPassword, saltRounds);

            const data = {
                id: bodyRequest.id,
                full_name: bodyRequest.full_name,
                email: bodyRequest.email,
                password: hashedPassword,
            };

            const result = await User.create(data);
            return ResponseHandler.success(res, "Registrasi berhasil", result, 201);
        } catch (error) {
            console.log(error);
            ResponseHandler.error(res, "internal server error", error, 500);
        }
    }
}

module.exports = { authController: new AuthController() };
