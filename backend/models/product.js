const { getDb } = require("../util/database");

class Product {
  constructor(title, type, size, originalname) {
    // this.id = id;
    this.title = title;
    this.type = type;
    this.size = size;
    this.originalname = originalname;
    // this.transcript = transcript;
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
}

module.exports = Product;
