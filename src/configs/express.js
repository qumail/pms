import cors from "cors";
import express from "express";
import http from 'http';

import routes from '../routes/index.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use("/health-check", (req, res) => {
  res.send("OK");
});


app.use("/node/pms", routes);

app.all("*", (req, res, next) => {
  next(`Can't find ${req.originalUrl} on this server!`, 404);
});

//app.use((err, req, res, next) => globalErrorHandler(err, req, res, next));

export default server;