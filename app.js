const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const Person = require("./models/person");
const personsRouter = require("./controllers/persons");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connecting to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.use(express.static("dist"));
app.use(cors()); // 全開

app.use(express.json()); // <==== parse request body as JSON
app.use(middleware.requestLogger);

app.use("/api/persons", personsRouter);

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phone book has info for ${
        persons.length
      } people</p><p>${new Date().toUTCString()}</p>`
    );
  });
});

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
