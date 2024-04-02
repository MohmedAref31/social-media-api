import mongoose from "mongoose";

export const connectDB = (dbUri) => {
  return mongoose
    .connect(dbUri)
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.log(`DB ERROR ${err}`));
};

// const connection = mongoose
//   .connect(dbUri)
//   .then(() => console.log("DB CONNECTED"))
//   .catch((err) => console.log(`DB ERROR ${err}`));
