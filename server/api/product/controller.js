import { notFound, handleError, handleSuccess } from '../../services/response/';
import Product from './model';

export const getProductById = async (req, res, next) => {
  try {
    let product = await Product.findOne({ _id: req.params._id });
    if (!product) {
      return notFound(res);
    }
    handleSuccess(res, { product });
  } catch (err) {
    handleError(res, err);
  }
};
