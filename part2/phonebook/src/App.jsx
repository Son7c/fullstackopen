import { useEffect, useState } from "react";
import personService from "./services/persons";

const Filter = ({ filter, handleSearchChange }) => {
  return (
    <div>
      Search: <input type="text" value={filter} onChange={handleSearchChange} />
    </div>
  );
};

const PersonForm = ({
  handleSubmit,
  handleChange,
  handleNoChange,
  newName,
  newNo,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleChange}></input>
      </div>
      <br />
      <div>
        number: <input value={newNo} onChange={handleNoChange}></input>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Persons = ({ filteredPersons,handleDelete }) => {
  return (
    <ul>
      {filteredPersons.map((person) => (
        <li key={person.id}>
          {person.name} &nbsp; {person.number}
          <button onClick={()=>handleDelete(person.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNo, setNewNo] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((data) => {
      setPersons(data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    let isAvail = persons.some((person) => person.name === newName);
    if (isAvail) {
      const id=persons.find(person=>person.name===newName).id;
      const confirm=window.confirm(`${newName} is already added to phonebook Replace old number with new?`);
      if(!confirm) return;
      const updatedPerson={
        name:newName,
        number:newNo
      }
      personService.update(id,updatedPerson)
      .then((res)=>setPersons(persons.map(person=>person.id!==id?person:res)))
      setNewName("");
      setNewNo("");
      return;
    }
    const newPerson = {
      name: newName,
      number: newNo,
    };
    personService
      .create(newPerson)
      .then((res) => setPersons(persons.concat(res)));
    setNewName("");
    setNewNo("");
  };

  const handleDelete = (id) => {
    const toDelete = persons.find(person=> person.id === id);
    const name = toDelete.name;
    const confirm = window.confirm(`Delete ${name}`);
    if(!confirm) return;
    personService.remove(id)
    .then(()=>setPersons(persons.filter(person=>person.id!==id)));
  };

  let filteredPersons = persons.filter((person) =>
    person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()),
  );

  const handleChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNoChange = (event) => {
    setNewNo(event.target.value);
  };
  const handleSearchChange = (event) => {
    setFilter(event.target.value);
  };
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} handleSearchChange={handleSearchChange} />
      <br />
      <h2>Add a person</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        handleNoChange={handleNoChange}
        newName={newName}
        newNo={newNo}
      />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
