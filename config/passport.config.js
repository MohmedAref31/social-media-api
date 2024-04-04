import passport from "passport";
import local from "passport-local";
import google from "passport-google-oauth2";
import User from "../models/user.model.js";
import { comparePassword } from "../utiles/password.utiles.js";

const LocalStrategy = local.Strategy;
const googleStrategy = google.Strategy;
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

  passport.use(
    new googleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BASE_URL}/api/v1/auth/google/redirect`,
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        let user;
        try {
          user = await User.findOne({ email: profile.email });
        } catch (error) {
          return done(error, null);
        }
        try {
          if (!user) {
            const password = (Math.random() * 1000000).toString(32).slice(-8)
            console.log(password)
            const newUser = new User({
              firstName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.email,
              password,
              profileImage: profile.picture,
            });
            await newUser.save();
            console.log("new user", newUser)
            return done(null, newUser);
          }
          return done(null, user)
        } catch (error) {
          return done(error, null);
        }
      }
    )
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
