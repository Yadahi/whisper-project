const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class Product {
  constructor(title, type, size, originalname, filename) {
    this.title = title;
    this.type = type;
    this.size = size;
    this.originalname = originalname;
    this.filename = filename;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) })
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  static deleteById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }
}

module.exports = Product;
