import { Router } from 'express';
import { getProductById } from './controller';
import { token } from '../../services/passport';
export { default as Product, schema } from './model';

const router = new Router();

/**
 * @api {get} /v1/product/:_id Retrieve Product
 * @apiName RetrieveProduct
 * @apiGroup product
 * @apiSuccess {Object} product
 */
router.get(
  '/:_id',
  token({
    required: true
  }),
  getProductById
);

export default router;
