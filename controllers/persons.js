const personsRouter = require("express").Router();
const Person = require("../models/person");

personsRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

personsRouter.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
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

personsRouter.post("/", (req, res, next) => {
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
          { new: true, runValidators: true, context: "query" }
        ).then((updatedPerson) => {
          res.json(updatedPerson);
        });
      } else {
        const person = new Person({
          name: body.name,
          number: body.number,
        });

        person
          .save()
          .then((savedPerson) => {
            res.json(savedPerson);
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

personsRouter.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

module.exports = personsRouter;
