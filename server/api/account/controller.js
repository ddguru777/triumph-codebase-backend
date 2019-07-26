import { sign } from '../../services/jwt';
import { handleError, handleSuccess } from '../../services/response/';
import { AccountService } from './service';

export const login = async ({ user }, res, next) => {
  try {
    let token = await sign(user._id);
    handleSuccess(res, { token, account: user.view() });
  } catch (err) {
    handleError(res, err);
  }
};

/**
 * Register Account
 */
export const registerAccount = async (req, res, next) => {
  try {
    // const { email, firstName, lastName, password } = req.body;
    await AccountService.registerAccount(req.body);
    handleSuccess(res, {
      message: 'Successfully registered'
    });
  } catch (err) {
    if (err.name === 'MongoError' && err.code === 11000) {
      handleError(res, createError(400, 'Email already exists'));
    } else {
      handleError(res, err);
    }
  }
};
