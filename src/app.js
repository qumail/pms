import mongoose from "mongoose";
import app from "./configs/express.js";
import 'dotenv/config'; 

const db = process.env.DB_URL || 'mongodb://localhost:27017/PMS';
const port = process.env.PORT || 3001;
const env = process.env.NODE_ENV;

mongoose.connect(db);

mongoose.connection.on("connected", function () {
  console.log({
    level: "info",
    message: `Server Connected to Mongoose @ ${db}`,
    fileName: "app.js",
    functionName: "mongoose",
  });
});

// If the connection throws an error
mongoose.connection.on("error", function (err) {
  console.log({
    level: "error",
    error: err,
    message: `Failed to Connect to Mongoose @ ${db}`,
    fileName: "app.js",
    functionName: "mongoose",
  });
});

// When the connection is disconnected
mongoose.connection.on("disconnected", function () {
  console.log({
    level: "info",
    message: `Server and Mongoose Disconnected from @ ${db}`,
    fileName: "app.js",
    functionName: "mongoose",
  });
});

app.listen(port, () => {
  console.log({
    level: "info",
    message: `Server Started On Port ${port} : (${env})`,
    fileName: "app.js",
  });
});

export default app;
