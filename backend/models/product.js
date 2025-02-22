// const { getDb } = require("../util/database");
// const { ObjectId } = require("mongodb");

// class Product {
//   constructor(title, type, size, originalname, filename, path, userId) {
//     this.title = title;
//     this.type = type;
//     this.size = size;
//     this.originalname = originalname;
//     this.filename = filename;
//     this.path = path;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     return db
//       .collection("products")
//       .insertOne(this)
//       .then((result) => {})
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static fetchAll(userId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .find({ userId: new ObjectId(userId) })
//       .toArray()
//       .then((products) => {
//         // console.log(products);
//         return products;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }

//   static findById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .findOne({ _id: new ObjectId(productId) })
//       .then((product) => {
//         // console.log(product);
//         return product;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }

//   static update(id, updatedFields) {
//     const db = getDb();
//     const objectId = new ObjectId(id);
//     return db
//       .collection("products")
//       .updateOne({ _id: objectId }, { $set: updatedFields })
//       .then((result) => {
//         return result;
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   }

//   static deleteById(productId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new ObjectId(productId) })
//       .then((result) => {
//         // console.log(result);
//         return result;
//       })
//       .catch((err) => {
//         console.log(err);
//         throw err;
//       });
//   }
// }

// module.exports = Product;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: false,
      trim: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    originalname: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // maybe false
    },
    transcriptionData: {
      type: [Schema.Types.Mixed],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
