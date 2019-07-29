const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // authorization: Bearer jrbtkbdg345bwkkrhkkjbrtw
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "secret_for_token");
    req.userData = {
      email: decodedToken.email,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized"
    })
  }
}