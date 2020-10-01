const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  //Read the token from header
  const token = req.header("x-auth-token");

  //Check if the token exist
  if (!token) {
    return res
      .status(401)
      .json({ msg: "There is not token, invalid authorization" });
  }

  //Validate token
  try {
    const verify = jwt.verify(token, process.env.SECRET);
    req.user = verify.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
