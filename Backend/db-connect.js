// db-connect.js

require("./config.js");
const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log("DB connected");

    mongoose.connection.on("connected", async () => {
      try {
        const collections = await mongoose.connection.db
          .listCollections()
          .toArray();
        const collectionsNames = collections.map(async (collection) => {
          const documentsAmount = await mongoose.connection.db
            .collection(collection.name)
            .countDocuments();
          return { name: collection.name, documentsAmount };
        });
        console.log("collections infos:", await Promise.all(collectionsNames));
      } catch (error) {
        console.error("Error getting collections info:", error);
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectMongoDB();

module.exports = connectMongoDB;
