import { Router } from 'express';
import { login, registerAccount } from './controller';
import { password } from '../../services/passport';

const router = new Router();

/**
 * @api {post} /v1/account/login Account Login
 * @apiName Authenticate
 * @apiGroup account
 * @apiParam {email, password}
 */
router.post('/login', password(), login);

/**
 * @api {post} /v1/account/register Account Register
 * @apiName Account Register
 * @apiGroup account
 * @apiParam {email, password}
 */
router.post('/register', registerAccount);

export default router;
