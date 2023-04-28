import { MongoClient, Db } from "mongodb";
import { Data } from "./config";

let database: Db;

const connectToMongoDb = async () => {
  try {
    if (!database) {
      const cl = await MongoClient.connect(Data.DATABASE_URL);
      database = cl.db(Data.DATABASE_NAME);
    }
  } catch (err) {
    console.log("faied to connect to atlas", err);
  }
};
connectToMongoDb()
  .then(() => {})
  .catch((err) => console.log(err));

export const asyncConnectToMongodb = async () => {
  try {
    const client = await MongoClient.connect(Data.DATABASE_URL);
    return client.db(Data.DATABASE_NAME);
  } catch (err) {
    console.log("faied to connect to atlas", err);
    return undefined;
  }
};

export const getDatabase = () => database;
