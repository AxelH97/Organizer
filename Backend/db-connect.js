require("./config.js");
const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);
    console.log("DB connected");
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
    console.log("error:", error);
  }
};

connectMongoDB();
