import Product from './api/product/model';
import productsJSON from './data/products.json';

const seedDatabase = async () => {
  try {
    // add product data
    let productCounut = await Product.countDocuments();
    if (productCounut === 0) {
      for (let i = 0; i < productsJSON.length; i++) {
        await Product.create({ ...productsJSON[i] });
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export default seedDatabase;
