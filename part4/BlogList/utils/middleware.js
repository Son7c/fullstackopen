const jwt = require("jsonwebtoken");
const User = require("../models/users");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  try {
    if (req.token) {
      const decoded = jwt.verify(req.token, process.env.SECRET);
      const id = decoded.id;
      req.user = await User.findById(id);
    } else {
      req.user = null;
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { tokenExtractor, userExtractor };
