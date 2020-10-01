const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  //check for errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //destructuring
  const { email, password } = req.body;

  try {
    //Check if exist a previously user registered
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "Already exist an user with this email" });
    }

    //create new user
    user = new User(req.body);

    //hash password
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    //save user
    await user.save();

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
    res.status(400).send(error); //"Error creating user"
  }
};
