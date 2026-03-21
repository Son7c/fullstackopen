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

//Exercise 3.18: "info" Route
app.get("/info", (req, res) => {
  Phone.countDocuments({})
  .then(count=>{
    const date = new Date();
    const info = `<p>Phonebook has info of ${count} people</p> <p>${date}</p>`;
    res.send(info);
  })
  .catch(err=>next(err));
});
//Exercise 3.18
app.get("/api/persons/:id", (req, res,next) => {
  const id = req.params.id;
  Phone.findById(id)
  .then(result=>res.json(result))
  .catch(err=>next(err));
});
//Exercise 3.15
app.delete("/api/persons/:id", (req, res,next) => {
  const id = req.params.id;
  Phone.findByIdAndDelete(id)
  .then(()=>{
    res.status(204).end();
  })
  .catch(err=>next(err));
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

//Exercise 3.17
app.put("/api/persons/:id",(req,res,next)=>{
  const id=req.params.id;
  const{name,number}=req.body;
  const person={
    name,
    number
  }
  Phone.findByIdAndUpdate(id,person,{new:true})
  .then(updated=>{
    if(updated){
      res.json(updated);
    }else{
      res.status(404).end();
    }
  })
  .catch(err=>next(err));

})


const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } 

  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
