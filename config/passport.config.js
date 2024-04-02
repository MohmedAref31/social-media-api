import passport from "passport";
import local from "passport-local";
import User from "../models/user.model.js";
import { comparePassword } from "../utiles/password.utiles.js";

const LocalStrategy = local.Strategy;

export const usePassport = () => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async function verify(
      email,
      password,
      done
    ) {
      try {
        const user = await User.findOne({ email });

        if (!user) return done(null, false, { message: "wrong email" });
        if (!comparePassword(password, user.password))
          return done(null, false, { message: "wrong password" });

        done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (userId, done) => {
    try {
      const user = await User.findById(userId);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
