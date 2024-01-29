import jwt from "jsonwebtoken";

const generateToken = (userID) => {
  const payload = {
    sub: userID,
  };

  const secretOrPrivateKey = process.env.JWT_TOKENSECRET;

  const options = {
    expiresIn: "3 days",
  };

  const token = jwt.sign(payload, secretOrPrivateKey, options);
  return token;
};

export { generateToken };
