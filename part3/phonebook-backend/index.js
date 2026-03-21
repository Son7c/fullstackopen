require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require('cors');
const Phone = require('./models/phone');
require('dotenv').config()

//Exercise 3.8
morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.static('dist'))
app.use(express.json());
//3.8
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())


// Exercise 3.1: Route to return the hardcoded list of persons
//3.13 (conncected to mongodb)
app.get("/api/persons", (request, response) => {
  Phone.find({}).then((phones)=>{
    response.json(phones);
  })
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
//Exercise 3.15
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  Phone.findByIdAndDelete(id)
  .then(()=>{
    res.status(204).end();
  })
  .catch(err=>{
    console.log(err);
    res.status(404).end();
  });
});
//Exercise 3.5
app.post("/api/persons", (req, res) => {
  let body = req.body;
  if (!body.name || !body.number) {
    res.status(400).send("User name or number is missing");
  }
  const person=new Phone({
    name:body.name,
    number:body.number
  });
  person.save()
  .then(response=>res.json(response));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
