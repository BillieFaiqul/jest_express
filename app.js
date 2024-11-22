const express = require("express");
const { LISTEN_PORT } = require("./src/config/env");
const { router } = require("./src/config");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// initial function
const app = express();

// app.use(express.static(path.join("src", "storage", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// global middleware --- body parser, rate limit , etc
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// global router
router(app);

const appPort = LISTEN_PORT ?? 5005;

// server listen
app.listen(appPort, () => {
  console.log(`Server connected to the port : ${appPort}`);
});
