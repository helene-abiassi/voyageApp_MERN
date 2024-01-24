import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import userModel from "../models/userModel.js";

const opts = {
  secretOrKey: "ilyaunBobby",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtPassportStrategy = new JwtStrategy(opts, async function (
  jwt_payload,
  done
) {
  try {
    const user = await userModel.findById(jwt_payload.sub).populate([
      {
        path: "bookmarks",
        populate: { path: "author", select: ["username"] },
      },
      {
        path: "submissions",
        populate: { path: "author", select: ["username"] },
      },
    ]);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error, false);
  }
});

const passportConfig = (passport) => {
  passport.use(jwtPassportStrategy);
};

export default passportConfig;
