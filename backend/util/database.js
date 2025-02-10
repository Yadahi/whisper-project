const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express"); // Assuming you are using Express
const app = express();

const port = process.env.PORT || 3000;

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.hj64t13.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run(server) {
  try {
    // Connect the client to the server
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db(process.env.MONGO_DB).command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // Start the server only after a successful database connection
    server.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

// Call the function to run the application
const runServer = run;

const getDb = () => {
  if (client.db()) {
    return client.db("transcript-app");
  }
  return null;
};

// Ensure the client will close when the Node.js process exits
process.on("SIGINT", async () => {
  console.log("Closing MongoDB client...");
  await client.close();
  console.log("MongoDB client closed.");
  process.exit(0);
});

module.exports = { runServer, getDb };
