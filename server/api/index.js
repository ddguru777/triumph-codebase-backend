import { Router } from 'express';
import account from './account';
import product from './product';

const router = new Router();

router.use('/account', account);
router.use('/product', product);

export default router;
