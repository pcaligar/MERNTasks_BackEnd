const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.userAuthentication = async (req, res) => {
  //check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //destructuring
  const { email, password } = req.body;

  try {
    //Check if the user is already registered
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "The user doesn't exist" });
    }

    //check the passwoord
    const comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    //jwt, create payload and sign
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.SECRET,
      {
        expiresIn: 3600, //1hs
      },
      (error, token) => {
        if (error) throw error;

        //Confirmation message
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
