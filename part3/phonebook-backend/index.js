const express = require("express");
const app = express();
const morgan = require("morgan");

//Exercise 3.8
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.json());
//3.8
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
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

// Exercise 3.1: Route to return the hardcoded list of persons
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

//Exercise 3.2: "info" Route
app.get("/info", (req, res) => {
  const data = persons.length;
  const date = new Date();
  const info = `<p>Phonebook has info of ${data} people</p>
    <p>${date}</p>`;
  res.send(info);
});
//Exercise 3.3
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((p) => p.id === id);
  if (!person) {
    res.status(404).json({
      error: "User missing",
    });
  } else {
    res.send(person);
  }
});
//Exercise 3.4
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  let person = persons.find((p) => p.id === id);
  if (!person) {
    return res.status(404).send("User doesn't exist");
  }
  persons = persons.filter((p) => p.id !== id);
  res.status(200).json(persons).end();
});
//Exercise 3.5
app.post("/api/persons", (req, res) => {
  let person = req.body;
  if (!person.name || !person.number) {
    res.status(400).send("User name or number is missing");
  }
  //Exercise 3.6
  const exists = persons.find((p) => p.name === person.name);
  if (exists) {
    return res.status(400).json({ error: "Name must be unique" });
  }
  const id = Math.floor(Math.random() * 10000);
  person = { ...person, id: String(id) };
  persons = persons.concat(person);
  res.status(200).json(persons);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
