require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(cors()); // 全開

app.use(express.json()); // <==== parse request body as JSON
morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});
app.use(morgan(":method :url :status :response-time :body"));

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findById(req.params.id)
    .then((person) => {
      res.json(person);
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    res.status(400).json({
      error: "data is not completed",
    });
  }

  Person.findOne({ name: body.name })
    .then((existingPerson) => {
      if (existingPerson) {
        Person.findOneAndUpdate(
          { name: body.name },
          { number: body.number },
          { new: true }
        ).then((updatedPerson) => {
          res.json(updatedPerson);
        });
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        });

        person.save().then((savedPerson) => {
          res.json(savedPerson);
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
    });
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phone book has info for ${
        persons.length
      } people</p><p>${new Date().toUTCString()}</p>`
    );
  });
});

const errorHandler = (err, req, res, next) => {
  console.error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
