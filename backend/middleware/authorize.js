// middleware/authorize.js
const jwt = require("jsonwebtoken");

function authorizeSeller(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];
  try {
    // فك التشفير والتحقق من الـ token
    const decoded = jwt.verify(token, "secret_key"); // تأكد من أن الـ secret_key هو نفسه الذي استخدمته في login

    // التحقق من الدور
    if (decoded.role !== "seller") {
      return res.status(403).json({ message: "Access denied. Only sellers can post products." });
    }

    req.user = decoded; // يمكن الوصول إلى البيانات في الـ token من خلال req.user
    next();
  } catch (err) {
    return res.status(400).json({ message: "Invalid token", error: err });
  }
}

module.exports = { authorizeSeller };

