const updateProfile = async (req, res) => {
  // console.log("req.user :>> ", req.user);
  // console.log("req.body :>> ", req.body);

  const { userName, email, userPicture, password } = req.body;
  const id = req.user._id;

  try {
    const updatedFields = {};
    if (userName) {
      const existingUsername = await userModel.findOne({ userName: userName });
      if (existingUsername && userName !== req.user.userName) {
        return res
          .status(400)
          .json({ errors: { msg: "Username already in use" } });
      }
      updatedFields.userName = userName;
    }
    if (email) {
      const existingEmail = await userModel.findOne({ email: email });
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (existingEmail && email !== req.user.email) {
        return res
          .status(400)
          .json({ errors: { msg: "Email already in use" } });
      }
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ errors: { msg: "email address is invalid" } });
      }
      updatedFields.email = email;
    }
    if (userPicture) {
      updatedFields.userPicture = userPicture;
    }
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          errors: { msg: "password should be at least 6 characters" },
        });
      }
      const hashedPassword = await passwordEncryption(req.body.password);
      updatedFields.password = hashedPassword;
    }
    const updatedUser = await userModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    return res
      .status(200)
      .json({ msg: "Update successful", user: updatedUser });
  } catch (error) {
    // console.log("error", error);
    res.status(500).json({ msg: "Error updating info", error: error });
  }
};
