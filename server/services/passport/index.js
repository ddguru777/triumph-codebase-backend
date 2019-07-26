import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { jwtSecret, masterKey } from '../../config';
import Account from '../../api/account/model';

export const password = () => async (req, res, next) => {
  const { email, password } = req.body;
  const account = await Account.findOne({ email }).select('+password');
  if (!account) {
    return res.status(404).json({ message: 'Email not found' });
  }

  if (!account.authenticate(password)) {
    return res.status(400).json({ message: 'Email or Password is incorrect.' });
  }

  req.logIn(account, { session: false }, err => {
    if (err) return res.status(401).end();
    next();
  });
};

export const master = () => passport.authenticate('master', { session: false });

export const token = ({ required } = {}) => (req, res, next) =>
  passport.authenticate('token', { session: false }, (err, account, info) => {
    if (err || (required && !account)) {
      return res.status(401).send({ message: 'UNAUTHORIZED' });
    }
    req.logIn(account, { session: false }, err => {
      if (err) {
        return res.status(401).send({ message: 'FAILED_FETCH_USER' });
      }
      next();
    });
  })(req, res, next);

export const extractJwt = ({ required } = {}) => (req, res, next) =>
  passport.authenticate(
    'info_token',
    { session: false },
    (err, tokenInfo, info) => {
      if (err || info) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      if (required && !tokenInfo) {
        return res.status(401).send({ message: 'Token not provided' });
      }
      req.tokenInfo = tokenInfo;
      next();
    }
  )(req, res, next);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password' // this is the virtual field on the model
    },
    (email, password, done) => {
      Account.findOne({ email })
        .select('+password')
        .then(account => {
          if (!account) {
            done(true);
            return null;
          }
          if (!account.authenticate(password)) {
            return done(null, false, {
              message: 'Email or Password is incorrect.'
            });
          }
          return done(null, account);
        });
    }
  )
);

passport.use(
  'master',
  new BearerStrategy((token, done) => {
    if (token === masterKey) {
      done(null, {});
    } else {
      done(null, false);
    }
  })
);

passport.use(
  'token',
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
      ])
    },
    ({ _id }, done) => {
      Account.findById(_id)
        .then(account => {
          done(null, account);
          return null;
        })
        .catch(done);
    }
  )
);

passport.use(
  'info_token',
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('token'),
        ExtractJwt.fromBodyField('token')
      ])
    },
    (info, done) => {
      done(null, info);
    }
  )
);
