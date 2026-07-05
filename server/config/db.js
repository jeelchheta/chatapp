import Mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

Mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

Mongoose.connection.on("connected", () => {
  console.log("Mongo has connected succesfully");
});
Mongoose.connection.on("reconnected", () => {
  console.log("Mongo has reconnected");
});
Mongoose.connection.on("error", (error) => {
  console.log("Mongo connection has an error", error);
  mongoose.disconnect();
});
Mongoose.connection.on("disconnected", () => {
  console.log("Mongo connection is disconnected");
});

export default Mongoose
