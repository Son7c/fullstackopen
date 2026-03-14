const express = require('express')
const app = express()

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// Exercise 3.1: Route to return the hardcoded list of persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

//Exercise 3.2: "info" Route 
app.get('/info',(req,res)=>{
    const data=persons.length;
    const date=new Date();
    const info=`<p>Phonebook has info of ${data} people</p>
    <p>${date}</p>`;
    res.send(info);
})
//Exercise 3.3 
app.get('/api/persons/:id',(req,res)=>{
    const id=req.params.id;
    const person=persons.find(p=>p.id===id);
    if(!person){
        res.status(404).json({
            error:"User missing"
        })
    }else{
        res.send(person);
    }
})
//Exercise 3.4
app.delete('/api/persons/:id',(req,res)=>{
    const id=req.params.id;
    const person=persons.find(p=>p.id===id);
    if(!person){
        return res.status(404).send("User doesn't exist");
    }
    persons=persons.filter(p=>p.id!==id);
    res.status(200).json(persons).end();
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})