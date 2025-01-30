const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(name, email, id) {
    this.name = name;
    this.email = email;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .catch((err) => {
        console.error(err);
      });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection("users").findOne({ _id: new ObjectId(userId) });
  }
}

module.exports = User;
