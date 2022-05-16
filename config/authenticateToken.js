const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
// const crypto = require('crypto');

module.exports = authenticateToken = (req, res, next) => {

   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   console.log("token", token,req.headers);
   if (token == null) return  res.status(401).json({
    errors: [
      {
        msg: "No token, authorization denied",
      },
    ],
  }); // if there isn't any token

   jwt.verify(token, opts.secretOrKey, (err, user) => {
     console.log(err)
     if (err) return res.status(401).json({
      errors: [
        {
          msg: "Token is not valid",
        },
      ],
    });
     req.user = user
     next() // pass the execution off to whatever request the client intended
   })
};