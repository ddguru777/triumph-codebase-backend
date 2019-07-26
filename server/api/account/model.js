import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import { env } from '../../config';

const accountSchema = new Schema(
  {
    email: {
      type: String,
      match: /^\S+@\S+\.\S+$/,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
      select: false
    }
  },
  {
    timestamps: true
  }
);

accountSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next();

  /* istanbul ignore next */
  const rounds = env === 'test' ? 1 : 9;

  bcrypt
    .hash(this.password, rounds)
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(next);
});

accountSchema.methods = {
  view() {
    let view = {};
    let fields = ['_id', 'email'];

    fields.forEach(field => {
      view[field] = this[field];
    });

    return view;
  },

  authenticate(password) {
    return bcrypt.compareSync(password, this.password);
  }
};

const model = mongoose.model('accounts', accountSchema);

export const schema = model.schema;
export default model;
