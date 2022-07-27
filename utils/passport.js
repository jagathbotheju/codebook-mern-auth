import passport from "passport";
import User from "../models/User";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";

const opts = {
  secretOrKey: process.env.APP_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  new JWTStrategy(opts, async ({ id }, done) => {
    try {
      const user = await User.findById(id);
      if (!user) throw new Error("User not found");
      return done(null, user.getUserInfo());
    } catch (error) {
      console.log(error);
      done(null, false);
    }
  })
);
