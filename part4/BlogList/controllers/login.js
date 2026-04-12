const jwt = require("jsonwebtoken");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const passwrordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwrordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }
  const userForToken={
    username,
    id:user._id
  }

  const token=jwt.sign(userForToken,process.env.SECRET);
  res.status(200).json({token,username,name:user.name});
});

module.exports=loginRouter;
