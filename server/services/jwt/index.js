import jwt from 'jsonwebtoken';
import Promise from 'bluebird';
import { jwtSecret } from '../../config';

const jwtSign = Promise.promisify(jwt.sign);
const jwtVerify = Promise.promisify(jwt.verify);

export const sign = (_id, options, method = jwtSign) =>
  method({ _id }, jwtSecret, options);

export const signSync = (_id, options) => sign(_id, options, jwt.sign);

export const verify = token => jwtVerify(token, jwtSecret);

export const verifyJWT = token => jwt.verify(token, jwtSecret);

export const signJWT = (payload, options) =>
  jwt.sign(payload, jwtSecret, options);
