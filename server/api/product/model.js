import mongoose, { Schema } from 'mongoose';

const productSchema = new Schema(
  {
    partId: {
      type: String,
      required: true
    },
    partNumber: {
      type: String,
      required: true
    },
    partDescription: {
      type: String,
      required: true
    },
    basePartNumber: {
      type: String,
      required: true
    },
    airCraftSeries: {
      type: String,
      required: true
    },
    airCraftModel: {
      type: String,
      required: true
    },
    engineType: {
      type: String,
      required: true
    },
    ataNumber: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const model = mongoose.model('products', productSchema);

export const schema = model.schema;
export default model;
