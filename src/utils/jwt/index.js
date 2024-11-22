const jwt = require("jsonwebtoken")
const {JWT_SECRET} = require("../../config/env")


exports.generateToken = (payload) =>{
    const newToken = jwt.sign({...payload}, JWT_SECRET, {expiresIn: "15h"});
    return newToken
}

exports.verifyToken = (token) => {
    const decode = jwt.verify(token, JWT_SECRET)
    return decode
}