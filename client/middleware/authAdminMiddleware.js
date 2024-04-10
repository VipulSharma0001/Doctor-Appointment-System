const JWT = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  
  if (!token) {
    return res.status(401).send({
      message: "Auth Failed: No token provided",
      success: false,
    });
  }

  JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({
        message: "Auth Failed: Invalid token",
        success: false,
      });
    }

    // Attach decoded user ID to request object
    req.body.userId = decode.id;
    next();
  });
};
