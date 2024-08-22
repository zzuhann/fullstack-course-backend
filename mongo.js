const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const personName = process.argv[3];
const personNumber = process.argv[4];

const person = new Person({
  name: personName,
  number: personNumber,
});

person.save().then((result) => {
  console.log(`added ${personName} number ${personNumber} to phonebook`);
});

Person.find({}).then((result) => {
  result.forEach((person) => {
    console.log(`${person.name} ${person.number}`);
  });
  mongoose.connection.close();
});
