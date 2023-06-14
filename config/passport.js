import bcrypt from 'bcryptjs';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../models/user.js';

/* Local Verification */

const localVerify = async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return done(null, false, { message: 'Incorrect username' });
    }

    bcrypt.compare(password, user.password, (err, res) => {
      if (res) {
        // passwords match! log user in
        return done(null, user);
      } else {
        // passwords do not match!
        return done(null, false, { message: 'Incorrect password' });
      }
    });
  } catch (err) {
    return done(err);
  }
};

/* JWT Verification */

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_PUBLIC_KEY;
opts.algorithms = ['RS256'];

const jwtVerify = async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
};

export default (passport) => {
  passport.use('local', new LocalStrategy(localVerify));
  passport.use('jwt', new JwtStrategy(opts, jwtVerify));
};
